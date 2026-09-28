import { useEffect, useState, useMemo } from 'react'
import { supabase } from '../supabaseClient'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Activity, Database, AlertTriangle, Clock, Search, BarChart2, Calendar, RefreshCw, Cloud, Thermometer, Flame } from 'lucide-react'

const formatTime = (iso) => {
  if (!iso) return '--:--'
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatDateTime = (iso) => {
  if (!iso) return '--'
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const month = monthNames[d.getMonth()]
  const year = d.getFullYear()
  const time = d.toLocaleTimeString('en-GB')
  return `${day} ${month} ${year}, ${time}`
}

export default function History() {
  const [readings, setReadings] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchData = async () => {
    setLoading(true)
    const { data: readingData } = await supabase
      .from('readings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (readingData) {
      setReadings(readingData)
    }

    const { data: alertData } = await supabase
      .from('alerts')
      .select('id')
    if (alertData) {
      setAlerts(alertData)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // For charts, we want ascending chronological order (oldest left, newest right)
  const chartData = useMemo(() => {
    return [...readings].reverse().map(r => ({
      ...r,
      timeLabel: formatTime(r.created_at)
    }))
  }, [readings])

  const filteredReadings = useMemo(() => {
    if (!searchQuery) return readings;
    const q = searchQuery.toLowerCase();
    return readings.filter(r => {
      let status = 'Normal'
      if (r.gas_raw > 400) status = 'Gas Alert'
      else if (r.temperature > 50) status = 'Temp Alert'
      else if (r.flame_level > 300) status = 'Flame Alert'
      
      return (
        status.toLowerCase().includes(q) ||
        r.gas_raw?.toString().includes(q) ||
        r.temperature?.toString().includes(q) ||
        r.flame_level?.toString().includes(q)
      )
    })
  }, [readings, searchQuery])

  if (loading && readings.length === 0) {
    return (
      <div className="page-placeholder">
        <Activity className="animate-spin text-accent" size={40} style={{ marginBottom: 16 }} />
        <p>Loading historical data...</p>
      </div>
    )
  }

  const getStatus = (r) => {
    if (r.gas_raw > 400) return { label: 'Gas Alert', class: 'gas' }
    if (r.temperature > 50) return { label: 'Temp Alert', class: 'temperature' }
    if (r.flame_level > 300) return { label: 'Flame Alert', class: 'fire' }
    return { label: 'Normal', class: 'safe' }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ background: '#0a1626', border: '1px solid #16263b', padding: '12px', borderRadius: '8px', color: '#e7eaee' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#8993a1', marginBottom: '8px' }}>{label}</p>
          <p style={{ margin: 0, fontWeight: 600, color: payload[0].stroke }}>{payload[0].name}: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="history-page">
      <div className="history-header-row">
        <div className="history-header-left">
          <div className="history-icon-wrapper">
            <BarChart2 size={24} className="text-accent" />
          </div>
          <div>
            <h2 className="history-title">Sensor History</h2>
            <p className="history-subtitle">View past readings and hazard trends from your hostel/lab room.</p>
          </div>
        </div>
        <div className="history-header-right">
          <div className="history-dropdown">
            <Calendar size={16} />
            <span>Last 50 readings</span>
          </div>
          <button className="history-refresh" onClick={fetchData}>
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="history-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Database size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Readings Loaded</span>
            <h3 className="stat-value">{readings.length}</h3>
            <span className="stat-desc">Latest data from Supabase</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper red">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Alerts Logged</span>
            <h3 className="stat-value">{alerts.length}</h3>
            <span className="stat-desc">Gas, flame or temperature breaches</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Last Reading Time</span>
            <h3 className="stat-value" style={{ fontSize: '20px' }}>{formatDateTime(readings[0]?.created_at)}</h3>
            <span className="stat-desc">Latest sensor update received</span>
          </div>
        </div>
      </div>

      <div className="history-charts-grid">
        {/* Gas Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <Cloud size={18} className="text-accent" />
              <h4>Gas / Smoke Levels (MQ-2)</h4>
            </div>
            <span className="chart-threshold-badge gas">Threshold: 400 ppm</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4fa8e0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4fa8e0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="timeLabel" stroke="#8993a1" tick={{ fill: '#8993a1', fontSize: 11 }} tickMargin={10} axisLine={false} tickLine={false} minTickGap={20} />
                <YAxis stroke="#8993a1" tick={{ fill: '#8993a1', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={400} stroke="#e5484d" strokeDasharray="3 3" />
                <Area type="monotone" dataKey="gas_raw" name="Gas (ppm)" stroke="#4fa8e0" strokeWidth={2} fillOpacity={1} fill="url(#colorGas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            <span className="legend-item"><span className="legend-dot" style={{background: '#4fa8e0'}}></span> Gas Level (ppm)</span>
            <span className="legend-item"><span className="legend-dash" style={{borderColor: '#e5484d'}}></span> Threshold (400 ppm)</span>
          </div>
        </div>

        {/* Temp Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <Thermometer size={18} style={{ color: '#f5a623' }} />
              <h4>Temperature (DHT22)</h4>
            </div>
            <span className="chart-threshold-badge temp">Threshold: 50 °C</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f5a623" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f5a623" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="timeLabel" stroke="#8993a1" tick={{ fill: '#8993a1', fontSize: 11 }} tickMargin={10} axisLine={false} tickLine={false} minTickGap={20} />
                <YAxis stroke="#8993a1" tick={{ fill: '#8993a1', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={50} stroke="#e5484d" strokeDasharray="3 3" />
                <Area type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#f5a623" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            <span className="legend-item"><span className="legend-dot" style={{background: '#f5a623'}}></span> Temperature (°C)</span>
            <span className="legend-item"><span className="legend-dash" style={{borderColor: '#e5484d'}}></span> Threshold (50 °C)</span>
          </div>
        </div>

        {/* Flame Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <Flame size={18} style={{ color: '#9b51e0' }} />
              <h4>Flame Level (Photosensor)</h4>
            </div>
            <span className="chart-threshold-badge flame">Threshold: 300 units</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFlame" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9b51e0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#9b51e0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="timeLabel" stroke="#8993a1" tick={{ fill: '#8993a1', fontSize: 11 }} tickMargin={10} axisLine={false} tickLine={false} minTickGap={20} />
                <YAxis stroke="#8993a1" tick={{ fill: '#8993a1', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={300} stroke="#e5484d" strokeDasharray="3 3" />
                <Area type="monotone" dataKey="flame_level" name="Flame (units)" stroke="#9b51e0" strokeWidth={2} fillOpacity={1} fill="url(#colorFlame)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            <span className="legend-item"><span className="legend-dot" style={{background: '#9b51e0'}}></span> Flame Level (units)</span>
            <span className="legend-item"><span className="legend-dash" style={{borderColor: '#e5484d'}}></span> Threshold (300 units)</span>
          </div>
        </div>
      </div>

      <div className="history-table-card">
        <div className="history-table-header">
          <div className="history-table-title">
            <BarChart2 size={20} />
            <h3>Recent Sensor Readings (Latest 50)</h3>
          </div>
          <div className="history-search">
            <Search size={16} className="text-dim" />
            <input 
              type="text" 
              placeholder="Search by type or value..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="history-table-wrapper">
          <table className="alerts-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Timestamp</th>
                <th>Gas (ppm)</th>
                <th>Temperature (°C)</th>
                <th>Flame Level (units)</th>
                <th>Humidity (%)</th>
                <th>Alert Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReadings.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "var(--text-dim)" }}>No readings match your search.</td>
                </tr>
              ) : (
                filteredReadings.map((r, i) => {
                  const status = getStatus(r)
                  return (
                    <tr key={r.id}>
                      <td className="col-id">{String(i + 1).padStart(3, '0')}</td>
                      <td className="col-time">{formatDateTime(r.created_at)}</td>
                      <td style={{ color: r.gas_raw > 400 ? 'var(--danger)' : 'var(--safe)', fontWeight: 600 }}>{r.gas_raw}</td>
                      <td style={{ color: r.temperature > 50 ? 'var(--danger)' : 'var(--text)', fontWeight: r.temperature > 50 ? 600 : 400 }}>{r.temperature}</td>
                      <td style={{ color: r.flame_level > 300 ? 'var(--danger)' : 'var(--text)', fontWeight: r.flame_level > 300 ? 600 : 400 }}>{r.flame_level}</td>
                      <td>{r.humidity}</td>
                      <td>
                        <span className={`alert-type-badge ${status.class} outlined`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
