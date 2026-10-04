---
name: template-assembly
description: Assemble complete Page Builder apps from templates, including seed data and collection linking.
metadata:
  category: structural
  system: page-builder
  version: 1.0.0
  dependencies:
    - page-structure
    - collections-endpoints
    - theme-config
    - app-config
---

# Template Assembly

## Offline behavior

Read [contract v1](references/offline-runtime-v1.md). Offline templates must package their UI assets and selected data dependencies, retain definition-only Git exports, and include a capability report for every assembled playbook and action.

Assemble complete Page Builder applications from templates. This skill covers template selection, collection linking, app assembly patterns, and environment management.

## How Templates Work

Each `templateId` maps to a React component in the preview route. Templates provide the visual structure; data comes from collections and bindings.

- `templateId` is set on `PageDefinition.templateId`
- Each `pageTheme` has its own set of available templates in `TEMPLATE_OPTIONS`
- Templates are divided into **authenticated** (post-login) and **unauthenticated** (pre-login) categories

## Template Categories by Theme

### AEO Theme (`pageTheme: 'aeo'`)

**Authenticated:**
`dashboard`, `tableview`, `tabbedtable`, `knowledgebase`, `sources`, `traffic`, `topic-research`, `content-creation`, `site-health`, `projects-dashboard`, `ai-chat-homepage`, `brand-monitoring`, `account`

**Unauthenticated:**
`landing-page`, `login-page`, `signup-page`, `forgot-password-page`, `onboarding-wizard`, `onboarding-wizard-step2`, `onboarding-wizard-step3`

### Property Management Theme (`pageTheme: 'property-management'`)

**Authenticated:**
`property-management-dashboard`, `property-management-properties`, `property-management-tenants`, `property-management-vendors`, `property-management-landlords`, `property-management-issues`, `property-management-interactions`, `property-management-alice-details`, `property-management-org-settings`, `property-management-user-profile`

**Unauthenticated:**
`property-manager` (landing), `property-management-login`, `property-management-forgot-password`, `property-management-signup`

### Other Themes

Each additional theme (`email-marketing`, `alpha-frame`, `funding-tool`, `ivy-match`, `accelerator-os`) has its own template set. Check `TEMPLATE_OPTIONS` in `PageBuilderModal.tsx` for the full list.

## Collection Linking

`linkedCollections` on `PageDefinition` maps a template's expected collection schema IDs to actual collection IDs defined in `PageBuilderConfig.collections`.

```typescript
// On PageDefinition:
linkedCollections?: Record<string, string>;
// Key: template's expected schema ID
// Value: actual collection ID from PageBuilderConfig.collections
```

Example: if a template expects data from a schema called `"contacts"`, and your collection is `"my-contacts-collection"`:

```json
{
  "linkedCollections": {
    "contacts": "my-contacts-collection"
  }
}
```

## Complete App Assembly Pattern

### Step-by-Step

1. **Choose a `pageTheme`** -- determines which templates are available
2. **Create `navSections`** with authenticated and unauthenticated sections
3. **For each page, assign a `templateId`** from the chosen theme
4. **Define collections** that templates expect
5. **Link collections** via `linkedCollections` on each page
6. **Set `defaultAuthenticatedPageId` and `defaultUnauthenticatedPageId`** for initial routing

## Common App Patterns

### SaaS App

Landing page -> Login/Signup -> Onboarding -> Dashboard + Settings

```
Unauthenticated:  landing-page -> login-page, signup-page, forgot-password-page -> onboarding-wizard
Authenticated:    dashboard, tableview, account
```

### Dashboard App

Login -> Dashboard with multiple data pages

```
Unauthenticated:  login-page
Authenticated:    dashboard, tableview, tabbedtable, account
```

### Landing Page Only

Single unauthenticated page with landing components.

```
Unauthenticated:  landing-page
```

## JSON Example: Minimal SaaS App

