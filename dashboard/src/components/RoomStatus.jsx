import { ShieldCheck, MapPin, Bed, Users, Clock, ExternalLink } from 'lucide-react';

function timeLabel(iso) {
  if (!iso) return '--';
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const time = date.toLocaleTimeString('en-GB');
  return `${day} ${month} ${year}, ${time}`;
}

export default function RoomStatus({ roomLabel, lastUpdated }) {
  return (
    <div className="room-status-card">
      <div className="room-status-header">
        <div className="room-status-title">
          <ShieldCheck size={20} className="text-accent" />
          <h3>Room Status</h3>
        </div>
      </div>
      <div className="room-image-container">
        <img src="/hero-bg.jpg" alt="Building" className="room-image" />
      </div>
      <div className="room-details-header">
        <div className="room-details-title-row">
          <h4>{roomLabel || 'Block A - Room 101'}</h4>
          <ExternalLink size={18} className="text-dim" />
        </div>
        <span className="room-subtext">Hostel Main Building</span>
      </div>
      <ul className="room-details-list">
        <li>
          <div className="detail-label"><MapPin size={16}/> Building</div>
          <div className="detail-value">Block A</div>
        </li>
        <li>
          <div className="detail-label"><Bed size={16}/> Room Number</div>
          <div className="detail-value">101</div>
        </li>
        <li>
          <div className="detail-label"><Users size={16}/> Monitored By</div>
          <div className="detail-value">Hostel Warden</div>
        </li>
        <li>
          <div className="detail-label"><Clock size={16}/> Last Updated</div>
          <div className="detail-value">{timeLabel(lastUpdated)}</div>
        </li>
      </ul>
    </div>
  );
}
