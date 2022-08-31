import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import * as IPFS from 'ipfs-core'
import { ipfs } from '..'
import { CID } from 'ipfs-http-client'



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const jsons = JSON.parse(req.body)
  const files = jsons.files.map((json: any,i: any) => {
return {path: `/file/${i}.json`,content: JSON.stringify(json)}
  })
  let cid = null as any
  for await (const result of ipfs.addAll(files)) {
    if(result.path === 'file') {
      cid = result.cid.toString()
    }
  }
 
  res.status(200).json({cid})
}

