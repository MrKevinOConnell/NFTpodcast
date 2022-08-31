import type { NextPage } from 'next'
import React, { useEffect, useState } from "react";
import fs from 'fs';
import file from './../contractabi.json';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import ReactAudioPlayer from 'react-audio-player';
import Web3 from 'web3';
import { ethers } from 'ethers';
import { Profile } from './Profile';
import ResponsiveAppBar from './ResponsiveAppBar';
import { create } from 'ipfs-http-client';
interface Window {
  ethereum: any
}
export const ipfs = create();

const Home: NextPage = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isImageLoading, setImageIsLoading] = React.useState(false);
    const [files,setFiles] = useState([] as any)
    const [image,setImage] = useState(null as any)
    const [percent,setPercent] = useState(0)
    const inputFileRef = React.useRef<HTMLInputElement | null>(null);
    const imageFileRef = React.useRef<HTMLInputElement | null>(null);
    const [isLoadingMint,setIsLoadingMint] = useState(false)

function shuffle(array: any[]) {
      let currentIndex = array.length,  randomIndex;
    
      // While there remain elements to shuffle.
      while (currentIndex != 0) {
    
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }
    
      return array;
    }
const addJSON = async  (jsonn: any) => {
  var jsonse = JSON.stringify(jsonn);
var blob = new Blob([jsonse], {type: "application/json"});
  let body = new FormData();
  body.append('file',blob);
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const res = await fetch(url, {
          method: "POST",
          body,
          headers: {
            'pinata_api_key': "491312baf3aadc88bf8e",
            'pinata_secret_api_key': "3f9b035548bd6b91fb39bdeb35c47401788b7bd8f30a7b773740417f50bb751a",
        }
      })
      const json = await res.json()
      console.log("json",json)
      return json.IpfsHash as string
};

  const addFile = async  (image: any) => {
    const file = await convertBackToFile(image)
    let body = new FormData();
    body.append('file',file);
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
      const res = await fetch(url, {
            method: "POST",
            body,
            headers: {
              'pinata_api_key': "491312baf3aadc88bf8e",
              'pinata_secret_api_key': "3f9b035548bd6b91fb39bdeb35c47401788b7bd8f30a7b773740417f50bb751a",
          }
        })
        const json = await res.json()
        console.log("json",json)
        return json.IpfsHash as string
};
    
    const getVideo = async (vid: any) => {
        const video = await fetchFile(
          vid
        );
        return video;
      };
    const convertBackToFile = async (url: any) => {
      let blob = await fetch(url).then(r => r.blob());
      return blob
      }
      
