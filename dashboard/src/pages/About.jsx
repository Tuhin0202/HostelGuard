import { Shield, Zap, Clock, Share2, Layers, Cpu, Cloud, Thermometer, Sun, Database, Code, Target, CheckCircle2, Lightbulb, Rocket, ArrowRight } from 'lucide-react'

export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero" style={{ backgroundImage: 'url(/hero-bg.jpg)' }}>
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <span className="about-badge">ABOUT HOSTELGUARD</span>
          <h1 className="about-title">A Smarter, <span className="text-accent">Safer Tomorrow</span></h1>
          <p className="about-subtitle">
            HostelGuard is an IoT-based safety monitoring system for hostel and lab rooms. 
            It automatically detects hazardous conditions like gas leaks, fire, and abnormal 
            heat, and instantly alerts wardens and students. The system uses a simulated 
            ESP32 (running in Wokwi) to read sensor data and sends it to Supabase, which 
            pushes the information to this live dashboard in real time.
          </p>
          <div className="about-hero-features">
            <div className="hero-feature-pill">
              <div className="hero-feature-icon green"><Zap size={18} /></div>
              <span>Real-time<br/>Monitoring</span>
            </div>
            <div className="hero-feature-pill">
              <div className="hero-feature-icon blue"><Shield size={18} /></div>
              <span>Early Hazard<br/>Detection</span>
            </div>
            <div className="hero-feature-pill">
              <div className="hero-feature-icon red"><Clock size={18} /></div>
              <span>24/7<br/>Protection</span>
            </div>
          </div>
        </div>
        <div className="about-hero-quote">
          <p>Safer rooms,<br/>healthier spaces,<br/>better tomorrows.</p>
          <div className="quote-underline"></div>
        </div>
      </div>

      <div className="about-middle-grid">
        {/* Architecture Section */}
        <div className="about-card arch-card">
          <div className="about-card-header">
            <Share2 size={20} className="text-dim" />
            <h2>System Architecture & Data Flow</h2>
          </div>
          <div className="arch-flow">
            <div className="arch-box arch-esp" style={{ backgroundImage: 'url(/esp32.jpg)' }}>
              <div className="arch-box-overlay"></div>
              <div className="arch-box-content">
                <div className="arch-box-title">
                  <span className="arch-box-number">1</span>
                  <span>Simulated ESP32</span>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <p>Reads data from sensors (MQ-2, DHT22, photoresistor).</p>
                  <span className="arch-tag">(Wokwi)</span>
                </div>
              </div>
            </div>
            
            <div className="arch-arrow">
              <span className="arrow-text text-accent">HTTPS<br/>POST</span>
              <ArrowRight size={20} className="text-accent" />
            </div>

            <div className="arch-box arch-supabase" style={{ backgroundImage: 'url(/supabase.jpg)' }}>
              <div className="arch-box-overlay"></div>
              <div className="arch-box-content">
                <div className="arch-box-title">
                  <span className="arch-box-number">2</span>
                  <span>Supabase</span>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <p>Stores the readings in a cloud database.</p>
                </div>
              </div>
            </div>

            <div className="arch-arrow">
              <span className="arrow-text" style={{ color: '#3ecf8e' }}>Realtime<br/>push</span>
              <ArrowRight size={20} style={{ color: '#3ecf8e' }} />
            </div>

            <div className="arch-box arch-dashboard" style={{ backgroundImage: 'url(/web.jpg)' }}>
              <div className="arch-box-overlay"></div>
              <div className="arch-box-content">
                <div className="arch-box-title">
                  <span className="arch-box-number">3</span>
                  <span>Web Dashboard</span>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <p>Fetches data instantly and displays live updates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="about-card stack-card">
          <div className="about-card-header">
            <Layers size={20} className="text-dim" />
            <h2>Tech Stack</h2>
          </div>
          <div className="stack-list">
            <div className="stack-item">
              <Cpu size={20} className="text-accent" />
              <div className="stack-item-content">
                <h4>ESP32 (Wokwi)</h4>
                <p>Simulates the microcontroller reading sensor data.</p>
              </div>
            </div>
            <div className="stack-item">
              <Cloud size={20} className="text-accent" />
              <div className="stack-item-content">
                <h4>MQ-2 Sensor</h4>
                <p>Detects gas and smoke (e.g., LPG, other gases).</p>
              </div>
            </div>
            <div className="stack-item">
              <Thermometer size={20} style={{ color: '#e5484d' }} />
              <div className="stack-item-content">
                <h4>DHT22 Sensor</h4>
                <p>Measures temperature and humidity.</p>
              </div>
            </div>
            <div className="stack-item">
              <Sun size={20} style={{ color: '#f5a623' }} />
              <div className="stack-item-content">
                <h4>Photoresistor (LDR)</h4>
                <p>Acts as a flame sensor (detects fire/light).</p>
              </div>
            </div>
            <div className="stack-item">
              <Database size={20} style={{ color: '#3ecf8e' }} />
              <div className="stack-item-content">
                <h4>Supabase</h4>
                <p>Cloud database to store sensor readings and alerts.</p>
              </div>
            </div>
            <div className="stack-item">
              <Code size={20} className="text-accent" />
              <div className="stack-item-content">
                <h4>React + Vite</h4>
                <p>Frontend framework for a fast and responsive UI.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-bottom-grid">
        {/* The Problem */}
        <div className="about-info-col">
          <div className="about-info-header">
            <Target size={20} className="text-accent" />
            <h3>The Problem</h3>
          </div>
          <p className="about-info-text">
            Most hostels and labs today lack automated hazard detection. Gas leaks, fires, 
            or abnormal temperature can go unnoticed until it's too late, putting lives and 
            property at risk. Manual checks are slow, error-prone, and often insufficient.
          </p>
          <div className="solution-box">
            <div className="solution-icon"><Lightbulb size={20} /></div>
            <div className="solution-content">
              <h4>Our Solution</h4>
              <p>HostelGuard provides a real-time, automated, and cloud-connected safety monitoring system that immediately alerts when any danger is detected.</p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="about-info-col">
          <div className="about-info-header">
            <Shield size={20} className="text-accent" />
            <h3>Key Features</h3>
          </div>
          <ul className="features-list">
            <li><CheckCircle2 size={16} className="text-safe" /> Monitors gas/smoke, fire, temperature and humidity</li>
            <li><CheckCircle2 size={16} className="text-safe" /> Instant alerts with buzzer + LED (in simulation)</li>
            <li><CheckCircle2 size={16} className="text-safe" /> Live dashboard with real-time updates (Supabase)</li>
            <li><CheckCircle2 size={16} className="text-safe" /> Historical data and trend analysis</li>
            <li><CheckCircle2 size={16} className="text-safe" /> Accessible from anywhere, 24/7</li>
          </ul>
        </div>

        {/* Built For */}
        <div className="about-info-col">
          <div className="about-info-header">
            <Rocket size={20} className="text-accent" />
            <h3>Built For</h3>
          </div>
          <p className="about-info-text">
            A 24-hour hackathon using only free tools — no physical hardware required.
          </p>
          <div className="built-for-badge">
            <Code size={16} />
            <span>Open Source | Free Tools | Real Impact</span>
          </div>
        </div>
      </div>
    </div>
  )
}
