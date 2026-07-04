# Tech-Z — Lights, Fans, Discord

A system that lets anyone monitor a 3-room office's lights/fans and power usage through a
real-time web dashboard and a Discord bot, both backed by one shared backend. Built for the
"Lights, Fans, Discord: The Boss's Big Idea" hackathon (see `docs/`).

[Demo Video](https://drive.google.com/file/d/17lWKFRd0iK4goaGBjKjcHBaT3nJUKCYx/view?usp=drive_link)

## Architecture

```
Simulated Device Layer  →  Backend API (REST + WebSocket)  →  Web Dashboard
                                                            →  Discord Bot
```

One backend process is the single source of truth for all 15 device states (2 fans + 3
lights × 3 rooms: Drawing Room, Work Room 1, Work Room 2). The dashboard gets pushed live
updates over WebSocket; the bot pulls the same data over REST on demand and polls for
alerts. See `docs/system-diagram.md` for the full wireframe and `docs/circuit-schematic.md`
for the ESP32 wiring guidance.

## Folder structure

```
Tech-Z/
  backend/       Express + WebSocket API, simulated device state, alert detection
  dashboard/     React + Vite live dashboard (device panel, power meter, alerts, office layout)
  discord-bot/   Discord bot (!status, !room, !usage, proactive alert posting)
  docs/          Problem statement PDF, system diagram, circuit schematic guidance
```

## Prerequisites
- Node.js 18+ (uses the built-in global `fetch`)
- A Discord bot application + token (for `discord-bot/`)
- Optional: a free [Groq](https://console.groq.com) API key, for LLM-phrased bot replies
  (falls back to plain template replies if no key is set — no cost either way)

## Setup and running

Run all three services (each in its own terminal — they don't share a process).

### 1. Backend (start this first)

```bash
cd backend
npm install
npm start
```

Runs on `http://localhost:5000`. REST: `/api/status`, `/api/rooms/:name`, `/api/usage`,
`/api/alerts`. WebSocket: `ws://localhost:5000/ws`.

Env vars (`backend/.env`):
- `PORT` — default `5000`
- `ALERT_TEST_MODE` — set `true` to force the after-hours alert condition regardless of
  the real clock, so it can be demoed/verified during the day instead of only firing
  outside 9AM–4PM.

### 2. Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Opens on `http://localhost:5173`. Connects to the backend's WebSocket for live updates —
no page refresh needed. If you change the backend's host/port, set `VITE_WS_URL` and
`VITE_API_BASE` in a `dashboard/.env` file.

### 3. Discord bot

```bash
cd discord-bot
npm install
npm start
```

Env vars (`discord-bot/.env`):
- `DISCORD_TOKEN` — your bot's token
- `BACKEND_API_URL` — default `http://localhost:5000/api`
- `ALERT_CHANNEL_ID` — optional; channel ID to post proactive alerts to. Leave blank to
  disable proactive posting.
- `ALERT_POLL_INTERVAL_MS` — default `60000`
- `GROQ_API_KEY` — optional; enables LLM-phrased conversational replies via Groq's free
  tier. Without it, the bot uses its built-in friendly template replies — it still works,
  just not LLM-phrased.
- `GROQ_MODEL` — default `llama-3.1-8b-instant`

Commands: `!status`, `!room <drawing|work1|work2>`, `!usage`, `!help`.

#### Setting up free LLM-phrased replies (Groq)

The bot works fine without this — it just uses plain template replies instead. To turn
on conversational replies for free, no download, no local install:

1. Go to https://console.groq.com and sign up (free tier, no credit card needed)
2. Create an API key
3. Paste it into `discord-bot/.env` as `GROQ_API_KEY=gsk_...`

That's it — `GROQ_MODEL` already defaults to a fast free-tier model
(`llama-3.1-8b-instant`). If the key is missing, invalid, or the API call fails for any
reason, `!status`/`!room`/`!usage` silently fall back to the plain template replies — the
bot never breaks because of this.

**Security note:** the Discord token checked into `discord-bot/.env` during development
was exposed in plaintext at one point — regenerate it in the
[Discord Developer Portal](https://discord.com/developers/applications) before treating
this as production-ready, and never commit `.env` (already covered by `.gitignore`).

## How real-time / alerts work
- The backend flips one random device every 8s to keep the demo live, and pushes a full
  state snapshot to every connected dashboard client on each tick.
- `AlertEngine` checks two conditions on every tick:
  - **After-hours**: office hours are 9AM–4PM. Outside that window, any room with at
    least one device ON immediately gets one aggregated alert (e.g. "Work Room 2 still
    has 2 fans and 1 light ON after office hours") — no minimum duration required.
  - **Continuous-room**: a room where every device has been ON, uninterrupted, for over
    2 hours.
  
  Both are deduped so each only fires once per "session" (per room, per condition) —
  not every tick — until the room's state resets (goes fully off).
- The bot polls `/api/alerts` and posts any alert it hasn't already posted (tracked by
  alert ID, not a timestamp cutoff) to `ALERT_CHANNEL_ID` if configured — this way an
  alert that was already active before the bot last started still gets posted, instead
  of being silently skipped.

## Known limitations / follow-ups
- No git repository has been initialized yet — you'll need to `git init` and push to a
  public GitHub/GitLab repo yourself for the "public codebase" deliverable.
- `npm audit` reports pre-existing dev-only/transitive advisories (Vite's dev-server esbuild
  CORS issue; discord.js's `undici` transitive advisories) — neither affects this app's own
  code, and fixing them requires breaking major-version upgrades of those libraries.
- The PDF's provided office-layout image reports "18 total devices" in one legend box,
  which is inconsistent with its own text ("5 devices per room, 15 devices total"); this
  project uses 15, matching the explicit text and the existing working data model.
