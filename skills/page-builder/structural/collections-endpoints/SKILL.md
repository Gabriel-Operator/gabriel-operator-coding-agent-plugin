---
name: collections-endpoints
description: Define data collections and API endpoints for Page Builder apps.
metadata:
  category: structural
  system: page-builder
  version: 1.0.0
  dependencies: []
---

# Collections & Endpoints

## Offline behavior

Read [contract v1](references/offline-runtime-v1.md). Collections that support local mode need stable entity IDs, revisions, tombstones, and explicit local CRUD bindings. Live HTTP endpoints remain blocked offline; runtime synchronization is distinct from the endpoint action.

Define data collections (schemas + storage) and API endpoints (handlers + routing) for Page Builder applications.

## Collection Interfaces

### CollectionDefinition

```typescript
interface CollectionDefinition {
  id: string;
  name: string;
  description?: string;
  fields: CollectionField[];
  createdAt?: number;
  updatedAt?: number;
}
```

### CollectionField

```typescript
interface CollectionField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  defaultValue?: any;
  description?: string;
  items?: CollectionField[];               // For array/object: child schema
  arrayItemType?: 'text' | 'number' | 'object';  // Simple item type hint
}
```

### FieldType

```typescript
type FieldType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'email'
  | 'url'
  | 'rich-text'
  | 'image'
  | 'array'
  | 'object'
  | 'json';
```

## Endpoint Interfaces

### EndpointDefinition

```typescript
interface EndpointDefinition {
  id: string;
  name: string;
  slug: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description?: string;
  agentId?: string;
  collectionId?: string;
  workflow?: WorkflowDefinition;
  handlerType?: 'default' | 'workflow';
  chatConfig?: ChatConfig;
  createdAt?: number;
  updatedAt?: number;
}
```

### ChatConfig (overview)

Standalone chat configuration that can be attached to an endpoint.

```typescript
interface ChatConfig {
  id: string;
  enabled: boolean;
  name?: string;
  systemPrompt?: string;
  firstMessage?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  knowledgeBaseFileIds?: string[];
  voiceAgentEnabled?: boolean;
  workflowEndpointIds?: string[];
  // ... additional voice, avatar, MCP, and publish fields
}
```

### WorkflowDefinition (overview)

Visual workflow attached to an endpoint when `handlerType` is `'workflow'`.

```typescript
interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables: WorkflowVariable[];
}
```

## JSON Examples

### Collection: Contacts

```json
{
  "id": "contacts-collection",
  "name": "Contacts",
  "description": "Customer contact records",
  "fields": [
    { "key": "name", "label": "Full Name", "type": "text", "required": true },
    { "key": "email", "label": "Email", "type": "email", "required": true },
    { "key": "phone", "label": "Phone Number", "type": "text" },
    { "key": "company", "label": "Company", "type": "text" },
    { "key": "isActive", "label": "Active", "type": "boolean", "defaultValue": true },
    { "key": "createdDate", "label": "Created Date", "type": "date" },
    {
      "key": "tags",
      "label": "Tags",
      "type": "array",
      "arrayItemType": "text"
    },
    {
      "key": "address",
      "label": "Address",
      "type": "object",
      "items": [
        { "key": "street", "label": "Street", "type": "text" },
        { "key": "city", "label": "City", "type": "text" },
        { "key": "zipCode", "label": "Zip Code", "type": "text" }
      ]
    }
  ]
}
```

### Endpoint: Read from Collection

```json
{
  "id": "endpoint-list-contacts",
  "name": "List Contacts",
  "slug": "list-contacts",
  "method": "GET",
  "description": "Retrieve all contacts from the contacts collection",
  "collectionId": "contacts-collection",
  "handlerType": "default"
}
```

### Endpoint: Workflow Handler

```json
{
  "id": "endpoint-process-lead",
  "name": "Process Lead",
  "slug": "process-lead",
  "method": "POST",
  "description": "Run the lead processing workflow",
  "handlerType": "workflow",
  "workflow": {
    "id": "wf-process-lead",
    "name": "Process Lead Workflow",
    "description": "Validates and enriches lead data",
    "nodes": [
      {
        "id": "start",
        "type": "start",
        "position": { "x": 0, "y": 0 },
        "data": {
          "label": "Start",
          "inputSchema": [
            { "key": "leadEmail", "label": "Lead Email", "type": "email", "required": true },
            { "key": "leadName", "label": "Lead Name", "type": "text" }
          ]
        }
      },
      {
        "id": "end",
        "type": "end",
        "position": { "x": 400, "y": 0 },
        "data": {
          "label": "End",
          "config": { "status": "success" }
        }
      }
    ],
    "edges": [
      { "id": "e-start-end", "source": "start", "target": "end" }
    ],
    "variables": []
  }
}
```

## Common Patterns

### CRUD Endpoints for a Collection

A typical set of endpoints for managing a collection:

| Endpoint | Method | Slug | Description |
|----------|--------|------|-------------|
| List All | `GET` | `list-contacts` | Read all records |
| Get One | `GET` | `get-contact` | Read single record by ID |
| Create | `POST` | `create-contact` | Create a new record |
| Update | `PUT` | `update-contact` | Update an existing record |
| Delete | `DELETE` | `delete-contact` | Delete a record |

All CRUD endpoints link to the same `collectionId` with `handlerType: "default"`.

## Gotchas

1. **`slug` must be URL-safe** -- use lowercase, hyphens only. No spaces, special characters, or uppercase letters. Example: `"list-contacts"`, not `"List Contacts"`.
2. **`method` determines the HTTP verb** -- must be one of `GET`, `POST`, `PUT`, `DELETE`. `PATCH` is not supported at the endpoint definition level (though `api_call` events support it).
3. **`collectionId` links to a collection for data storage** -- when set, the default handler reads/writes to that collection automatically.
4. **`handlerType: 'workflow'`** requires a `workflow` object to be defined -- without it, the endpoint will have no handler.
5. **`chatConfig` is optional** and independent of the endpoint's main handler -- it enables an AI chat interface on top of the endpoint.
6. **Field `key` values must be unique within a collection** -- duplicate keys will cause data corruption.
7. **`array` type fields** should specify `arrayItemType` for simple arrays or `items` for arrays of objects.
