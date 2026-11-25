# Input → Query

The playbook definition in `assets/studio-teams.json` declares the inputs and destination. Studio creates the Query stage immediately after the input form. The authenticated desktop or cloud runtime creates the file-set reference when it accepts the inputs. Map `/input/fileQuery/passages` into an authored hosted step and cite each passage’s `citation` in its output.

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "key": "find-document-evidence",
  "kind": "structured",
  "name": "Find document evidence",
  "inputs": [
    { "key": "sources", "label": "Source documents", "format": "file", "required": true },
    { "key": "question", "label": "What should I find?", "format": "text", "required": true }
  ],
  "fileInput": { "destination": "gabriel", "queryInput": "question", "collection": "meeting-evidence" },
  "steps": [{
    "id": "summarize",
    "type": "reason",
    "title": "Summarize evidence",
    "instruction": "Summarize the passages relevant to the question. Include each citation and identify gaps in the evidence.",
    "inputMappings": { "passages": "/input/fileQuery/passages", "question": "/input/question" }
  }],
  "outputFields": ["result"],
  "outputModality": "text"
}
```

Omit `collection` for a run-scoped file set. A workspace owner authorizes append by saving a stable collection key in the definition. A subsequent playbook in the same team can use that key with optional file inputs to query retained material. Select `requiresOriginal: true` when extracted text cannot support the requested work and use a direct file-capable provider.

Use the following definition to select a folder and make its content searchable through Obsidian Local.

```json
{
  "schemaVersion": 1,
  "revision": 1,
  "key": "find-vault-evidence",
  "kind": "structured",
  "name": "Find vault evidence",
  "inputs": [
    { "key": "sources", "label": "Folder of evidence", "format": "folder", "required": true },
    { "key": "question", "label": "What should I find?", "format": "text", "required": true }
  ],
  "fileInput": { "destination": "obsidian-local", "queryInput": "question", "collection": "vault-evidence" },
  "steps": [{
    "id": "summarize",
    "type": "reason",
    "title": "Summarize vault evidence",
    "instruction": "Return a result field that answers the question and cites the matching vault files.",
    "inputMappings": { "passages": "/input/fileQuery/passages", "question": "/input/question" }
  }],
  "finalOutputMappings": { "result": "/steps/summarize/result" },
  "outputFields": ["result"],
  "outputModality": "text"
}
```

Set up Obsidian from the first input form. Choose the vault currently exposed by the Local REST API. On a later run, use the remembered folder to scan it again. Query shows the cited excerpts in Coach. With an on-device model configured in Desktop, **Continue on this device** passes the excerpts to the analysis steps. A workspace owner can also select files from the result and confirm an import into a named Gabriel team collection for a separate cloud playbook.

Validate the playbook through the existing Studio preview, then read its workflow through `app_studio_playbook_workflow`. Confirm Input → Query and the downstream input mappings. From Run with Coach, verify a query using a synthetic file containing a known answer. For retained input, add a different synthetic file on the next run and verify both sources are available. Report fixture and live provider checks separately.
