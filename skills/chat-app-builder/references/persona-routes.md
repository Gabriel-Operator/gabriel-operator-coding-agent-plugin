# Persona routes: your own pages under your own address

A Persona can declare pages at `/persona/<slug>/<path>`, and screens for a different mobile companion app. It works the way a landing page does: the Persona's configuration picks a template and supplies the content, and the platform only holds the registered templates and components. Nothing about which pages exist, what they say or how they look is built into the platform; a Persona that declares no routes simply has none.

## `chatApp.routes`

Needs `chatApp.schemaVersion: 3`. At most 12 routes.

```json
"routes": [
  {
    "id": "learn",
    "path": "learn/:code",
    "title": "Course",
    "access": "public",
    "template": "focus",
    "components": [
      { "id": "heading", "type": "heading", "props": { "text": "Learn something new", "level": 1 } },
      { "id": "player", "type": "course-player", "props": { "copy": { "signInTitle": "Sign in to start" } } }
    ]
  },
  {
    "id": "badge",
    "path": "badge/:id",
    "title": "Badge",
    "access": "public",
    "template": "focus",
    "components": [
      { "id": "certificate", "type": "certificate" },
      { "id": "home", "type": "link-button", "props": { "label": "Back", "href": "~/", "variant": "secondary" } }
    ]
  }
]
```

