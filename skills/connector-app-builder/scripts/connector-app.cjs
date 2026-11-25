#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
function pack(directory) {
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'app-config.json'), 'utf8')), files = {}, fixtures = {};
  function walk(sub) { for (const entry of fs.readdirSync(path.join(directory, sub), { withFileTypes: true })) {
    const relative = path.posix.join(sub.split(path.sep).join('/'), entry.name);
    if (entry.isSymbolicLink()) throw new Error('Package symlinks are not allowed.');
    if (entry.isDirectory()) { if (!['node_modules', 'src', '.git'].includes(entry.name)) walk(relative); }
    else if (relative.startsWith('fixtures/') && relative.endsWith('.json')) fixtures[path.basename(relative, '.json')] = JSON.parse(fs.readFileSync(path.join(directory, relative), 'utf8'));
    else if (/\.(html|js|css|svg|txt)$/.test(relative)) files[relative] = fs.readFileSync(path.join(directory, relative), 'utf8');
  } }
  walk(''); const pkg = { manifest, files, fixtures }; validate(pkg); return pkg;
}
function validate(pkg) {
  const Ajv = require('ajv'), schema = require('../references/connector-package.schema.json');
  const ajv = new Ajv({ strict: false, allErrors: true, validateFormats: false }), check = ajv.compile(schema);
  if (!check(pkg)) throw new Error(ajv.errorsText(check.errors));
  if (Buffer.byteLength(JSON.stringify(pkg)) > 4 * 1024 * 1024 || Object.keys(pkg.files).length > 100) throw new Error('Package exceeds 4 MB / 100 files.');
  for (const file of Object.keys(pkg.files)) if (!/^[a-zA-Z0-9_.\/-]+$/.test(file) || file.startsWith('/') || file.split('/').some(part => part === '..' || !part) || !/\.(html|js|css|json|svg|txt)$/.test(file)) throw new Error('Unsafe package path: ' + file);
  if (pkg.manifest.ui.kind === 'bundle' && !pkg.files[pkg.manifest.ui.entrypoint]) throw new Error('Missing bundled UI entrypoint.');
  const dependencies = pkg.manifest.connectors || [];
  if (new Set(dependencies.map(item => item.key)).size !== dependencies.length || dependencies.some(item => item.key === 'default' || Object.prototype.hasOwnProperty.call(Object.prototype, item.key))) throw new Error('Use unique connector keys; default is reserved.');
  const operations = [...pkg.manifest.entities.flatMap(entity => [entity.read, ...(entity.write ? [entity.write] : [])]), ...pkg.manifest.actions.map(action => action.operation)];
  for (const operation of [...operations, pkg.manifest.ui]) if (operation.connector && !dependencies.some(item => item.key === operation.connector)) throw new Error('Every operation and provider UI must name a declared connector.');
  const inspect = value => { if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) { if (/^(authorization|api[_-]?key|password|client[_-]?secret|access[_-]?token|refresh[_-]?token)$/i.test(key) && child) throw new Error('Keep credentials in a private connection.'); inspect(child); } };
  for (const operation of operations) inspect(operation.arguments);
  const playbooks = pkg.manifest.playbooks || [];
  if (new Set(playbooks.map(book => book.key)).size !== playbooks.length) throw new Error('Playbook keys must be unique.');
  for (const book of playbooks) if (new Set(book.inputFields || []).size !== (book.inputFields || []).length) throw new Error('Each playbook input field must be unique.');
  for (const requirement of dependencies) if (requirement.endpoint) { const url = new URL(requirement.endpoint); if (url.protocol !== 'https:' || url.username || url.password || url.hash || url.search) throw new Error('Use a remote HTTPS connector endpoint without credentials.'); }
  const endpoint = pkg.manifest.source.endpoint && new URL(pkg.manifest.source.endpoint);
  if (endpoint && (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.hash || endpoint.search)) throw new Error('Use a remote HTTPS endpoint without credentials.');
  return pkg;
}
async function call(operation, input) {
  const token = process.env.GABRIEL_API_TOKEN, base = new URL(process.env.GABRIEL_BASE_URL || 'https://gabrieloperator.com');
  if (!token || base.protocol !== 'https:' && !(base.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname))) throw new Error('Set GABRIEL_API_TOKEN and a public HTTPS GABRIEL_BASE_URL.');
  const response = await fetch(new URL('/api/gateway/connector-apps/' + encodeURIComponent(operation), base), { method: 'POST', redirect: 'error', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify(input), signal: AbortSignal.timeout(120000) });
  const result = await response.json(); if (!response.ok || !result.success) throw new Error(result.error?.message || 'Connector request failed.'); return result.data;
}
async function main() {
  const [operation, argument, metadata] = process.argv.slice(2);
  if (operation === 'init') {
    const directory = path.resolve(argument); fs.mkdirSync(path.join(directory, 'src'), { recursive: true }); fs.mkdirSync(path.join(directory, 'fixtures'), { recursive: true });
    for (const file of ['package.json', 'mcp-app.html', 'gabriel-ui.js', 'gabriel-ui.css']) fs.copyFileSync(path.join(__dirname, '../assets', file), path.join(directory, file));
    fs.copyFileSync(path.join(__dirname, '../assets/src/main.js'), path.join(directory, 'src/main.js'));
    fs.copyFileSync(path.join(__dirname, '../assets/src/canvas.js'), path.join(directory, 'src/canvas.js')); console.log(directory); return;
  }
  if (operation === 'pack') { const pkg = pack(path.resolve(argument)), output = path.join(path.resolve(argument), 'connector-package.json'); fs.writeFileSync(output, JSON.stringify(pkg)); console.log(output); return; }
  if (operation === 'validate') { validate(JSON.parse(fs.readFileSync(argument, 'utf8'))); console.log('Package valid offline; live discovery remains required.'); return; }
  if (operation === 'export') {
    if (!argument || !metadata) throw new Error('Use export <app-directory> <deployment.json> with backendUrl, installationId and appRevision.');
    const directory = path.resolve(argument), config = JSON.parse(fs.readFileSync(metadata, 'utf8'));
    const { createExport, sourceFiles } = require('../hosting/export.cjs');
    const files = { ...createExport(pack(directory), config), ...sourceFiles(directory) }, target = path.resolve(directory + '-hosted');
    if (fs.existsSync(target)) throw new Error('The export directory already exists; choose a fresh project copy.');
    for (const [name, content] of Object.entries(files)) { const destination = path.join(target, name); fs.mkdirSync(path.dirname(destination), { recursive: true }); fs.writeFileSync(destination, content); }
    console.log(target); return;
  }
  let input = argument ? JSON.parse(fs.readFileSync(argument, 'utf8')) : {};
  if (['preview', 'register'].includes(operation)) { const extra = metadata ? JSON.parse(fs.readFileSync(metadata, 'utf8')) : {}; input = { ...extra, package: validate(input) }; }
  if (operation === 'register' && !input.idempotencyKey) throw new Error('Save a stable idempotencyKey in the metadata file before registering.');
  const result = await call(operation, input);
  // Definitions and preview data are creator-private. Keep local outputs owner-readable.
  const output = path.resolve('connector-' + operation + '-result.json'); fs.writeFileSync(output, JSON.stringify(result, null, 2), { mode: 0o600 }); console.log(output);
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { pack, validate, call };
