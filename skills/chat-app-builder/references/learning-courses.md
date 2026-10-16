# Learning courses: publish, learn, verify, badge

A Persona that teaches can publish an approved course as a link and QR code. A learner works through it on the web, and a linked parent or teacher decides whether to award a badge. The Persona declares what is specific to it in `chatApp.learning`; the platform enforces the trust rules and the shared screens work the same for every Persona.

## What belongs where

| Persona decides (`chatApp.learning` and the layout) | Platform enforces (not configurable) |
|---|---|
| Which commands produce courses, and for whom | The author's own approved run is the only source of a published course |
| Which Canvas tasks hold the brief, script, quiz, film, narration, frames and the two approvals | Answer keys never reach a learner |
| Intake question ids, age bands, default pass mark | Only an adult linked to the learner, never the learner, can verify; one winner under concurrency |
| Who may open a course (`link`, `family`, `class`, `private`) | The author and persona owner can always open their own course |
| Adult roles that can invite, how long a code lasts, who may delete a learner's data | A learner can always delete their own data; no response carries a user id |
| Where the inbox, links and badges screens sit (tabs and sub-tabs) | The default learner pages `/course/<code>` and `/certificate/<id>`, used only when the Persona declares none |
| The learner and certificate pages: their address, template, wording and extra content, as [persona routes](persona-routes.md) | That a learner page only serves its own Persona's courses |
| Which components appear and in what order | Safety limits (question counts, answer length, invitation counts) |

A Persona cannot point a QR code at another site: its pages live under its own address (`/persona/<slug>/…`) and the platform builds every share link itself. Anonymous QR sessions stay off until guest sessions exist; a course cannot be published for them.

## `chatApp.learning`

Needs `chatApp.schemaVersion: 3`. Everything except `course` is optional and has the default shown.

```json
"learning": {
  "course": {
    "commands": [
      { "commandId": "family-course", "audience": "parent", "visibility": "family" },
      { "commandId": "class-course", "audience": "school", "visibility": "class" }
    ],
    "tasks": {
      "brief": "course-brief", "script": "lesson-script", "quiz": "lesson-quiz",
      "approve": "approve", "publish": "publish",
      "film": "lesson-film", "narration": "lesson-voice", "frames": "storyboard"
    },
    "intake": { "ageBand": "age-band", "accessMode": "access-mode" },
    "ageBands": ["9-11", "12-14"],
    "minimumMastery": 0.7,
    "visibilities": ["family", "class", "link"]
  },
  "links": { "roles": ["parent", "teacher"], "inviteTtlDays": 7, "eraseRoles": ["parent"] }
}
```

| Field | Meaning |
|---|---|
| `course.commands[]` | Slash commands whose approved runs may be published. `audience` is `parent` or `school`. `visibility` is the default audience for that command and must be one of `course.visibilities`. A run started by any other command cannot be published. |
| `course.tasks` | Canvas task ids (the `canvasTask.taskId` of a workflow step). `brief`, `script`, `quiz`, `approve` and `publish` are required. `film`, `narration` and `frames` are optional: leave them out for a course without that media. Content tasks must be distinct; `approve` and `publish` may be the same task, but neither may produce content. |
| `course.intake` | Intake question ids to read from the run (`ageBand`, `accessMode`). Nothing is read unless named here. |
| `course.ageBands` | Accepted labels (at most 12, 20 characters each). Without it any short label is accepted. |
| `course.minimumMastery` | Pass mark used when the quiz block does not state one (default 0.7). |
| `course.visibilities` | Who may open a published course; the first entry is the default. Default `["link"]`. See below. |
| `links.roles` | Adult roles that can invite learners (default both). |
| `links.inviteTtlDays` | Whole days an invitation code works, 1 to 30 (default 7). |
| `links.eraseRoles` | Adult roles allowed to delete a linked learner's data (default `["parent"]`; `[]` means only the learner). |

