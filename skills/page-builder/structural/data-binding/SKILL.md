---
name: data-binding
description: Bind component props to live data from agents, collections, and workflow endpoints.
metadata:
  category: structural
  system: page-builder
  version: 1.0.0
  dependencies:
    - page-structure
    - collections-endpoints
---

# Data Binding

## Offline behavior

Read [contract v1](references/offline-runtime-v1.md). Bind local-mode components to device repository queries and expose pending, conflict, deleted, blocked, and partially available states. Do not fall through from a missing local binding to a hosted endpoint.

Connect Page Builder components to live data sources: collections, agents, and workflow endpoints.

## Core Interfaces

### DataBinding

The main binding object, attached to a `ComponentInstance` or `PageDefinition`.

```typescript
interface DataBinding {
  agentId: string;
  agentName?: string;
  actionId: string;
  actionName?: string;
  endpointId?: string;
  mappings: DataBindingMapping[];
  lastExecuted?: string;
  cachedData?: Record<string, Record<string, unknown>>;
  recordFilter?: {
    fieldKey: string;
    contextKey?: string;
    value?: string | number | boolean;
  };
  queryConfig?: DataBindingQueryConfig;
  sources?: Array<{
    agentId?: string;
    collectionId?: string;
    name?: string;
    outputName?: string;
  }>;
}
```

### DataBindingMapping

Maps a data source field to a component prop.

```typescript
interface DataBindingMapping {
  componentProp: string;   // Component prop key: "value", "data", "rows"
  responsePath: string;    // JSONPath or dot notation to extract from data source
  collectionId?: string;   // ID of the collection (for collection binding)
  fieldKey?: string;       // Field key in the collection
}
```

### DataBindingQueryConfig

Enhanced filtering, sorting, and limiting for collection data.

```typescript
interface DataBindingQueryConfig {
  filters?: DataBindingFilter[];
  sort?: {
    fieldPath: string;
    direction: 'asc' | 'desc';
  };
  limit?: number;
  selectLatest?: boolean;
}
```

### DataBindingFilter

Individual filter within `queryConfig.filters` (AND logic when multiple).

```typescript
interface DataBindingFilter {
  fieldPath: string;       // Dot notation: "brand.name" or "field_123.brand.name"
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte';
  value?: string | number | boolean;   // Static value
  contextKey?: string;     // Dynamic value from runtime context
}
```

## Binding Patterns

### Collection Binding

Set `collectionId` in the mapping and `fieldKey` to reference the collection field.

```json
{
  "dataBinding": {
    "agentId": "app-123",
    "actionId": "read-contacts",
    "mappings": [
      {
        "componentProp": "rows",
        "responsePath": "data",
        "collectionId": "contacts-collection",
        "fieldKey": "name"
      }
    ],
    "queryConfig": {
      "filters": [
        { "fieldPath": "status", "operator": "equals", "value": "active" }
      ],
      "sort": { "fieldPath": "createdAt", "direction": "desc" },
      "limit": 50
    }
  }
}
```

### Agent Binding

Set `agentId` + `actionId` and use `responsePath` to navigate the agent output.

```json
{
  "dataBinding": {
    "agentId": "agent-abc",
    "agentName": "Analytics Agent",
    "actionId": "get-metrics",
    "actionName": "Get Metrics",
    "mappings": [
      {
        "componentProp": "value",
        "responsePath": "output.metrics.totalRevenue"
      },
      {
        "componentProp": "trendValue",
        "responsePath": "output.metrics.revenueChange"
      }
    ]
  }
}
```

### Workflow Endpoint Binding

Set `endpointId` and extract from the workflow output.

```json
{
  "dataBinding": {
    "agentId": "app-123",
    "actionId": "run-report",
    "endpointId": "endpoint-report-gen",
    "mappings": [
      {
        "componentProp": "data",
        "responsePath": "result.chartData"
      }
    ]
  }
}
```

### Multi-Source Binding

Use the `sources` array to bind from multiple agents or collections.

```json
{
  "dataBinding": {
    "agentId": "app-123",
    "actionId": "multi-read",
    "mappings": [
      { "componentProp": "revenue", "responsePath": "sales.total" },
      { "componentProp": "users", "responsePath": "analytics.activeUsers" }
    ],
    "sources": [
      { "collectionId": "sales-data", "name": "Sales", "outputName": "sales" },
      { "agentId": "analytics-agent", "name": "Analytics", "outputName": "analytics" }
    ]
  }
}
```

## Example: KPI Card Bound to a Collection

```json
{
  "id": "kpi-revenue",
  "componentType": "kpi-card",
  "gridPosition": { "col": 1, "row": 1, "colSpan": 1, "rowSpan": 1 },
  "props": {
    "title": "Total Revenue",
    "value": "$0",
    "subtitle": "Loading..."
  },
  "dataBinding": {
    "agentId": "app-123",
    "actionId": "read-revenue",
    "mappings": [
      { "componentProp": "value", "responsePath": "data.0.totalRevenue", "collectionId": "revenue-collection", "fieldKey": "totalRevenue" },
      { "componentProp": "subtitle", "responsePath": "data.0.period", "collectionId": "revenue-collection", "fieldKey": "period" }
    ],
    "queryConfig": {
      "selectLatest": true,
      "limit": 1
    }
  }
}
```

## Example: Table Bound to Agent Output with QueryConfig

```json
{
  "id": "table-leads",
  "componentType": "table",
  "gridPosition": { "col": 1, "row": 2, "colSpan": 4, "rowSpan": 2 },
  "props": {
    "title": "Active Leads",
    "columns": [
      { "key": "name", "header": "Name" },
      { "key": "email", "header": "Email" },
      { "key": "status", "header": "Status" }
    ],
    "rows": []
  },
  "dataBinding": {
    "agentId": "crm-agent",
    "agentName": "CRM Agent",
    "actionId": "list-leads",
    "actionName": "List Leads",
    "mappings": [
      { "componentProp": "rows", "responsePath": "output.leads" }
    ],
    "queryConfig": {
      "filters": [
        { "fieldPath": "status", "operator": "equals", "value": "active" }
      ],
      "sort": { "fieldPath": "createdAt", "direction": "desc" },
      "limit": 100
    }
  }
}
```

## Gotchas

1. **`recordFilter` is legacy** -- use `queryConfig` instead for new bindings. `recordFilter` is kept for backward compatibility.
2. **`cachedData` is auto-populated at runtime** -- do not set it manually in config; the runtime fills it after data fetching.
3. **`agentId` and `actionId` are always required** even for collection-only bindings (they identify the app/execution context).
4. **`responsePath` uses dot notation** -- e.g., `"data.0.fieldName"` for the first element of an array. Not full JSONPath syntax.
5. **Multiple filters use AND logic** -- there is no OR combinator in `queryConfig.filters`.
6. **`selectLatest: true`** fetches the most recent record matching the filters, useful for single-value KPI bindings.
