import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import config from './gabriel-host.json' with {type:'json'};
import {createAppBridge} from './runtime.mjs';
const bridge=createAppBridge(config), root=path.resolve('public');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json','.webmanifest':'application/manifest+json'};
http.createServer(async(req,res)=>{
 const pathname=new URL(req.url,'http://app.invalid').pathname;
 if(pathname.startsWith('/api/')){await bridge(req,res);return;}
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405).end();return;}
 try{
  const name=decodeURIComponent(pathname==='/'?'/index.html':pathname),file=path.resolve(root,'.'+name);
  if(!file.startsWith(root+path.sep)){res.writeHead(404).end();return;}
  const data=await fs.readFile(file);res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-cache');res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404).end('Not found');}
}).listen(Number(process.env.PORT||8080),'0.0.0.0',()=>console.log('Studio UI is ready. Agents, connectors and data remain on Gabriel.'));
