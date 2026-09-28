import { NavLink, Outlet } from 'react-router-dom';
import { Shield, Moon } from 'lucide-react';

export default function Layout() {
  return (
    <div className="layout-wrapper">
      <nav className="top-nav">
        <div className="nav-brand">
          <div className="brand-logo-container">
            <Shield className="brand-logo" size={20} weight="fill" color="#4fa8e0" />
          </div>
          <span className="brand-text">HostelGuard</span>
        </div>
        <div className="nav-menu">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
          <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>History</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>About</NavLink>
          <button className="theme-toggle-btn">
            <Moon size={18} />
          </button>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
