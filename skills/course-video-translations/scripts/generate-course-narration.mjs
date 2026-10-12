#!/usr/bin/env node
/**
 * Writes translated course narration into a persona repository.
 * The API key is read from the environment and is never written to disk.
 */
import fs from 'node:fs';
import path from 'node:path';

const PROVIDERS = {
  elevenlabs: { env: 'ELEVENLABS_API_KEY' },
  'google-direct-audio': { env: 'GEMINI_API_KEY' },
  cartesia: { env: 'CARTESIA_API_KEY' },
  deepgram: { env: 'DEEPGRAM_API_KEY' },
  'openai-audio': { env: 'COMET_API_KEY' },
  'fal-minimax-speech': { env: 'FAL_KEY' },
  'fal-chatterbox-tts': { env: 'FAL_KEY' },
  'openrouter-audio': { env: 'OPENROUTER_API_KEY' },
  'xai-audio': { env: 'XAI_API_KEY' },
};

const COURSE_SLUG = { neural: 'ai', motion: 'matter', living: 'living', electricity: 'electricity' };
const AGES = ['9–11', '12–14'];

function argument({ name }) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] || '' : '';
}

function fail({ message }) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function marketplaceRoot() {
  let dir = path.dirname(new URL(import.meta.url).pathname);
  for (let i = 0; i < 8; i += 1) {
    if (fs.existsSync(path.join(dir, 'public', 'assets')) && fs.existsSync(path.join(dir, 'server', 'skills'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../../..');
}

function sentence({ text }) {
  const value = String(text || '').replace(/\s+/g, ' ').trim();
  if (!value) return '';
  return /[.!?。？！]$/.test(value) ? value : `${value}.`;
}

function courseSlug({ courseId }) {
  return COURSE_SLUG[courseId] || String(courseId || '').trim().toLowerCase();
}

function spokenScript({ course }) {
  const parts = [];
  for (const age of AGES) {
    const entry = course.ageContent?.[age];
    if (!entry) continue;
    const puzzle = entry.puzzle || {};
    const correct = Array.isArray(puzzle.choices) ? puzzle.choices[puzzle.correct] : '';
    if (age === '9–11') {
      parts.push(entry.title, entry.goal, puzzle.prompt, correct, puzzle.hint);
      if (Array.isArray(entry.lessons)) parts.push(...entry.lessons);
    } else {
      parts.push(puzzle.prompt, correct, puzzle.hint);
    }
  }
  return parts.map(text => sentence({ text })).filter(Boolean).join(' ');
}

function landingPages({ personaRoot }) {
  const assets = path.join(personaRoot, 'assets');
  return fs.readdirSync(assets)
    .filter(name => name.startsWith('landing-page.') && name.endsWith('.json'))
    .map(name => {
      const match = name.match(/^landing-page\.(?:([a-z0-9-]+)\.)?([a-z0-9-]+)\.json$/);
      if (!match) return null;
      return {
        name,
        regionKey: match[1] || '',
        language: match[2],
        filePath: path.join(assets, name),
      };
    })
    .filter(page => page && page.language && page.language !== 'en');
}

function suffixFor({ page }) {
  return page.regionKey ? `${page.regionKey}.${page.language}` : page.language;
}

async function speakWithElevenLabs({ text, language, apiKey, voiceId }) {
  const models = [
    { model_id: 'eleven_v3', language_code: language },
    { model_id: 'eleven_multilingual_v2' },
  ];
  let lastError = 'ElevenLabs did not return audio';
  for (const body of models) {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, ...body }),
    });
    if (response.ok) return Buffer.from(await response.arrayBuffer());
    lastError = `ElevenLabs ${response.status}`;
    if (response.status !== 400 && response.status !== 422) break;
  }
  throw new Error(lastError);
}

function writeManifest({ mediaDir, persona }) {
  const keys = fs.readdirSync(mediaDir)
    .map(name => {
      const match = name.match(new RegExp(`^${persona}-course-(.+)-intro\\.(.+)\\.mp3$`));
      return match ? `${match[1]}:${match[2]}` : '';
    })
    .filter(Boolean)
    .sort();
  fs.writeFileSync(path.join(mediaDir, 'manifest.json'), `${JSON.stringify({ keys }, null, 2)}\n`);
  process.stdout.write(`manifest ${keys.length}\n`);
}

const personaRoot = path.resolve(argument({ name: '--persona-root' }));
const persona = argument({ name: '--persona' });
const provider = argument({ name: '--provider' }) || 'elevenlabs';
const voiceId = argument({ name: '--voice-id' }) || '21m00Tcm4TlvDq8ikWAM';
const manifestOnly = process.argv.includes('--manifest-only');

if (!argument({ name: '--persona-root' }) || !/^[a-z0-9][a-z0-9-]{0,64}$/.test(persona)) {
  fail({ message: 'Usage: generate-course-narration.mjs --persona-root <repo> --persona <slug> [--provider elevenlabs] [--manifest-only]' });
}
const market = marketplaceRoot();
if (personaRoot === market || personaRoot.startsWith(`${market}${path.sep}`)) {
  fail({ message: 'Course audio must be written to the persona repository, not the operator marketplace.' });
}
const providerConfig = PROVIDERS[provider];
if (!providerConfig) fail({ message: `Unknown audio provider ${provider}` });

const mediaDir = path.join(personaRoot, 'assets', 'course-media');
fs.mkdirSync(mediaDir, { recursive: true });
if (manifestOnly) {
  writeManifest({ mediaDir, persona });
  process.exit(0);
}
if (provider !== 'elevenlabs') {
  fail({ message: `${provider} is registered. Pass ${providerConfig.env} and call that provider, or use --provider elevenlabs. This script writes ElevenLabs mp3 files into the persona repo.` });
}
const apiKey = process.env[providerConfig.env] || '';
if (!apiKey.trim()) fail({ message: `Set ${providerConfig.env} in the environment for this run. Do not store it in Git.` });

const pages = landingPages({ personaRoot });
let failures = 0;
for (const page of pages) {
  const payload = JSON.parse(fs.readFileSync(page.filePath, 'utf8'));
  const landingPage = payload.landingPage || payload;
  const courses = landingPage.boliLearning?.courses || landingPage.courses || [];
  for (const course of courses) {
    const slug = courseSlug({ courseId: course.id });
    if (!slug) continue;
    const suffix = suffixFor({ page });
    const fileName = `${persona}-course-${slug}-intro.${suffix}.mp3`;
    const destination = path.join(mediaDir, fileName);
    if (fs.existsSync(destination) && fs.statSync(destination).size > 1000) continue;
    const text = spokenScript({ course });
    if (!text) continue;
    try {
      const audio = await speakWithElevenLabs({ text, language: page.language, apiKey: apiKey.trim(), voiceId });
      fs.writeFileSync(destination, audio);
      process.stdout.write(`saved ${fileName}\n`);
    } catch (error) {
      failures += 1;
      process.stderr.write(`failed ${fileName} ${error instanceof Error ? error.message : 'request failed'}\n`);
    }
  }
}
writeManifest({ mediaDir, persona });
if (failures) process.exit(1);