| Field | Rule |
|---|---|
| `id` | Lowercase, unique. |
| `path` | Up to four segments of lowercase letters, digits and hyphens. `:name` captures one segment (letters, digits, `_`, `-`, up to 64). Two routes cannot have the same shape. The first segment cannot be `report`. |
| `title` | Shown as the browser title, followed by the Persona's name. |
| `access` | `public`: anyone who may open the Persona (its visibility and password rules apply). `signed-in`: a visitor who is not signed in is asked to sign in and sees nothing of the page; its content is not sent to them. |
| `template` | `focus` (a narrow centred column under the Persona's name) or `page` (wider). |
| `components` | 1 to 12, shown in order. Ids are unique within the route. A route can hold one `course-player` or `certificate`. |

The Persona's name and picture come from its profile; its accent colour comes from `chatApp.presentation.secondaryAccent`. A visitor sees the page in their own language: `?lang=xx` or the browser's language.

## Components

| Type | Props |
|---|---|
| `heading` | `text` (required), `level` 1, 2 or 3 (default 2) |
| `text` | `text`; a blank line starts a new paragraph |
| `image` | `src` (a same-site path or an `https` address), `alt` (required; empty only for decoration), `width` (16 to 1600) |
| `link-button` | `label`, `href` (a same-site path, `~/` for the Persona's own address such as `~/learn/x`, or an `https` address), `variant` `primary` or `secondary` |
| `course-player` | `param` (the path parameter holding the course code; default `code`), `copy` (wording overrides) |
| `certificate` | `param` (the path parameter holding the badge id; default `id`), `copy` (wording overrides) |

The path must contain the `:param` a `course-player` or `certificate` uses. Props are checked when the Persona's app is published; unknown props, unsafe addresses and unknown component types are refused. There is no custom HTML or script: a Persona composes pages from these components. Adding a component to the platform's registry makes it available to every Persona.

A `course-player` or `certificate` on a Persona's route only serves that Persona's own courses and badges.

## Wording

`course-player` and `certificate` carry words of their own. Each key has a default; a route overrides any of them in `props.copy`, and `chatApp.localization` translates the result (`translations.<language>.<the English text>`), like the rest of the app. `{name}` marks a value filled in at runtime and should be kept.

### course-player

| Key | Default wording |
|---|---|
| `loading` | Loading your course… |
| `unavailable` | This course link is not available any more. Ask the person who shared it for a new link. |
| `loadFailed` | We could not load this course. Please check your connection and try again. |
| `retry` | Try again |
| `ages` | Ages |
| `audienceParent` | Family course |
| `audienceSchool` | School course |
| `signInTitle` | Sign in to start |
| `signInBody` | Your answers are saved to your own account, and a parent or teacher confirms your result. |
| `signIn` | Sign in or register |
| `anonymousUnavailable` | This course needs a different kind of access that is not available yet. |
| `stepsLabel` | Your progress |
| `stepWatch` | Watch |
| `stepAnswer` | Answer |
| `stepCheck` | Check |
| `stepAdult` | Adult |
| `watchHeading` | Watch the lesson |
| `noFilm` | This course has no film. Read the lesson below, then continue. |
| `readLesson` | Read the lesson instead |
| `watched` | I have watched it |
| `questionsHeading` | Answer the questions |
| `watchFirst` | Watch the lesson first, then the questions open up. |
| `resultHeading` | Your quick check |
| `resultCount` | You got {right} of {total} checkable questions right. |
| `sendToAdult` | Ask my parent or teacher to check |
| `sending` | Sending… |
| `changeAnswers` | Change my answers |
| `linkHeading` | Link your parent or teacher |
| `linkBody` | Only a parent or teacher you are linked to can check your result. Ask them for an invitation code and type it here. |
| `linkLabel` | Invitation code |
| `linkAction` | Link and send |
| `waitingHeading` | Waiting for your parent or teacher |
| `waitingBody` | They have been asked to look at your answers. You can close this page; your result is saved. |
| `refresh` | Check for an update |
| `badgeHeading` | Badge earned |
| `badgeBody` | Your parent or teacher checked your work and confirmed it. Well done! |
| `revisionHeading` | Your adult asked for more practice |
| `revisionBody` | Watch the lesson again if you like, then change your answers and send them again. |
| `reasonLabel` | Their note |
| `genericError` | Something went wrong. Please try again. |
| `restrictedHeading` | This course is shared with certain learners |
| `restrictedBody` | Ask the person who shared it for an invitation code, enter it here, and the course will open. |
| `linkContinue` | Link and open the course |
| `quizIncomplete` | Please answer every question before you send your answers. |
| `quizWriteHere` | Write your answer here |
| `quizPracticalHint` | Tell your adult what you did or made. |
| `quizOrderHint` | Use the arrows to put the steps in the right order. |
| `quizLinesHint` | Write one step on each line, in order. |
| `quizMoveUp` | Move up |
| `quizMoveDown` | Move down |
| `quizSend` | Send my answers |
| `quizSending` | Sending… |

### certificate

| Key | Default wording |
|---|---|
| `loading` | Checking this certificate… |
| `notFound` | We could not find this certificate. Check the link and try again. |
| `failed` | We could not check this certificate right now. Please try again in a moment. |
| `verified` | Verified learning badge |
| `withdrawn` | This badge was withdrawn |
| `withdrawnBody` | The parent or teacher who confirmed it has taken it back, so it is no longer valid. |
| `checkedBy` | Checked by a {role} on {date}. |
| `roleParent` | parent |
| `roleTeacher` | teacher |
| `note` | This page confirms that a parent or teacher checked the learner’s work for this course. It does not show who earned it. |
| `print` | Print or save as PDF |

## Mobile companion

A phone is a different place from a browser: it has a camera, push and a smaller screen. A Persona can therefore give its mobile app its own menu and screens instead of mirroring the web app. Mobile screens are routes marked `surface: "mobile"`, and a `chatApp.mobile` section names the first screen and the menu. A Persona without a `mobile` section keeps today's behaviour: the mobile app draws the same Chat App as the web.

```json
"routes": [
  { "id": "home", "surface": "mobile", "title": "Learn", "components": [
      { "id": "welcome", "type": "heading", "props": { "text": "Learn with us", "level": 1 } },
      { "id": "start", "type": "link-button", "props": { "label": "Scan a course code", "href": "route:scan" } } ] },
  { "id": "scan", "surface": "mobile", "title": "Scan", "components": [
      { "id": "scanner", "type": "qr-scanner", "props": { "openRoute": "lesson", "hint": "Point the camera at the code" } } ] },
  { "id": "lesson", "surface": "mobile", "title": "Lesson", "components": [
      { "id": "course", "type": "persona-web-route", "props": { "source": "scanned" } } ] },
  { "id": "adults", "surface": "mobile", "title": "Adults", "components": [
      { "id": "inbox", "type": "persona-web-route", "props": { "source": "app", "view": "learning", "tab": "home", "sectionTab": "verify" } } ] }
],
"mobile": {
  "home": "home",
  "minimumAppVersion": "2.1.0",
  "menu": [
    { "id": "home", "label": "Home", "icon": "home", "routeId": "home" },
    { "id": "scan", "label": "Scan", "icon": "qr-code", "routeId": "scan" },
    { "id": "adults", "label": "Adults", "icon": "user", "routeId": "adults" }
  ]
}
```

| Field | Rule |
|---|---|
| `routes[].surface` | `mobile`. A mobile route has only `id`, `surface`, `title` and `components`: no `path`, `access` or `template`. Screens are reached by id, from the menu or from a component. |
| `mobile.home` | The mobile route shown first. |
| `mobile.menu` | 1 to 5 items: `id`, `label` (up to 40 characters, translated through `chatApp.localization`), `icon` and the mobile `routeId` it opens. Icons: `home`, `qr-code`, `camera`, `book`, `badge`, `chat`, `info`, `user`, `settings`. One item hides the bar. |
| `mobile.minimumAppVersion` | Optional `x.y.z`. An older app shows "please update" instead of the screens, so a newer component is never drawn by an app that cannot. |

Mobile components: `heading`, `text` and `image` as on the web, and

| Type | Props |
|---|---|
| `link-button` | `href` is `route:<mobile route id>` to open another screen, or an `https` address that opens in the phone's browser. |
| `qr-scanner` | `openRoute` (a mobile route id), `hint`. A code is accepted only if it is a page of this same Persona on a trusted host; the screen it opens receives the address. Anything else is refused and scanning goes on. |
| `persona-web-route` | Shows a web page of the Persona inside the app, signed in as the app user. Exactly one of: `path` (a web route with no `:parameter`), `source: "scanned"` (the address from the scanner), or `source: "app"` (the Persona's full app, optionally at `view` (a dashboard page id), `tab` and `sectionTab`). |

A component the installed app does not know is shown as "this screen needs a newer version", so add `minimumAppVersion` when you use a component that shipped recently. New mobile components need an app release; new web components do not. The mobile app does not yet draw the web-only components (`course-player`, `certificate`): use `persona-web-route` to show them.

**Sign-in.** The in-app browser is signed in without the token entering any page: the app's first request carries its normal `Authorization` header to `GET /api/persona-routes/session/open?next=<path>`, the server sets the HttpOnly cookie for that browser and redirects to the page. `next` must be a page under `/persona/<slug>/`. Navigation stays on the platform's own address; other links open in the phone's browser.

This applies to a fixed-persona mobile app (a build with a Persona id). The general Gabriel app does not use it.

## Links to a Persona's pages

Share links for courses and badges are built from the routes: the first route holding a `course-player` gives `/persona/<slug>/<path with the course code>`, and the first holding a `certificate` gives the badge link. A Persona with no such route gets the platform's default pages (`/course/<code>` and `/certificate/<id>`), which look generic. The QR code, the copy-link button and notifications all use the same link.

## Limits

- The Persona's own subdomain does not serve routes yet; use `/persona/<slug>/…`.
- The mobile app draws only routes marked `surface: "mobile"`; web routes are for the browser.
- Pages are anonymous-friendly only where the component says so: a `course-player` still asks a learner to sign in before it starts.
