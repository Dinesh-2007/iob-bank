import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const sidebarItems = [
  { to: '/admin/overview', icon: '📊', label: 'Executive Overview' },
  { to: '/admin/user-management', icon: '👥', label: 'User & Role Management' },
  { to: '/admin/risk-engine', icon: '⚙️', label: 'Risk Engine Configuration' },
  { to: '/admin/compliance', icon: '📜', label: 'Compliance & Reporting' },
  { to: '/admin/data-sources', icon: '🧩', label: 'Data Sources' },
  { to: '/admin/model-monitoring', icon: '📈', label: 'Model Monitoring' },
  { to: '/admin/audit-logs', icon: '🔐', label: 'Audit Logs' }
];

const AdminShell = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <p className="admin-brand-pill">IOB BANK AML</p>
          <h1>Admin Control Center</h1>
          <p className="admin-brand-subtext">Mule account detection and operational governance</p>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `admin-nav-link${isActive ? ' admin-nav-link-active' : ''}`
              }
            >
              <span className="admin-nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="admin-logout-btn" onClick={() => navigate('/')}>
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-topbar-label">Security Operations</p>
            <h2>Real-time Mule Risk Dashboard</h2>
          </div>
          <div className="admin-topbar-meta">
            <span className="admin-topbar-dot" />
            Monitoring Active
          </div>
        </header>

        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminShell;
