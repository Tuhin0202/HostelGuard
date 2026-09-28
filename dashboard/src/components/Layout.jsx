import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="layout-wrapper">
      <nav className="top-nav">
        <div className="nav-brand">
          <div className="brand-logo-container">
            <img src="/logo.jpg" alt="HostelGuard" className="brand-img-logo" />
          </div>
          <span className="brand-text">HostelGuard</span>
        </div>
        <div className="nav-menu">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
          <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>History</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>About</NavLink>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
