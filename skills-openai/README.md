# OpenAI submission skills

This directory contains reduced, public-directory-safe skill bundles prepared
for OpenAI review. It does not replace the full multi-client skills in `../skills/`.

For the current OpenAI directory draft, upload the single-skill ZIP at
[`../openai-submission/gabriel-operator-openai.zip`](../openai-submission/gabriel-operator-openai.zip)
(`persona-builder` only). Add other bundles later if a scan stays green.

Upload a plugin ZIP built only from these `skills-openai/` bundles. Every skill
here is intentionally authoring-only:

- it writes and validates local draft files;
- it does not install packages or execute remote scripts;
- it does not deploy, run, schedule, commit, or push;
- it does not request or store credentials;
- it does not automate external accounts or perform external writes.

Included skills:

- `persona-builder` (covers local drafts for page copy, lists, pipeline, team agents, optional workflow)
- `application`
- `asset-library`
- `digital-twin-embed`
- `digital-twin-page`
- `list-builder`
- `persona-ontology`
- `page-builder`
- `pipeline-builder`
- `team-agents`
- `todo-builder`
- `workflow-builder`

The full cross-platform packs remain available to other plugin clients from
`../skills/`.
