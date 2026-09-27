# HostelGuard — Gas & Fire Safety Monitor

24hr-hackathon build. ESP32 reads gas/smoke, flame, temp & humidity, sounds
a local alarm, and pushes live data straight to Supabase — no custom backend.
A React dashboard subscribes to Supabase Realtime and shows live readings +
an alert log.

```
hostelguard/
├── wokwi/                        # circuit + firmware (simulate in Wokwi)
│   ├── diagram.json
│   ├── wokwi.toml
│   └── hostelguard_firmware/hostelguard_firmware.ino
├── supabase/schema.sql           # run once in Supabase SQL Editor
└── dashboard/                    # React + Vite live dashboard
```

## 1. Supabase (5 min)

1. Create a project at supabase.com.
2. Dashboard > SQL Editor > New query > paste `supabase/schema.sql` > Run.
3. Dashboard > Settings > API — copy your **Project URL** and **anon public key**.

## 2. Simulate in Wokwi (10 min)

1. Install the **Wokwi Simulator** VS Code extension.
2. Open the `wokwi/` folder in VS Code.
3. In `hostelguard_firmware.ino`, fill in:
   ```cpp
   const char* SUPABASE_URL      = "https://YOUR-PROJECT-REF.supabase.co";
   const char* SUPABASE_ANON_KEY = "YOUR-ANON-KEY";
   ```
4. Press `F1` → **Arduino: Verify** to compile (needs the `esp32` board package
   and the `DHT sensor library` + `Adafruit Unified Sensor` libraries installed
   via the Arduino extension's Library Manager).
5. Press `F1` → **Wokwi: Start Simulator**.

Notes on the circuit:
- The MQ-2 gas sensor is `wokwi-gas-sensor`, analog out on GPIO 34. Drag its
  slider (or click it) to raise the ppm value and trigger the gas alarm.
- **Wokwi has no built-in flame sensor part**, so a photoresistor
  (`wokwi-photoresistor-sensor`) stands in for a KY-026 flame sensor's analog
  output on GPIO 35 — click it and drag to simulate rising flame brightness.
  Swap in a real KY-026 on physical hardware; the firmware logic is identical.
- DHT22 simulates temp/humidity (SDA on GPIO 4). Wokwi doesn't have a DHT11
  part — the firmware reads it as DHT22, which is a drop-in swap for DHT11
  on real hardware (just change `DHTTYPE` to `DHT11`).
- Buzzer (GPIO 25) + red LED (GPIO 26, via 220Ω resistor) fire together when
  any threshold is breached.

## 3. Run the dashboard (5 min)

```powershell
cd hostelguard\dashboard
npm install
copy .env.example .env
```

Edit `.env` with your Supabase URL + anon key, then:

```powershell
npm run dev
```

Open the printed `localhost` URL. It'll show "Awaiting first reading…" until
the Wokwi sim posts its first data point.

## Demo script

1. Start the Wokwi sim, open the dashboard side-by-side.
2. Let it run a few seconds — cards populate, status pill shows "MONITORING".
3. Drag the gas sensor slider up past ~1500 → buzzer sounds in Wokwi, LED
   lights, dashboard card turns red, alert log gets a new "gas" row in
   real time.
4. Repeat with the photoresistor (flame) or nudge DHT22 temperature up in
   its attrs panel to show all three hazard types firing independently.
5. Bring the value back down to show the alarm clearing while the alert
   history stays logged.

## What to cut if you're short on time

- Skip the LED/resistor wiring — the buzzer alone is enough to demo the alarm.
- Skip `humidity` card — it's informational only, not alarm-linked.
- If `npm install` is slow on the day, the dashboard is the least essential
  demo piece — Wokwi's own Serial Monitor output (`gas=.. flame=.. temp=..
  alarm=..`) is enough to prove the sensing + threshold logic works.
