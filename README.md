# Pasathai — Thai/English keyboard layout switcher

Fixes text typed with the wrong keyboard layout. Type `l;ylfu` — English
keystrokes for what you meant to type in Thai — and get back `สวัสดี`.

The conversion is a pure character-for-character remap of the Thai Kedmanee
layout, runs entirely in the browser, and stores nothing.

## Shortcuts

The input is focused on load, so the usual flow is paste, `Cmd+Enter`, done.

| Shortcut | Action |
| --- | --- |
| `Cmd/Ctrl + Enter` | Copy the result |
| `Cmd/Ctrl + Shift + S` | Swap languages |
| `Cmd/Ctrl + Shift + K` | Clear and refocus |
| `/` | Focus the input |

If the text you paste looks like the language you are converting *to*, the app
says so and points at the swap shortcut rather than switching direction on you.

## Development

```sh
pnpm install
pnpm dev
```

The app runs at http://localhost:5173.

## Testing

```sh
pnpm test          # unit tests (Vitest) — layout data and conversion logic
pnpm test:e2e      # end-to-end tests (Playwright) — user-facing flows
pnpm test:e2e:ui   # end-to-end tests in Playwright's UI mode
```

`pnpm test:e2e` starts its own dev server. On a fresh checkout, install the
browser first:

```sh
pnpm exec playwright install chromium
```

## Checks

```sh
pnpm lint
pnpm typecheck
```

CI runs lint, typecheck, unit tests, a production build, and the end-to-end
suite on every push and pull request. See
[.github/workflows/ci.yml](.github/workflows/ci.yml).

## Deployment

```sh
pnpm build
pnpm start
```

`SESSION_SECRET` must be set in production — it signs the cookie holding the
visitor's theme preference, and the app refuses to boot without it. Copy
[.env.example](.env.example) and generate a value with `openssl rand -base64 32`.

Deploy the output of `pnpm build`:

- `build/server`
- `build/client`

## Layout data

The two keyboard maps live in
[app/constants/key-mapping.ts](app/constants/key-mapping.ts) and are covered by
tests asserting they are exact inverses of one another — a character converted
to the other layout and back must come out unchanged. Add entries in pairs.
