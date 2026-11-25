# Feed definition and catalog

```json
{
  "schemaVersion": 1,
  "feeds": [{
    "resourceKey": "workflow.example.inventory-read",
    "definition": "assets/data-feeds/inventory.definition.json",
    "workflow": "assets/data-feeds/inventory.workflow.json"
  }]
}
```

Definition fields: `schemaVersion: 1`, `name`, one `operation` (`create`, `read`,
`update`, `delete` or `publish`; a `publish` feed needs at least one credential slot
and one allowed host), `inputSchema`,
`outputSchema`, `credentialRequirements`, `allowedDomains`; optional `type` (email, file, transaction, calendar, message, portal, source, social or analytics),
`acquisition`, `ontology`, `ontologyUsage`, `registryRef`, `sourceSelection`,
`outputKind`, `outputStepId` and `localization`. Source registry references use
`{kind: "list", resourceKey}`; they are not subscriber List IDs. JSON Schema
2020-12 references are local. Declared credential slots contain only `slot`,
`label`, `kind` and an allowed-domain `service`.

The workflow file has `schemaVersion: 2`, matching `resourceKey` and `structure`.
Its restricted interpreter performs the declared source operation and output;
arbitrary database writes, cloud browser profiles and unapproved hosts are not
alternate feed implementations. Country/language variants are complete selected
contracts. New definitions begin Global/English; display translation preserves
schema keys, pointers and enum values.

Feed invocation uses `{feedId, revision, inputs, locale?}`; the parent runtime
supplies actor/workspace/execution authority. A Canvas stage uses
`execution: {type: "data_feed", dataFeedInvocation: {...}}`. A following stage
uses `execution: {type: "list_mapping", listMapping: {...}}`; its `sourceStepId`
points at saved feed output. Workflow steps use `data_feed_invoke` and
`map_json_to_list` with the same contracts.

Read-only MCP catalog/schema operations expose the registered Global definition.
Locale filters can limit catalog availability; the executing playbook resolves
and captures its actual country/audience/language variant. A Global schema read
is not proof of the contract selected by a historical or personalized run.

An ontology projection is `{entityType, ontologyVersion?, recordsPath, fields}`;
`fields` maps stable ontology attribute IDs to JSON pointers. It validates meaning
without writing graph instances. Source receipts and imported rows remain in
runtime storage, while only definitions/references belong in Git.

A REST step names the provider call. Use `pathParams` for ids (`url: ".../:accountId/media"`,
`pathParams: [{key: "accountId", value: "{{inputs.accountId}}"}]`), `queryParams` for text,
a JSON `body` object for typed values, and `headers: [{key: "Authorization", value:
"Bearer {{credentials.slot}}"}]` for secrets. `responseVariableName` keeps a step's JSON
for a later step (`{{made.id}}`, `{{hashtag.data.0.id}}`); `outputStepId` names the step
whose JSON is returned. A chain is allowed for one provider handshake (look a hashtag up,
then read it); a person-visible action should be its own `publish` feed.
