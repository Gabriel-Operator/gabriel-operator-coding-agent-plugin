#!/usr/bin/env node
const fs = require('node:fs');
const {validatePersonaOntology, validateOntologyReference} = require('./ontology.cjs');
try {
  const [file, ...feeds] = process.argv.slice(2);
  if (!file) throw new Error('Usage: validate-ontology.cjs assets/ontology.json [feed-definition.json ...]');
  const ontology = validatePersonaOntology(JSON.parse(fs.readFileSync(file, 'utf8')));
  for (const path of feeds) {
    const raw = JSON.parse(fs.readFileSync(path, 'utf8'));
    const definition = raw.definition || raw;
    if (definition.ontology) validateOntologyReference(ontology, definition.ontology);
  }
  console.log(`Valid ${ontology.resourceKey} ${ontology.version}: ${ontology.entities.length} entities, ${ontology.relationships.length} relationships; ${feeds.length} feed files checked.`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
