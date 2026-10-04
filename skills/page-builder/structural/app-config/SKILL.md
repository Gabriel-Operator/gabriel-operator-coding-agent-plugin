---
name: app-config
description: Configure app-level settings including billing, monitoring, auth, and LLM for Page Builder apps.
metadata:
  category: structural
  system: page-builder
  version: 1.0.0
  dependencies:
    - page-structure
    - theme-config
---

# App Configuration

## Offline behavior

Read [contract v1](references/offline-runtime-v1.md). Declare packaged assets, local repository bindings, manual synchronization, and capability-aware states. Keep auth secrets, device model selection, and scheduler ownership out of authored app configuration.

Configure application-level settings: billing products, monitoring/analytics, authentication providers, LLM defaults, runtime behavior, and override precedence.

## Billing

### BillingProductConfig

Stripe-backed product configuration for generated apps.

```typescript
interface BillingProductConfig {
  planId: string;                    // Primary Stripe Price ID
  stripeProductId?: string;
  stripeMonthlyPriceId?: string;
  stripeAnnualPriceId?: string;
  label?: string;                    // Display name (e.g., "Pro Plan")
  description?: string;
  cta?: string;                      // Call-to-action text (e.g., "Get Started")
  popular?: boolean;                 // Highlight as popular
  sortOrder?: number;                // Display order
  featureTags?: string[];            // Feature list for pricing cards
}
```

### Stripe Keys

```typescript
// On PageBuilderConfig:
stripeSecretKey?: string;        // Server-side only -- never expose client-side
stripePublishableKey?: string;   // Safe for client-side
```

## Monitoring

```typescript
// On PageBuilderConfig:
monitoring?: {
  posthogApiKey?: string;
  posthogHost?: string;
  googleAnalyticsId?: string;
};
```

## Google Sign-In

```typescript
// On PageBuilderConfig:
googleSignIn?: {
  enabled?: boolean;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
};
```

## LLM Configuration

```typescript
// On PageBuilderConfig:
llm?: {
  defaultModelId?: string;   // Default model for AI features
};
```

## Override Configuration

### OverrideConfigJson

Controls whether code overrides or JSON config take precedence.

```typescript
interface OverrideConfigJson {
  defaultPrecedence?: 'json-first' | 'code-first';
  templates?: Record<string, { precedence?: 'json-first' | 'code-first' }>;
  components?: Record<string, { precedence?: 'json-first' | 'code-first' }>;
  endpoints?: Record<string, { precedence?: 'json-first' | 'code-first' }>;
  monitoring?: {
    posthogApiKey?: string;
    posthogHost?: string;
    googleAnalyticsId?: string;
  };
  googleSignIn?: {
    enabled?: boolean;
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
  };
}
```

## Connectors

### PageBuilderConnector

Self-contained connector for Page Builder workflows. Contains all info needed to execute an action without external agent metadata lookups.

```typescript
interface PageBuilderConnector {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  agentId: string;
  actionId: string;
  actionName?: string;
  executionMode?: 'same-context' | 'isolated';
  website?: string;
}
```

## Runtime Flags

| Field | Type | Description |
|-------|------|-------------|
| `useHardcodedSidebar` | `boolean` | When true, generated app uses hardcoded sidebar menu |
| `useConfigUrlRuntime` | `boolean` | When true, backend pulls config from `CONFIG_URL` env var at runtime |
| `defaultAuthenticatedPageId` | `string` | Page ID shown after login |
| `defaultUnauthenticatedPageId` | `string` | Page ID shown before login |
| `landingPageUrl` | `string` | URL for landing page preview |

## JSON Examples

### Billing Setup

```json
{
  "billingProducts": [
    {
      "planId": "price_starter_monthly",
      "stripeProductId": "prod_starter",
      "stripeMonthlyPriceId": "price_starter_monthly",
      "stripeAnnualPriceId": "price_starter_annual",
      "label": "Starter",
      "description": "For individuals getting started",
      "cta": "Start Free Trial",
      "sortOrder": 1,
      "featureTags": ["5 projects", "1 GB storage", "Email support"]
    },
    {
      "planId": "price_pro_monthly",
      "stripeProductId": "prod_pro",
      "stripeMonthlyPriceId": "price_pro_monthly",
      "stripeAnnualPriceId": "price_pro_annual",
      "label": "Pro",
      "description": "For growing teams",
      "cta": "Upgrade to Pro",
      "popular": true,
      "sortOrder": 2,
      "featureTags": ["Unlimited projects", "10 GB storage", "Priority support", "API access"]
    }
  ],
  "stripePublishableKey": "pk_live_xxx"
}
```

### Monitoring Setup

```json
{
  "monitoring": {
    "posthogApiKey": "phc_xxxxxxxxxxxx",
    "posthogHost": "https://app.posthog.com",
    "googleAnalyticsId": "G-XXXXXXXXXX"
  }
}
```

### Google Sign-In Setup

```json
{
  "googleSignIn": {
    "enabled": true,
    "clientId": "123456789-abc.apps.googleusercontent.com",
    "clientSecret": "GOCSPX-xxxxxxxxxxxx",
    "redirectUri": "https://myapp.com/auth/google/callback"
  }
}
```

### Override Config

```json
{
  "overrideConfig": {
    "defaultPrecedence": "json-first",
    "templates": {
      "dashboard": { "precedence": "code-first" }
    },
    "components": {
      "custom-widget": { "precedence": "code-first" }
    }
  }
}
```

## Gotchas

1. **`stripeSecretKey` must never be exposed client-side** -- it is stored in the config JSON but should only be read by the server runtime. The `stripePublishableKey` is safe for the browser.
2. **`overrideConfig.defaultPrecedence`** controls the fallback behavior when a specific template/component/endpoint does not have its own precedence set. `'json-first'` means JSON config wins; `'code-first'` means code overrides win.
3. **`useConfigUrlRuntime: true`** makes the generated backend fetch config from a `CONFIG_URL` environment variable at startup instead of bundling the config. Useful for dynamic config updates without redeploying.
4. **`useHardcodedSidebar: true`** generates static sidebar code instead of rendering it dynamically from `navSections`. Use this when the sidebar structure is fixed and you want faster load times.
5. **`planId` is a Stripe Price ID** -- not a product ID. The billing system uses price IDs as the primary identifier per the Stripe pricing model.
6. **Connectors with `executionMode: 'isolated'`** run in a separate context from the main app, preventing side effects. `'same-context'` shares the execution environment.
