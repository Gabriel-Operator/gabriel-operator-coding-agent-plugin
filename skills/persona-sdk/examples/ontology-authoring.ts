/** Validate/preview a local candidate with a workspace token; --save opts into candidate writing. */
import fs from 'node:fs/promises';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
const key=process.env.GABRIEL_WORKSPACE_TOKEN,pageId=process.env.GABRIEL_PAGE_ID,file=process.argv[2];
if(!key||!pageId||!file)throw new Error('Set GABRIEL_WORKSPACE_TOKEN (admin), GABRIEL_PAGE_ID and pass a candidate JSON file.');
const client=new Client({name:'ontology-authoring-example',version:'1.0.0'});
async function call(name:string,args:Record<string,unknown>){
  const result=await client.callTool({name,arguments:{pageId,...args}});
  if(result.isError)throw new Error(JSON.stringify(result.content));
  const text=(result.content as Array<{type:string;text?:string}>).find(item=>item.type==='text')?.text;
  return text?JSON.parse(text):result;
}
async function main(){
  const definition=JSON.parse(await fs.readFile(file,'utf8'));
  await client.connect(new StreamableHTTPClientTransport(new URL('/mcp/gateway',process.env.GABRIEL_BASE_URL||'https://gabrieloperator.com'),{requestInit:{headers:{Authorization:`Bearer ${key}`}}}));
  try {
    const current=await call('gabriel_get_ontology',{});
    const validation=await call('gabriel_validate_ontology',{definition});
    console.log(JSON.stringify(validation,null,2));if(!validation.valid)throw new Error('Fix candidate compatibility issues before saving.');
    const preview=await call('gabriel_preview_ontology',{definition,scopeId:'global',language:'en'});
    console.log(JSON.stringify(preview,null,2));
    if(process.argv.includes('--save'))console.log(JSON.stringify(await call('gabriel_save_ontology',{definition,expectedHeadSha:current.headSha})));
    // Saving is not activation. Use existing workspace/candidate evaluation and publication tools afterwards.
  }finally{await client.close();}
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
