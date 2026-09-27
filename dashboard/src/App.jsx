import { useEffect, useState, useCallback } from 'react'
import { supabase } from './supabaseClient'

// Keep these in sync with the thresholds in the ESP32 firmware
const GAS_MAX = 4095
const GAS_THRESHOLD = 1500
const FLAME_MAX = 4095
const FLAME_THRESHOLD = 3000
const TEMP_MAX = 60
const TEMP_THRESHOLD = 45

function pct(value, max) {
  if (value == null || Number.isNaN(value)) return 0
  return Math.min(100, Math.max(0, (value / max) * 100))
}

function ReadoutCard({ label, value, unit, max, threshold, breached }) {
  return (
    <div className={`card ${breached ? 'card--breach' : ''}`}>
      <div className="card__label">{label}</div>
      <div className="card__value">
        {value == null ? '—' : Math.round(value * 10) / 10}
        <span className="card__unit">{unit}</span>
      </div>
      <div className="bar">
        <div className="bar__fill" style={{ width: `${pct(value, max)}%` }} />
        <div className="bar__threshold" style={{ left: `${pct(threshold, max)}%` }} />
      </div>
    </div>
  )
}

function timeLabel(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString()
}

export default function App() {
  const [reading, setReading] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [connected, setConnected] = useState(false)

  const loadInitial = useCallback(async () => {
    const { data: readingRows } = await supabase
      .from('readings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
    if (readingRows?.length) setReading(readingRows[0])

    const { data: alertRows } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    if (alertRows) setAlerts(alertRows)
  }, [])

  useEffect(() => {
    loadInitial()

    const readingsChannel = supabase
      .channel('readings-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'readings' },
        (payload) => setReading(payload.new),
      )
      .subscribe((status) => setConnected(status === 'SUBSCRIBED'))

    const alertsChannel = supabase
      .channel('alerts-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alerts' },
        (payload) => setAlerts((prev) => [payload.new, ...prev].slice(0, 20)),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(readingsChannel)
      supabase.removeChannel(alertsChannel)
    }
  }, [loadInitial])

  const alarmActive = reading?.alarm === true

  return (
    <div className="app">
      <header className="header">
        <div className="header__title">
          <span className="header__mark">HOSTELGUARD</span>
          <span className="header__room">
            {reading?.room_label ?? 'Awaiting first reading…'}
          </span>
        </div>
        <div className={`status-pill ${alarmActive ? 'status-pill--alarm' : 'status-pill--safe'}`}>
          <span className="status-pill__dot" />
          {alarmActive ? 'ALARM ACTIVE' : connected ? 'MONITORING' : 'CONNECTING…'}
        </div>
      </header>

      <section className="grid">
        <ReadoutCard
          label="Gas / smoke"
          value={reading?.gas_raw}
          unit="raw"
          max={GAS_MAX}
          threshold={GAS_THRESHOLD}
          breached={reading?.gas_raw > GAS_THRESHOLD}
        />
        <ReadoutCard
          label="Temperature"
          value={reading?.temperature}
          unit="°C"
          max={TEMP_MAX}
          threshold={TEMP_THRESHOLD}
          breached={reading?.temperature > TEMP_THRESHOLD}
        />
        <ReadoutCard
          label="Flame level"
          value={reading?.flame_level}
          unit="raw"
          max={FLAME_MAX}
          threshold={FLAME_THRESHOLD}
          breached={reading?.flame_level > FLAME_THRESHOLD}
        />
        <ReadoutCard
          label="Humidity"
          value={reading?.humidity}
          unit="%"
          max={100}
          threshold={100}
          breached={false}
        />
      </section>

      <section className="log">
        <div className="log__header">Alert log</div>
        {alerts.length === 0 && <div className="log__empty">No alerts yet — all clear.</div>}
        <ul className="log__list">
          {alerts.map((a) => (
            <li key={a.id} className={`log__row log__row--${a.alert_type}`}>
              <span className="log__time">{timeLabel(a.created_at)}</span>
              <span className="log__type">{a.alert_type}</span>
              <span className="log__message">{a.message}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
