#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const SLUG = /^[a-z0-9][a-z0-9-]{0,40}$/;
const PERSONA = /^[a-z0-9][a-z0-9-]{0,64}$/;

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

const personaRoot = path.resolve(argument({ name: '--persona-root' }));
const persona = argument({ name: '--persona' });
const slug = argument({ name: '--slug' });
const video = argument({ name: '--video' }) ? path.resolve(argument({ name: '--video' })) : '';
const picture = argument({ name: '--picture' }) ? path.resolve(argument({ name: '--picture' })) : '';

if (!argument({ name: '--persona-root' }) || !PERSONA.test(persona) || !SLUG.test(slug) || !video) {
  fail({ message: 'Usage: place-course-media.mjs --persona-root <repo> --persona <slug> --slug <course> --video <mp4> [--picture <mp4>]' });
}

const market = marketplaceRoot();
if (personaRoot === market || personaRoot.startsWith(`${market}${path.sep}`)) {
  fail({ message: 'Course video must be written to the persona repository, not the operator marketplace.' });
}
if (!fs.existsSync(path.join(personaRoot, 'assets', 'landing-page.json'))) {
  fail({ message: 'persona-root must contain assets/landing-page.json' });
}

const mediaDir = path.join(personaRoot, 'assets', 'course-media');
fs.mkdirSync(mediaDir, { recursive: true });
const videoName = `${persona}-course-${slug}-intro.mp4`;
const pictureName = `${persona}-course-${slug}-intro-picture.mp4`;

function place({ source, name }) {
  if (!fs.existsSync(source)) fail({ message: `Missing ${source}` });
  const destination = path.join(mediaDir, name);
  if (destination.startsWith(`${market}${path.sep}`)) {
    fail({ message: 'Refusing to write course media into the marketplace.' });
  }
  fs.copyFileSync(source, destination);
  process.stdout.write(`placed ${name}\n`);
}

place({ source: video, name: videoName });
if (picture) place({ source: picture, name: pictureName });

const playback = `/persona-course-media/${persona}/${videoName}`;
const landingDir = path.join(personaRoot, 'assets');
const landingFiles = fs.readdirSync(landingDir).filter(name => name.startsWith('landing-page') && name.endsWith('.json'));
const oldVideo = new RegExp(`/assets/[^"'\\s]*${slug}-intro\\.mp4(?:\\?[^"'\\s]*)?`, 'g');
for (const name of landingFiles) {
  const filePath = path.join(landingDir, name);
  const original = fs.readFileSync(filePath, 'utf8');
  const next = original.replace(oldVideo, playback);
  if (next !== original) {
    fs.writeFileSync(filePath, next);
    process.stdout.write(`updated ${name}\n`);
  }
}