A `course-publications` component requires `course`. `validate-chat-app.js` also checks, against the Persona's own commands and workflows, that every listed command exists and every task id is a Canvas task of that command's workflow.

### Visibility

| Value | Who can open the course |
|---|---|
| `link` | Any signed-in learner with the link |
| `family` | A learner currently linked to the publisher as a parent |
| `class` | A learner currently linked to the publisher as a teacher |
| `private` | Only the publisher and the persona owner |

The public page of a `family`, `class` or `private` course shows only its title. A learner who is not yet linked is asked for the publisher's invitation code. When more than one value is allowed the publisher chooses one per course before publishing.

## What a course workflow must produce

Use one `persona_capability` Canvas task per role, and name those tasks in `course.tasks`. The artifacts are read by role:

| Role | Artifact |
|---|---|
| `brief` | Last fenced `json` block: `{ "title", "ageBand", "learningGoal" }`. `ageBand` must be in `ageBands` when that is set. |
| `script` | Last fenced `json` block: `{ "lessons": [{ "id", "title", "learningObjective", "narrationScript" }] }` |
| `frames` | Image artifacts, used as frames |
| `film` | One `video` artifact |
| `narration` | One `audio` artifact |
| `quiz` | Last fenced `json` block: `{ "questions": [{ "id", "type", "prompt", "options" }], "answerKey": [{ "questionId", "answer", "rubric" }], "minimumMastery" }` |
| `approve`, `publish` | Human approval decisions. Set `requiresApproval` on these tasks only; a global `humanApproval.enabled` makes every task ask. |

Question `type` is `multiple_choice`, `ordering`, `short_answer` or `practical`. Multiple-choice answers are one of the listed `options`. Ordering answers are an ordered list of the same items; list them in the correct order in the answer key (learners see them shuffled). Media must be platform-served (`/api/chat/generate/media/…` or `/api/page-builder/media/…`); anything else is refused at publish time.

## The learner pages

Declare the player and the certificate as [persona routes](persona-routes.md): a route holding a `course-player` (path such as `learn/:code`) and one holding a `certificate` (such as `badge/:id`). Share links, QR codes and notifications then point there, with the Persona's own wording and look. Without them the platform's generic default pages are used.

## Components and layout

These components use the `learning` workspace provider, one view each. Declare a data point `{ "source": "workspace", "provider": "learning", "view": … }` for each and bind the component to it:

| Component | `view` | For |
|---|---|---|
| `course-publications` | `publications` | Publish approved runs, choose the audience, copy the link, show the QR code, turn a link off |
| `verification-queue` | `verifications` | A linked adult reviews answers beside the key and verifies, asks for more practice, or declines |
| `learning-links` | `links` | Invite learners, accept an invitation, end a link, delete data |
| `badge-shelf` | `badges` | Badges earned or supervised, with certificate links |

Put them wherever suits the Persona. Notifications deep-link into the app by finding where the layout puts `verification-queue` and `badge-shelf` (page, tab and sub-tab), so tab and section names are free. Data always belongs to the signed-in person, not to a shared persona workspace owner; do not bind these components to lists.

## Publishing the settings

Settings are read from the published `chatApp`. After editing `assets/chat-app.json`, run `build-chat-app.js` and `validate-chat-app.js`, commit, then publish the workspace. A Persona whose published app has no `learning.course` answers publishing requests with `COURSE_NOT_CONFIGURED` and shows "not set up" in the publications panel.

## Known limits

- The outcome engine cannot count badges yet. A lifecycle ROI metric that reads a list stage stays empty until a badge source or a list projection exists.
- Written answers are never machine-scored.
- Minors without their own account are not supported; a learner needs a registered account.
- The mobile app does not draw these components natively. A Persona's mobile companion (see [persona routes](persona-routes.md#mobile-companion)) can scan a course code and show the web lesson, or the adult inbox, inside the app.
- Notification wording is platform text. The player and certificate wording belongs to the Persona's route.
