import type { NextPage } from 'next'
import React, { useState } from "react";
import fs from 'fs'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

const Home: NextPage = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [files,setFiles] = useState([] as any)

    const inputFileRef = React.useRef<HTMLInputElement | null>(null);
    
    const handleOnClick = async (e: React.MouseEvent<HTMLInputElement>) => {
        const ffmpeg = createFFmpeg({corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',log: true });
        /* Prevent form from submitting by default */
        e.preventDefault();
        let audio = document.createElement('audio');
        /* If file is not selected, then show alert message */
        if (!inputFileRef.current?.files?.length) {
            alert('Please, select file you want to upload');
            return;
        }
        
        setIsLoading(true);

        /* Add files to FormData */
        const formData = new FormData();
        Object.values(inputFileRef.current.files).forEach(file => {
          var reader = new FileReader();
          reader.readAsDataURL(file)
          const mb = file.size * 10 **-6
          const divide = mb / 100 
        
          reader.onloadend = (e) => {
          audio.src = reader.result as any;
          audio.addEventListener('loadedmetadata', function(){
            // Obtain the duration in seconds of the audio file (with milliseconds as well, a float value)
            var duration = audio.duration / divide
            
           
            let newFiles: any[] = [];
            (async () => {
          
              let start = 0
              let end = duration
              let i = 0
              const done = new Uint8Array(audio.src as any)
              while(end < audio.duration) {
            await ffmpeg.load();
                  
              await ffmpeg.FS('writeFile',`${i}.mp3`,await fetchFile(file));
              await ffmpeg.run('-ss',start.toString(),'-to',end.toString(),'-i',`audio.mp3`,`output${i}.mp3`);
              const output = ffmpeg.FS("readFile", `output${i}.mp3`);
              console.log("OUTPUT!",output)
              newFiles = [...newFiles,output];
              start = end
              end += duration
              i = i + 1;
              }
              console.log("FILES ARE!",newFiles)
              setFiles(newFiles)
              process.exit(0);
            })();
        
            // example 12.3234 seconds
            console.log("The duration of the song is of: " + duration + "minutes");
            // Alternatively, just display the integer value with
            // parseInt(duration)
            // 12 seconds
        },false);
          }
            formData.append('file', file);
        })

        /* Send request to our api route */
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const body = await response.json() as { status: 'ok' | 'fail', message: string };

        alert(body.message);

        if (body.status === 'ok') {
            inputFileRef.current.value = '';
            // Do some stuff on successfully upload
        } else {
            // Do some stuff on error
        }

        setIsLoading(false);
    };

    return (
<div>
            <div>
                <input type="file" name="myfile" accept="audio/*" ref={inputFileRef} />
            </div>
            <div>
                <input type="submit" value="Upload" disabled={isLoading} onClick={handleOnClick} />
                {isLoading && ` Wait, please...`}
                {files.length && 
                 files.map((file: any,i: number) => {return (
                <audio key={i} src={file} />)})}
            </div>
            </div>
    )
}

export default Home