const mint = async () => {
const { ethereum } = window;
try {
  setIsLoadingMint(true)
  let cid = await generateFileCID()
  
setIsLoadingMint(false)
}
catch(e) {
  console.log(e)
  setIsLoadingMint(false)
}
}

      const generateFileCID = async () => {
       if (!files || !image) {
         return null;
       }
       else {

        const ipfsBase = "https://gateway.pinata.cloud/ipfs/"
        try {
        const newImage = ipfsBase + await addFile(image)
         const jsons = await Promise.all(files.map(async (file: URL,i: number) => {
          const newFile = ipfsBase + await addFile(file)
          const URI = {name: `Part ${i + 1} of Podcast`, description: `This is part ${i + 1} of the NFT podcast`, image: newImage, animation_url: newFile}
          return URI
         }))
         
    const url = `/api/addFilesIPFS`;
      const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({files: jsons}),
        })
        const json = await res.json()
        console.log("json cid",json.cid)
        const data = JSON.stringify({
          "hashToPin": json.cid,
          "pinataMetadata": {
            "name": "Podcast",
          }
        });

        const pinurl = `https://api.pinata.cloud/pinning/pinByHash`;
        const pinres = await fetch(pinurl, {
              method: "POST",
              body: data,
              headers: {
                  'pinata_api_key': "491312baf3aadc88bf8e",
                  'pinata_secret_api_key': "3f9b035548bd6b91fb39bdeb35c47401788b7bd8f30a7b773740417f50bb751a",
                  'Content-Type': 'application/json'
              }
          })
          const pinjson = await pinres.json()
          console.log("PIN json ", pinjson)
        return {cid: json.cid,supply: jsons.length}
        }
        catch(e) {
          console.log(e)
        }
       }
      }
      const getUrl = async (start: string, end: string,src: string,i: number) => {
        const ffmpeg = createFFmpeg({corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',log: true });
        const video = await getVideo(src);
            await ffmpeg.load();
            ffmpeg.FS('writeFile',`${i}.mp3`,video);
            try {
            await ffmpeg.run('-i',`${i}.mp3`,'-ss',start.toString(),'-to',end.toString(),`${i}done.mp3`);
            }
            catch(e) {
                console.log("e",e)
            }
         const data = ffmpeg.FS('readFile',`${i}done.mp3`);

       const url =  URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mp3' }));
       console.log("URL IS",url)
        return url
      }
   const renderClips = async(duration: number,src: string, divide: number) => {
    let times: any[] = []
    let urls: string[] = []
    var finalDuration = Math.floor(duration / divide)
    let start = 0
    let end = finalDuration
    while(end < duration) {
        const time ={start, end}
        console.log('times',time)
        times = [...times,time]
        start = end
        end += finalDuration
    }
    const time = {start,end: duration}
    times = [...times,time]
    console.log("TIMES ARE",times)
    let pct = 0
    urls = await Promise.all(times.map(async (time,i) => {
       const url = await getUrl(time.start,time.end,src,i)
       setPercent(pct + (100/times.length))
        return url
    }))
      console.log("URLS",urls)
      return urls
   }
   const handleImageOnClick = async (e: React.MouseEvent<HTMLInputElement>) => {
   
    /* Prevent form from submitting by default */
    e.preventDefault();
  
    /* If file is not selected, then show alert message */
    if (!imageFileRef.current?.files?.length) {
        alert('Please, select file you want to upload');
        return;
    }
    setImageIsLoading(true);
    /* Add files to FormData */
    Object.values(imageFileRef.current.files).forEach(async file => {
      var reader = new FileReader();
      reader.readAsDataURL(file)
      reader.onloadend = (e) => {
        setImage(reader.result)
        setImageIsLoading(false)
      }
    })
    setImageIsLoading(false)  
};
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
            console.log("ERROR IS",e)
            setIsLoading(false)
        }
        },false);
          }
        })

        /* Send request to our api route */


      
    };

    return (
<div>          
            <div style={{display: "flex", flexDirection: "column",justifyContent: "space-between"}}>
            <input type="file" name="myfile" accept="audio/*" ref={inputFileRef} />
            <input type="submit" style={{width: "8%"}} value="Upload" disabled={isLoading} onClick={handleOnClick} />
            <input type="file" name="myfile" accept="image/*" ref={imageFileRef} />
            <input type="submit" style={{width: "8%"}} value="Upload Image" disabled={isImageLoading} onClick={handleImageOnClick} />

                {isLoading && ` Wait, please...,${percent} percent done.`}
                </div>
                <div style={{display: "flex", flexDirection: "column",justifyContent: "space-between"}}>
                

                {image && files.filter((e: any) => e).length && <Button disabled={isLoadingMint}  onClick={async () => {
             
            
                   await mint()
                   }}>mint</Button>}
                {files && files.map((file: any,i: number) => {  
                  return (
                    <div style={{display: "flex",justifyContent: "center", margin: "10px"}} key={i}>
                        <p>Audio part {i} </p>
                    <ReactAudioPlayer
  src={file}
  controls
/>
                  </div>)})}
            { image && <img width={100} src={image} alt="image" />}
                  </div>
           
            </div>
    )
}

export default Home