import { Flame, Wind, ThermometerSun, Bell } from 'lucide-react';

function timeLabel(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const time = date.toLocaleTimeString('en-GB');
  return `${day} ${month} ${year}, ${time}`;
}

export default function AlertLog({ alerts }) {
  const getIcon = (type) => {
    if (type === 'fire') return <Flame size={16} />;
    if (type === 'gas') return <Wind size={16} />;
    return <ThermometerSun size={16} />;
  };

  const getLabel = (type) => {
    if (type === 'fire') return 'Fire / Flame';
    if (type === 'gas') return 'Gas / Smoke';
    return 'Temperature';
  };

  return (
    <div className="alert-log-card">
      <div className="alert-log-header">
        <div className="alert-log-title">
          <Bell size={20} />
          <h3>Recent Alerts</h3>
        </div>
        <div className="live-updates-badge">
          <span className="dot"></span> Live Updates
        </div>
      </div>
      
      <div className="table-container">
        <table className="alerts-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Time</th>
              <th>Type</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 && (
              <tr><td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "var(--text-dim)" }}>No alerts yet — all clear.</td></tr>
            )}
            {alerts.map((a, i) => (
              <tr key={a.id}>
                <td className="col-id">{String(i + 1).padStart(3, '0')}</td>
                <td className="col-time">{timeLabel(a.created_at)}</td>
                <td className="col-type">
                  <span className={`alert-type-badge ${a.alert_type}`}>
                    {getIcon(a.alert_type)}
                    {getLabel(a.alert_type)}
                  </span>
                </td>
                <td className="col-msg">{a.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
