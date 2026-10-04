---
name: event-system
description: Configure interactive events and actions for Page Builder components.
metadata:
  category: structural
  system: page-builder
  version: 1.0.0
  dependencies:
    - page-structure
    - collections-endpoints
---

# Event System

## Offline behavior

Read [contract v1](references/offline-runtime-v1.md). Classify event actions before enabling them. Local mutations require stable operation IDs. Connectivity-dependent actions remain visibly blocked and must not fire on reconnect, data pull, or conflict resolution.

Configure interactive events and actions on Page Builder components. Events trigger one or more actions when the user interacts with a component.

## Core Interfaces

### ComponentEvent

```typescript
interface ComponentEvent {
  id: string;
  type: EventType;
  actions: EventAction[];
}
```

### EventType

```typescript
type EventType = 'onClick' | 'onSubmit' | 'onChange' | 'onLoad' | 'onHover';
```

### EventAction

```typescript
interface EventAction {
  id: string;
  type: EventActionType;
  config: { /* fields vary by type -- see below */ };
}
```

### EventActionType

```typescript
type EventActionType =
  | 'navigate'
  | 'api_call'
  | 'call_workflow'
  | 'set_state'
  | 'open_modal'
  | 'submit_form'
  | 'auth_login'
  | 'auth_register'
  | 'auth_forgot_password'
  | 'auth_magic_link';
```

## Action Config Fields by Type

### 1. `navigate`

Navigate to another page or external URL.

| Field | Type | Description |
|-------|------|-------------|
| `navigationType` | `'native' \| 'custom'` | Native page nav or custom URL |
| `targetPageId` | `string` | Page ID for native navigation |
| `url` | `string` | URL for custom navigation |
| `openInNewTab` | `boolean` | Open in new browser tab |

### 2. `api_call`

Make an HTTP API call.

| Field | Type | Description |
|-------|------|-------------|
| `endpointId` | `string` | Endpoint to call |
| `method` | `'GET' \| 'POST' \| 'PUT' \| 'PATCH' \| 'DELETE'` | HTTP method |
| `url` | `string` | Request URL |
| `body` | `string` | Request body |
| `headers` | `Record<string, string>` | Custom headers |
| `authType` | `'none' \| 'bearer' \| 'basic' \| 'api-key'` | Auth type |
| `authToken` | `string` | Bearer token |
| `authUsername` | `string` | Basic auth username |
| `authPassword` | `string` | Basic auth password |
| `apiKeyHeader` | `string` | API key header name |
| `apiKeyValue` | `string` | API key value |

### 3. `call_workflow`

Call an existing workflow endpoint.

| Field | Type | Description |
|-------|------|-------------|
| `workflowEndpointId` | `string` | Endpoint ID of the workflow |
| `workflowInputs` | `Record<string, string>` | Input parameter values |
| `workflowPayloadMode` | `'fields' \| 'formData'` | `'fields'` = DOM extraction, `'formData'` = state object |
| `onWorkflowSuccess` | `object` | `{ action: 'close_modal' \| 'close_and_refresh' \| 'navigate' \| 'none', targetPageId?: string }` |
| `onWorkflowError` | `object` | `{ showToast?: boolean, toastMessage?: string }` |
| `successCondition` | `object` | `{ requiredField?: string, errorMessage?: string }` |

### 4. `set_state`

Update local component/page state.

| Field | Type | Description |
|-------|------|-------------|
| `stateKey` | `string` | State key to set |
| `stateValue` | `string` | Value to assign |

### 5. `open_modal`

Open a modal component.

| Field | Type | Description |
|-------|------|-------------|
| `modalId` | `string` | ID of the modal component to open |

### 6. `submit_form`

Submit a form component.

| Field | Type | Description |
|-------|------|-------------|
| `formId` | `string` | ID of the form to submit |

### 7. `auth_login`

Native login action for preview apps.

| Field | Type | Description |
|-------|------|-------------|
| `authFieldMappings` | `object` | `{ emailField?: string, passwordField?: string }` |
| `onAuthSuccess` | `object` | `{ redirect?: 'authenticated_default' \| 'page', targetPageId?: string }` |
| `onAuthError` | `object` | `{ showMessage?: boolean }` |

