/** Read the token-bound persona ontology through MCP. Requires app-read consent. */
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
const key=process.env.GABRIEL_API_KEY;
if(!key)throw new Error('Set GABRIEL_API_KEY to a Persona Token.');
const client=new Client({name:'ontology-example',version:'1.0.0'});
async function main(){
  await client.connect(new StreamableHTTPClientTransport(new URL('/mcp/persona',process.env.GABRIEL_BASE_URL||'https://gabrieloperator.com'),{requestInit:{headers:{Authorization:`Bearer ${key}`}}}));
  try {const result=await client.callTool({name:'persona_get_ontology',arguments:{resourceType:'persona',view:'overview',language:process.env.GABRIEL_LANGUAGE||'en'}});console.log(JSON.stringify(result,null,2));}
  finally{await client.close();}
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
