# Embedded offline runtime contract v1

Use this contract only with a runtime that reports `contractVersion: 1`.

- **Storage:** encrypted SQLite, isolated by account and workspace. Runtime records use stable `kind`, `entityId`, `revision`, `baseRevision`, `status`, `deleted`, and JSON `payload` fields. Files referenced by records must already be present in the prepared local pack.
- **Implemented local operations:** `prompt.local`, `knowledge.search`, `data.read`, `data.write`, `list.read`, `list.write`, `pipeline.transition`, `task.write`, `schedule.write`, `form.collect`, `approval.request`, `condition`, `loop.bounded`, `wait.durable`, `artifact.write`, and `signal.evaluate`.
- **Capability report:** inspect nested `steps`, `body`, `then`, `else`, `nodes`, and `children`. Report the compatible count and every blocking path before execution.
- **Connectivity:** HTTP, REST, MCP, web search, SaaS, remote databases, notifications, cloud models/media, telephony, and meetings require a connection. Desktop browser, coding, and computer-control steps require an installed desktop adapter. Local speech, vision, and media require installed device models.
- **Execution:** unsupported steps become `blocked`; reconnecting or synchronizing never executes them. Runs persist checkpoints, outputs, errors, waits, and approvals.
- **Schedules:** desktop runs while the Electron runtime is running and the computer is awake. Mobile runs only while an app shell is active and resumes after reopening. Missed recurring times coalesce into one catch-up occurrence. Stable occurrence IDs and one owner device prevent duplicate dispatch.
- **Synchronization:** synchronization is manual. A mutation and outbox entry commit together. `Sync now` performs a bounded push/pull session with idempotent operation IDs, tombstones, checkpoints, and retained conflicts. Token expiry blocks synchronization but never local access. Do not start sync from connectivity changes.
- **Separation:** Git sync carries authored definitions only. Runtime sync carries selected account/Persona data. Execution state remains with its owner device. Runner-memory export and cloud uploads remain explicit operations.
- **Current boundary:** chat and operational data have explicit sync paths. The server implements resumable attachment endpoints, but skills must not claim automatic attachment transfer until a client invokes them. External side effects remain blocked offline.

The embedded runtime is distinct from the Docker Portable Runtime appliance. Detect the environment and its capability report; never silently redirect a local request to hosted APIs.