### 8. `auth_register`

Native registration action.

| Field | Type | Description |
|-------|------|-------------|
| `authFieldMappings` | `object` | `{ emailField?: string, passwordField?: string, nameField?: string }` |
| `onAuthSuccess` | `object` | `{ redirect?: 'authenticated_default' \| 'page', targetPageId?: string }` |
| `onAuthError` | `object` | `{ showMessage?: boolean }` |

### 9. `auth_forgot_password`

Forgot password action.

| Field | Type | Description |
|-------|------|-------------|
| `authFieldMappings` | `object` | `{ emailField?: string }` |

### 10. `auth_magic_link`

Magic link login action.

| Field | Type | Description |
|-------|------|-------------|
| `authFieldMappings` | `object` | `{ emailField?: string }` |

## Interactive Component Types

Only the following component types support events:

```
button, action-card, connect-integration, connect-banner, article-list,
article-editor, sidebar, ai-mentions, platform-performance, dashboard-header,
header-actions, quick-action-card, topic-list, landing-hero, landing-feature,
landing-trust, landing-faq, landing-cta, landing-footer, landing-nav
```

## JSON Examples

### Button with onClick Navigate

```json
{
  "id": "btn-go-dashboard",
  "componentType": "button",
  "gridPosition": { "col": 1, "row": 1, "colSpan": 1, "rowSpan": 1 },
  "props": { "title": "Go to Dashboard" },
  "events": [
    {
      "id": "evt-1",
      "type": "onClick",
      "actions": [
        {
          "id": "act-1",
          "type": "navigate",
          "config": {
            "navigationType": "native",
            "targetPageId": "page-dashboard"
          }
        }
      ]
    }
  ]
}
```

### Form Group with onSubmit call_workflow

```json
{
  "id": "form-create-contact",
  "componentType": "form-group",
  "gridPosition": { "col": 1, "row": 1, "colSpan": 2, "rowSpan": 2 },
  "props": { "title": "Create Contact" },
  "events": [
    {
      "id": "evt-submit",
      "type": "onSubmit",
      "actions": [
        {
          "id": "act-submit",
          "type": "call_workflow",
          "config": {
            "workflowEndpointId": "endpoint-create-contact",
            "workflowPayloadMode": "formData",
            "onWorkflowSuccess": {
              "action": "close_and_refresh"
            },
            "onWorkflowError": {
              "showToast": true,
              "toastMessage": "Failed to create contact"
            }
          }
        }
      ]
    }
  ]
}
```

### Login Form with auth_login

```json
{
  "id": "login-form",
  "componentType": "login-form",
  "gridPosition": { "col": 1, "row": 1, "colSpan": 4, "rowSpan": 3 },
  "props": {
    "title": "Welcome back",
    "subtitle": "Sign in to your account",
    "emailPlaceholder": "Email address",
    "passwordPlaceholder": "Password",
    "submitBtnText": "Sign In"
  },
  "events": [
    {
      "id": "evt-login",
      "type": "onSubmit",
      "actions": [
        {
          "id": "act-login",
          "type": "auth_login",
          "config": {
            "authFieldMappings": {
              "emailField": "email",
              "passwordField": "password"
            },
            "onAuthSuccess": {
              "redirect": "authenticated_default"
            },
            "onAuthError": {
              "showMessage": true
            }
          }
        }
      ]
    }
  ]
}
```

## Gotchas

1. **Not all components support events** -- only those in `INTERACTIVE_COMPONENT_TYPES`. Adding events to non-interactive components will have no effect.
2. **Auth events use special built-in handling** -- `auth_login`, `auth_register`, `auth_forgot_password`, and `auth_magic_link` are processed by the preview runtime's auth system, not as generic API calls.
3. **`workflowPayloadMode`** -- use `'formData'` for wizard flows with accumulated state; use `'fields'` for standard DOM-based form extraction.
4. **Multiple actions per event** -- a single event can trigger multiple actions in sequence (e.g., call a workflow then navigate).
5. **`successCondition.requiredField`** uses dot notation into the workflow response to check for a required field before considering the call successful.
