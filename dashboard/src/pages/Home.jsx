import { ArrowRight, Cpu, Cloud, Laptop, Flame, ThermometerSun, Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="hero-bg-wrapper">
        <header className="hero-section">
          <div className="hero-content">
            <span className="hero-subtitle">SAFER HOSTELS. BRIGHTER TOMORROWS.</span>
            <h1 className="hero-title">Hostel<span className="text-accent">Guard</span></h1>
            <h2 className="hero-headline">Real-time hazard monitoring for hostel and lab rooms.</h2>
            <p className="hero-description">
              An IoT-based safety system that detects gas leaks, fire and abnormal heat, 
              and instantly alerts wardens and students — so emergencies can be noticed and handled early.
            </p>
            <button className="primary-btn" onClick={() => navigate('/dashboard')}>
              View live dashboard <ArrowRight size={18} />
            </button>
          </div>
        </header>
      </div>

      <div className="home-content">
        <section className="problem-section">
        <div className="problem-header">THE PROBLEM</div>
        <div className="problem-content">
          <h3 className="problem-title">No automated hazard detection in most hostels and labs today.</h3>
          <div className="problem-divider"></div>
          <p className="problem-description">
            Gas leaks, fires or overheating often go unnoticed until it's too late. 
            Most hostel rooms and lab spaces don't have a real-time monitoring system, 
            relying only on manual checks or human presence.
          </p>
        </div>
      </section>

      <section className="how-it-works-section">
        <h4 className="section-label">HOW HOSTELGUARD WORKS</h4>
        <div className="steps-container">
          <div 
            className="step-card"
            style={{
              backgroundImage: "linear-gradient(to bottom, transparent 0%, rgba(6, 16, 28, 0.8) 100%), url('/sensors-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center top",
              minHeight: "280px",
              padding: "20px 20px 16px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div className="step-number" style={{ marginBottom: 0 }}>1</div>
              <h5 className="step-title" style={{ marginBottom: 0 }}>Sensors</h5>
            </div>
            <div className="step-info" style={{ marginTop: "auto", position: "relative", zIndex: 2 }}>
              <p className="step-desc" style={{ marginBottom: 0, textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
                ESP32 reads gas/smoke, flame and temperature sensors continuously.
              </p>
            </div>
            <Cpu className="step-icon" size={40} style={{ position: "absolute", bottom: "16px", right: "20px", opacity: 0.2, zIndex: 1 }} />
          </div>
          <ArrowRight className="step-arrow" size={24} />
          
          <div 
            className="step-card"
            style={{
              backgroundImage: "linear-gradient(to bottom, transparent 0%, rgba(6, 16, 28, 0.8) 100%), url('/cloud-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center top",
              minHeight: "280px",
              padding: "20px 20px 16px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div className="step-number" style={{ marginBottom: 0 }}>2</div>
              <h5 className="step-title" style={{ marginBottom: 0 }}>Cloud</h5>
            </div>
            <div className="step-info" style={{ marginTop: "auto", position: "relative", zIndex: 2 }}>
              <p className="step-desc" style={{ marginBottom: 0, textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
                Readings are sent to Supabase (cloud database) via the internet.
              </p>
            </div>
            <Cloud className="step-icon" size={40} style={{ position: "absolute", bottom: "16px", right: "20px", opacity: 0.2, zIndex: 1 }} />
          </div>
          <ArrowRight className="step-arrow" size={24} />
          
          <div 
            className="step-card"
            style={{
              backgroundImage: "linear-gradient(to bottom, transparent 0%, rgba(6, 16, 28, 0.8) 100%), url('/alert-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center top",
              minHeight: "280px",
              padding: "20px 20px 16px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div className="step-number" style={{ marginBottom: 0 }}>3</div>
              <h5 className="step-title" style={{ marginBottom: 0 }}>Live Alerts</h5>
            </div>
            <div className="step-info" style={{ marginTop: "auto", position: "relative", zIndex: 2 }}>
              <p className="step-desc" style={{ marginBottom: 0, textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
                The dashboard receives real-time data and instantly shows alerts when any threshold is crossed.
              </p>
            </div>
            <Laptop className="step-icon" size={40} style={{ position: "absolute", bottom: "16px", right: "20px", opacity: 0.2, zIndex: 1 }} />
          </div>
        </div>
      </section>

      <section className="hazards-section">
        <h4 className="section-label">HAZARDS WE MONITOR</h4>
        <div className="hazards-container">
          <div className="hazard-card">
            <div className="hazard-icon-wrapper danger-bg">
              <Wind className="hazard-icon" size={24} color="#e5484d" />
            </div>
            <div className="hazard-info">
              <h5 className="hazard-title">Gas & Smoke</h5>
              <p className="hazard-desc">Detects harmful gas leaks and smoke build-up (e.g. LPG, other gases).</p>
            </div>
          </div>
          <div className="hazard-card">
            <div className="hazard-icon-wrapper warn-bg">
              <Flame className="hazard-icon" size={24} color="#f5a623" />
            </div>
            <div className="hazard-info">
              <h5 className="hazard-title">Fire & Flame</h5>
              <p className="hazard-desc">Monitors flame/fire presence in real time.</p>
            </div>
          </div>
          <div className="hazard-card">
            <div className="hazard-icon-wrapper danger-bg">
              <ThermometerSun className="hazard-icon" size={24} color="#e5484d" />
            </div>
            <div className="hazard-info">
              <h5 className="hazard-title">Abnormal Heat</h5>
              <p className="hazard-desc">Tracks temperature to detect overheating or unusual heat rise.</p>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
