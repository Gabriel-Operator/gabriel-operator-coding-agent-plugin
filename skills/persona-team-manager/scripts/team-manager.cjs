'use strict';
const fs = require('node:fs');
const { studioAssetSchema, normalizeStudioPlaybook } = require('./studio-program.cjs');
const operations = new Set(['export_definitions','commit_definitions','migrate_definitions','recover_definitions','register_playbook','start_playbook','get_playbook_run','cancel_playbook_run','resolve_connection_request','bind_program_connector','approve_program_effect','capture_program_procedure','adopt_program_procedure','program_automation','activate_program_automation','enroll_program_automation','configure_publisher','meeting_cycles','map_meeting_contact','resume_meeting_cycle','briefing_phones','bind_briefing_phone','resources','save_resource','resource_data','import_team_model','finish_team_setup','connector_catalog','connector_accounts','inspect_connector','prepare_connector','list_connectors','install_connector','get_team','read_page','read_receipt','threads','read_thread','create_page','append_to_page','add_memory_note','post_message','start_thread','post_to_thread','resolve_comment','comment_on_page','resolve_suggestion','restore_page','work','get_tasks','read_execution','read_plan','update_goal','team_room','resolve_thread','knowledge_search','knowledge_read','knowledge_create','knowledge_update','knowledge_lifecycle','knowledge_graph','knowledge_reviews','knowledge_suggest','knowledge_review','knowledge_export','knowledge_import']);
async function call(operation, input) {
  if (!operations.has(operation) && !['publishers','capture_connections','bind_capture_connection','connection_setup','preview_result_mapping'].includes(operation)) throw new Error('Unknown team-manager operation.');
  if(process.env.GABRIEL_TEAM_MCP_URL){
    const endpoint=new URL(process.env.GABRIEL_TEAM_MCP_URL);
    if(endpoint.protocol!=='https:' && !(endpoint.protocol==='http:' && ['localhost','127.0.0.1'].includes(endpoint.hostname)) || endpoint.username || endpoint.password || !process.env.GABRIEL_API_TOKEN)throw new Error('Use your team-scoped MCP URL and one-hour session key.');
    const response=await fetch(endpoint,{method:'POST',redirect:'error',headers:{Authorization:'Bearer '+process.env.GABRIEL_API_TOKEN,'Content-Type':'application/json',Accept:'application/json, text/event-stream'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'tools/call',params:{name:'app_studio_'+operation,arguments:input}}),signal:AbortSignal.timeout(120000)});
    const data=await response.json();if(!response.ok||data.error)throw new Error(data.error?.message||'Team setup request failed.');
    const text=data.result?.content?.find(item=>item.type==='text')?.text;if(!text)throw new Error('The team tool returned no result.');return JSON.parse(text);
  }
  const base = new URL(process.env.GABRIEL_BASE_URL || 'https://gabrieloperator.com');
  if (base.protocol !== 'https:' || base.username || base.password || !process.env.GABRIEL_API_TOKEN) throw new Error('Set your HTTPS GABRIEL_BASE_URL and session GABRIEL_API_TOKEN.');
  const response = await fetch(new URL('/api/v1/app/studio/' + operation, base), { method: 'POST', redirect: 'error', headers: { Authorization: 'Bearer ' + process.env.GABRIEL_API_TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify(input), signal: AbortSignal.timeout(120000) });
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error(result.error?.message || 'The Studio request failed.');
  return result.data;
}
async function main() {
  const [command, file, outputFile] = process.argv.slice(2);
  const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
  let result, output = outputFile || 'studio-result.json';
  if (command === 'fingerprint') { const value = normalizeStudioPlaybook(read(file)); const stable = v => Array.isArray(v) ? '[' + v.map(stable).join(',') + ']' : v && typeof v === 'object' ? '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + stable(v[k])).join(',') + '}' : JSON.stringify(v) ?? 'null'; console.log(require('node:crypto').createHash('sha256').update(stable(value)).digest('hex')); return; }
  if (command === 'validate') { const value = read(file); studioAssetSchema.parse(value.asset || value); console.log('Definition valid offline. Live scope and source pins still require preview.'); return; }
  if (command === 'export') { result = await call('export_definitions', {}); output = file || 'studio-snapshot.json'; }
  else if (command === 'preview' || command === 'commit') { const proposal = read(file); studioAssetSchema.parse(proposal.asset); result = await call('commit_definitions', { asset: proposal.asset, expectedRevision: proposal.expectedRevision, expectedHead: proposal.expectedHead, validateOnly: command === 'preview' }); }
  else if (command === 'call') { result = await call(file, read(outputFile)); output = 'studio-result.json'; }
  else throw new Error('Use export, validate, preview, commit or call.');
  fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', { mode: 0o600 }); console.log(output);
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { call };
