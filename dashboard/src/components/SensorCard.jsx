import { Wind, Thermometer, Flame, Droplets } from 'lucide-react';

const ICONS = {
  gas: Wind,
  temperature: Thermometer,
  flame: Flame,
  humidity: Droplets
};

export default function SensorCard({ type, label, sensorName, value, unit, max, threshold, breached }) {
  const Icon = ICONS[type] || Wind;
  const pct = Math.min(100, Math.max(0, (value / max) * 100)) || 0;
  const thresholdPct = Math.min(100, Math.max(0, (threshold / max) * 100));

  return (
    <div className={`sensor-card ${breached ? 'breached' : ''}`}>
      <div className="sensor-header">
        <div className={`sensor-icon-wrapper ${type}`}>
          <Icon size={24} />
        </div>
        <div className="sensor-info">
          <h3 className="sensor-label">{label}</h3>
          <span className="sensor-name">{sensorName}</span>
        </div>
        <div className={`status-badge ${breached ? 'danger' : 'safe'}`}>
          {breached ? 'Alert' : 'Normal'}
        </div>
      </div>
      <div className="sensor-value-group">
        <span className="sensor-value">{value == null ? '—' : Math.round(value * 10) / 10}</span>
        <span className="sensor-unit">{unit}</span>
      </div>
      <div className="progress-container">
        <div className="progress-bar">
          <div className={`progress-fill ${type}`} style={{ width: `${pct}%` }}></div>
          <div className="progress-threshold" style={{ left: `${thresholdPct}%` }}></div>
        </div>
        <div className="progress-label">Threshold: {threshold} {unit}</div>
      </div>
    </div>
  );
}
