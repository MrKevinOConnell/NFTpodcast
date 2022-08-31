// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
 
const filePath = path.resolve('.', 'public/static/audio.mp3')
const imageBuffer = fs.readFileSync(filePath)
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  
 
  

  res.setHeader('Content-Type', 'audio/mp3')
  res.send(imageBuffer)
}