```json
{
  "appType": "web-app",
  "appName": "My SaaS App",
  "pageTheme": "aeo",
  "theme": {
    "palette": "ocean",
    "fontFamily": "inter",
    "primaryColor": "blue"
  },
  "colorMode": "light",
  "defaultAuthenticatedPageId": "page-dashboard",
  "defaultUnauthenticatedPageId": "page-landing",
  "collections": [
    {
      "id": "leads-collection",
      "name": "Leads",
      "fields": [
        { "key": "name", "label": "Name", "type": "text", "required": true },
        { "key": "email", "label": "Email", "type": "email", "required": true },
        { "key": "status", "label": "Status", "type": "text", "defaultValue": "new" }
      ]
    }
  ],
  "endpoints": [
    {
      "id": "endpoint-list-leads",
      "name": "List Leads",
      "slug": "list-leads",
      "method": "GET",
      "collectionId": "leads-collection",
      "handlerType": "default"
    },
    {
      "id": "endpoint-create-lead",
      "name": "Create Lead",
      "slug": "create-lead",
      "method": "POST",
      "collectionId": "leads-collection",
      "handlerType": "default"
    }
  ],
  "navSections": [
    {
      "id": "section-unauth",
      "title": "Public",
      "routeType": "unauthenticated",
      "pages": [
        {
          "id": "page-landing",
          "name": "Landing",
          "path": "/",
          "icon": "GlobeAltIcon",
          "layoutId": "dashboard",
          "templateId": "landing-page",
          "components": []
        },
        {
          "id": "page-login",
          "name": "Login",
          "path": "/login",
          "icon": "LockClosedIcon",
          "layoutId": "dashboard",
          "templateId": "login-page",
          "components": []
        },
        {
          "id": "page-signup",
          "name": "Sign Up",
          "path": "/signup",
          "icon": "UserPlusIcon",
          "layoutId": "dashboard",
          "templateId": "signup-page",
          "components": []
        }
      ]
    },
    {
      "id": "section-main",
      "title": "Main",
      "routeType": "authenticated",
      "pages": [
        {
          "id": "page-dashboard",
          "name": "Dashboard",
          "path": "/",
          "icon": "Squares2X2Icon",
          "layoutId": "dashboard",
          "templateId": "dashboard",
          "components": [
            {
              "id": "kpi-total-leads",
              "componentType": "kpi-card",
              "gridPosition": { "col": 1, "row": 1, "colSpan": 1, "rowSpan": 1 },
              "props": { "title": "Total Leads", "value": "0", "subtitle": "All time" }
            },
            {
              "id": "kpi-active-leads",
              "componentType": "kpi-card",
              "gridPosition": { "col": 2, "row": 1, "colSpan": 1, "rowSpan": 1 },
              "props": { "title": "Active Leads", "value": "0", "subtitle": "Currently active" }
            }
          ],
          "linkedCollections": {
            "leads": "leads-collection"
          }
        },
        {
          "id": "page-leads-table",
          "name": "Leads",
          "path": "/leads",
          "icon": "TableCellsIcon",
          "layoutId": "dashboard",
          "templateId": "tableview",
          "components": [],
          "linkedCollections": {
            "leads": "leads-collection"
          }
        },
        {
          "id": "page-account",
          "name": "Account",
          "path": "/account",
          "icon": "UserCircleIcon",
          "layoutId": "dashboard",
          "templateId": "account",
          "components": []
        }
      ]
    }
  ]
}
```

## Environment Management

Page Builder apps can be deployed across multiple environments, synced via `environmentGroupId`:

- **production** -- live user-facing environment
- **staging** -- pre-release testing
- **test** -- automated testing
- **dev** -- local development

Environment configuration is managed at the deployment level, not within `PageBuilderConfig` itself.

## Gotchas

1. **`templateId` must match an entry in `TEMPLATE_OPTIONS`** -- invalid template IDs render blank pages. Always verify the template exists for the chosen `pageTheme`.
2. **`linkedCollections` keys must match template schema IDs** -- templates expect specific schema names. Check the template's manifest to find which collection schema IDs it expects.
3. **Templates are theme-specific** -- a `templateId` like `"property-management-dashboard"` only works with `pageTheme: 'property-management'`. Using it with `pageTheme: 'aeo'` will fail.
4. **Unauthenticated pages with `path: '/'`** -- the root path for unauthenticated pages is the landing page. The root path for authenticated pages is the main dashboard. Both can use `'/'` because routing switches based on auth state.
5. **`marksOnboardingComplete: true`** on a page means completing that page (e.g., submitting its form) marks the user's onboarding as done, routing them to the authenticated default page.
6. **`hiddenSections`** lets users hide template sections without removing them from config -- useful for customization without losing the template structure.
7. **Order matters in `navSections`** -- the sidebar renders sections and pages in the order they appear in the array.
