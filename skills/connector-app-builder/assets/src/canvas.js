import { App } from '@modelcontextprotocol/ext-apps';
import { createElement as h, createRoot, useEffect, useState, Input } from '../gabriel-ui.js';

const app = new App({ name: 'Canvas starter', version: '1.0.0' }, {});

function readSaved(result) {
  const saved = result?.structuredContent || result || {};
  return { state: saved.state || {}, revision: Number(saved.revision || 0) };
}

function Canvas() {
  const [surface, setSurface] = useState(null);
  const [score, setScore] = useState(0);
  const [revision, setRevision] = useState(0);
  const [label, setLabel] = useState('Score');
  useEffect(() => {
    let ignore = false;
    void app.callServerTool({ name: 'gabriel_app_state_read', arguments: {} }).then(result => {
      if (ignore) return;
      const saved = readSaved(result);
      setScore(Number(saved.state.score || 0));
      setLabel(typeof saved.state.label === 'string' ? saved.state.label : 'Score');
      setRevision(saved.revision);
    }).catch(() => {});
    return () => { ignore = true; };
  }, []);
  useEffect(() => {
    if (!surface) return;
    const context = surface.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, surface.width, surface.height);
    context.fillStyle = '#127b90';
    context.fillRect(24, 24, 40 + Math.min(score, 240), 40);
    context.fillStyle = '#172026';
    context.font = '16px sans-serif';
    context.fillText(`${label}: ${score}`, 24, 90);
  }, [surface, score, label]);
  const save = async next => {
    const result = await app.callServerTool({ name: 'gabriel_app_state_write', arguments: { state: { score: next, label }, expectedRevision: revision, requestId: crypto.randomUUID() } });
    const saved = readSaved(result);
    setScore(Number(saved.state.score ?? next));
    setRevision(saved.revision);
  };
  return h('main', {},
    h('h1', {}, 'Canvas starter'),
    h('canvas', { ref: setSurface, width: 320, height: 120, 'aria-label': 'Game canvas' }),
    h('label', {}, 'Score label', h(Input, { value: label, onChange: event => setLabel(event.target.value), 'aria-label': 'Score label' })),
    h('button', { type: 'button', onClick: () => void save(score + 1) }, 'Add point'));
}

createRoot(document.getElementById('root')).render(h(Canvas));
void app.connect().catch(() => {});
