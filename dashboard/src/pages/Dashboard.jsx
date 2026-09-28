import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { Building2, Activity, WifiOff } from 'lucide-react'
import SensorCard from '../components/SensorCard'
import AlertLog from '../components/AlertLog'
import RoomStatus from '../components/RoomStatus'

const GAS_MAX = 4095
const GAS_THRESHOLD = 1500
const FLAME_MAX = 4095
const FLAME_THRESHOLD = 3000
const TEMP_MAX = 80
const TEMP_THRESHOLD = 45

export default function Dashboard() {
  const [reading, setReading] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [connected, setConnected] = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

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
    <div className="app dashboard-page">
      {isOffline && (
        <div className="offline-banner">
          <WifiOff size={18} />
          <span>You are offline. Live data unavailable</span>
        </div>
      )}
      <header className="dashboard-header">
        <div className="dashboard-room-info">
          <div className="building-icon-wrapper">
            <Building2 size={28} className="text-accent" />
          </div>
          <div className="room-text">
            <span className="room-label-small">Room</span>
            <div className="room-name-wrapper">
              <h2 className="room-name">{reading?.room_label || 'Block A - Room 101'}</h2>
            </div>
            <span className="room-building">Hostel Main Building</span>
          </div>
        </div>
        
        <div className="dashboard-status-wrapper">
          <div className="status-indicator">
            <div className={`status-dot ${alarmActive ? 'danger' : 'safe'}`}></div>
            <div className="status-text-wrapper">
              <span className="status-title">{alarmActive ? 'ALARM ACTIVE' : 'MONITORING'}</span>
              <span className="status-subtitle">{alarmActive ? 'Hazards detected' : 'All systems normal'}</span>
            </div>
          </div>
          <div className="status-graphic">
            <Activity size={32} className={alarmActive ? 'text-danger' : 'text-safe'} />
            <span className="status-graphic-text">Live sensor data<br/>via Supabase</span>
          </div>
        </div>
      </header>

      <section className="sensors-grid">
        <SensorCard 
          type="gas"
          label="Gas / Smoke"
          sensorName="MQ-2 Sensor"
          value={reading?.gas_raw}
          unit="raw"
          max={GAS_MAX}
          threshold={GAS_THRESHOLD}
          breached={reading?.gas_raw > GAS_THRESHOLD}
        />
        <SensorCard 
          type="temperature"
          label="Temperature"
          sensorName="DHT22 Sensor"
          value={reading?.temperature}
          unit="°C"
          max={TEMP_MAX}
          threshold={TEMP_THRESHOLD}
          breached={reading?.temperature > TEMP_THRESHOLD}
        />
        <SensorCard 
          type="flame"
          label="Flame Level"
          sensorName="Photoresistor Sensor"
          value={reading?.flame_level}
          unit="level"
          max={FLAME_MAX}
          threshold={FLAME_THRESHOLD}
          breached={reading?.flame_level > FLAME_THRESHOLD}
        />
        <SensorCard 
          type="humidity"
          label="Humidity"
          sensorName="DHT22 Sensor"
          value={reading?.humidity}
          unit="%"
          max={100}
          threshold={90}
          breached={reading?.humidity > 90}
        />
      </section>

      <div className="dashboard-bottom-grid">
        <AlertLog alerts={alerts} />
        <RoomStatus roomLabel={reading?.room_label} lastUpdated={reading?.created_at} />
      </div>
    </div>
  )
}
