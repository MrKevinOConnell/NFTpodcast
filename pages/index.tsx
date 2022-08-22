import type { NextPage } from 'next'
import React, { useState } from "react";
import fs from 'fs'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

const Home: NextPage = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [files,setFiles] = useState([] as any)
    const [paused,setIsPaused] = useState([] as boolean[])
    const inputFileRef = React.useRef<HTMLInputElement | null>(null);
    const getVideo = async (vid: any) => {
        const video = await fetchFile(
          vid
        );
        return video;
      };
   const renderClips = async(duration: number,src: string, divide: number) => {
    let urls: string[] = []
    var finalDuration = duration / divide
    let start = 0
    let end = finalDuration
    let i = 0
    const ffmpeg = createFFmpeg({corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',log: true });
    const video = await getVideo(src)
    while(end < finalDuration) {
    (async () => {
        await ffmpeg.load();
        ffmpeg.FS('writeFile',`${i}.mp3`,video);
        try {
        await ffmpeg.run('-ss',start.toString(),'-to',end.toString(),'-i',`${src}`,`${i}.mp3`);
        }
        catch(e) {
            console.log("e",e)
        }
        const output = ffmpeg.FS("readFile",`${i}.mp3`);
        
     const blob = new Blob([output.buffer]);
     const url = await URL.createObjectURL(blob)
   
    urls = [...urls,url]
    console.log("URLS",urls)
    start = end
    end += finalDuration
    i += 1
      })()
    }
    (async () => {
        await ffmpeg.load();
        ffmpeg.FS('writeFile',`${i}.mp3`,await fetchFile(src));
        try {
        await ffmpeg.run('-ss',start.toString(),'-to',duration.toString(),'-i',`${src}`,`${i}.mp3`);
        }
        catch(e) {
            console.log("e",e)
        }
        const output = ffmpeg.FS("readFile", `${i}.mp3`);
        
     const blob = new Blob([output.buffer]);
     const url = await URL.createObjectURL(blob)
    urls = [...urls,url]

      })()
      console.log("URLS",urls)
      return urls
   }
    const handleOnClick = async (e: React.MouseEvent<HTMLInputElement>) => {
        let audio = document.createElement('audio');
       
        /* Prevent form from submitting by default */
        e.preventDefault();
      
        /* If file is not selected, then show alert message */
        if (!inputFileRef.current?.files?.length) {
            alert('Please, select file you want to upload');
            return;
        }
        
        setIsLoading(true);

        /* Add files to FormData */
        const formData = new FormData();
        Object.values(inputFileRef.current.files).forEach(async file => {
          var reader = new FileReader();
          reader.readAsDataURL(file)
          const mb = file.size * 10 **-6
          const divide = mb / 100 
        
          reader.onloadend = (e) => {
          audio.src = reader.result as any;
          audio.addEventListener('loadedmetadata', async function() {
            // Obtain the duration in seconds of the audio file (with milliseconds as well, a float value)
          
         
            try {
           const urls = await Promise.resolve(renderClips(audio.duration,audio.src,divide))
            setFiles(urls)

            setIsLoading(false); 
        }
        catch(e) {
            console.log(e)
        }
            // example 12.3234 seconds
            // Alternatively, just display the integer value with
            // parseInt(duration)
            // 12 seconds
        },false);
          }
        })

        /* Send request to our api route */


      
    };

    return (
<div>
            <div>
                <input type="file" name="myfile" accept="audio/*" ref={inputFileRef} />
            </div>
            <div>
                <input type="submit" value="Upload" disabled={isLoading} onClick={handleOnClick} />
                {isLoading && ` Wait, please...`}
                {files.length && files.map((file: any,i: number) => {  
                const audio = new Audio(file);
            
                  return (
                    <div key={i}>
                    <button onClick={() => {
                        paused[i] ? audio.play() : audio.pause()
                        let pause = [...paused]
                        pause[i] = !paused[i]
                        setIsPaused(pause)
                        }}>{`Play clip ${i}`}</button>
                  </div>)})}
            </div>
            </div>
    )
}

export default Home