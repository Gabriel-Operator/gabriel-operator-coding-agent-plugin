import { App } from '@modelcontextprotocol/ext-apps';
import { createElement as h, createRoot, useState, Input } from '../gabriel-ui.js';
const app = new App({ name: 'My private connector', version: '1.0.0' }, {});
let renderData = () => {};
function View() {
  const [data, setData] = useState({ items: [], manifest: { entities: [] } }), [error, setError] = useState(''), [search, setSearch] = useState('');
  renderData = setData;
  return h('main', {}, h('h1', {}, data.manifest.name || 'My app'), h('label', {}, 'Search records', h(Input, { value: search, onChange: event => setSearch(event.target.value), 'aria-label': 'Search records' })), error && h('p', { role: 'alert' }, error),
    ...data.manifest.entities.map(entity => h('section', { key: entity.id }, h('h2', {}, entity.label), h('button', { onClick: async () => { try { await app.callServerTool({ name: 'gabriel_connector_read', arguments: { entityId: entity.id } }); setError(''); } catch { setError('The source could not refresh. Check this app’s connection.'); } } }, 'Refresh source'), h('table', {}, h('thead', {}, h('tr', {}, ...entity.fields.map(field => h('th', { key: field.key, scope: 'col' }, field.label)))), h('tbody', {}, ...data.items.filter(item => item.entityId === entity.id && JSON.stringify(item.data).toLowerCase().includes(search.toLowerCase())).map(item => h('tr', { key: item.id }, ...entity.fields.map(field => h('td', { key: field.key }, String(item.data[field.key] ?? ''))))))))));
}
createRoot(document.getElementById('root')).render(h(View));
app.ontoolinput = ({ arguments: data }) => renderData(data);
void app.connect().catch(() => {});
