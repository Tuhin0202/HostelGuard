# HostelGuard

**Real-time IoT gas & fire safety monitor for hostels and labs — built and demoed entirely with free, simulated hardware.**

Healthcare & Safety track · 24-hour hackathon build

---

## The problem

Hostels, labs, and shared living spaces rarely have any automated hazard detection. A gas leak or small fire can go unnoticed until it's serious — especially at night or in an unattended room. Commercial IoT safety systems exist but are closed, expensive, and out of reach for a student prototype. HostelGuard shows a meaningful version of this can be built, simulated, and demoed in a day, using entirely free tools.

## What it does

- Continuously monitors **gas/smoke**, **flame**, and **temperature/humidity**
- Sounds a **local buzzer + LED alarm instantly** the moment any threshold is crossed — no network dependency for this part
- Pushes every reading and every alert to a **live cloud database**, with **zero custom backend**
- A web dashboard reflects new hazards in **real time**, no page refresh needed
- Keeps a full history of every alert, with timestamps

## Architecture

```
 ┌──────────────────────┐      HTTPS POST       ┌────────────────┐      Realtime push         ┌───────────────────┐
 │   Simulated ESP32     │ ───────────────────▶  │    Supabase    │ ───────────────────────▶ │  React Dashboard   │
 │   (Wokwi, in-browser) │   readings + alerts   │ (Postgres +    │      (WebSocket)          │  (Vite, 4 pages)   │
 │   MQ-2 · DHT22 ·       │                        │  Realtime)     │                          │                   │
 │   flame-sensor stand-in│                       └────────────────┘                           └───────────────────┘
 │   + buzzer + LED       │
 └──────────────────────┘
```

Alarm decisions happen **locally on the ESP32 first** — the buzzer/LED react instantly regardless of internet state. A reading is posted every 5 seconds regardless of alarm state; a one-off alert row is posted only on the moment a hazard _starts_.

## Tech stack

| Layer    | Tool                                         | Notes                                                                                                                                                    |
| -------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sensing  | ESP32, MQ-2 gas sensor, DHT22, photoresistor | All simulated in [Wokwi](https://wokwi.com) — no physical hardware required. Photoresistor stands in for a flame sensor (Wokwi has no native flame part) |
| Firmware | Arduino (C++)                                | Threshold logic, local alarm, HTTPS POST to Supabase                                                                                                     |
| Backend  | [Supabase](https://supabase.com)             | Postgres database + REST API + Realtime — no custom server                                                                                               |
| Frontend | React + Vite, `react-router-dom`, `recharts` | 4-page live dashboard                                                                                                                                    |

## Dashboard pages

| Route        | Purpose                                             |
| ------------ | --------------------------------------------------- |
| `/`          | Landing page — problem, how it works, hazard types  |
| `/dashboard` | Live readouts + alert log, updating in real time    |
| `/history`   | Trend charts of recent readings + summary stats     |
| `/about`     | Architecture diagram, tech stack, problem statement |

## Project structure

```
hostelguard/
├── wokwi/
│   ├── diagram.json                 # circuit: ESP32 + sensors + buzzer/LED
│   ├── wokwi.toml
│   └── hostelguard_firmware/
│       └── hostelguard_firmware.ino # sensing + alarm logic + Supabase POSTs
├── supabase/
│   └── schema.sql                   # readings + alerts tables, RLS, realtime
├── dashboard/
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
│       ├── App.jsx                  # router shell
│       ├── components/Nav.jsx
│       ├── pages/
│       │   ├── Landing.jsx
│       │   ├── Dashboard.jsx
│       │   ├── History.jsx
│       │   └── About.jsx
│       ├── supabaseClient.js
│       └── index.css
└── README.md
```

## Getting started

**1. Database**
Create a free [Supabase](https://supabase.com) project → SQL Editor → run `supabase/schema.sql` → copy your Project URL and anon key from Settings → API.

**2. Simulation**
Go to [wokwi.com](https://wokwi.com) → new ESP32 project → paste in `wokwi/hostelguard_firmware/hostelguard_firmware.ino` and `wokwi/diagram.json`. From the `dashboard` directory, run `npm run firmware:config` to generate the ignored firmware config from the same `.env` used by the dashboard, then run the simulation.

**3. Dashboard**

```bash
cd dashboard
npm install
cp .env.example .env   # fill in your Supabase URL + anon key
npm run dev
```

## Known limitations / what's next

- Readouts currently show **% of sensor range**, not calibrated ppm — true ppm needs a physical clean-air calibration step (R0) that isn't meaningful in a simulator
- Single simulated node (`room_label` is hardcoded) — the schema already supports multiple rooms, just not wired into the UI yet
- No SMS/push notifications — dashboard + local buzzer only, for now
- No auth on the dashboard — fine for a demo, not for production

## License

MIT — free to use, modify, and build on.
