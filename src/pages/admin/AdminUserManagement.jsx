import { useMemo, useState } from 'react';

const analystWorkload = [
  {
    analyst: 'Arjun Nair',
    id: 'IOB-AML-2401',
    team: 'Team Alpha',
    location: 'Chennai',
    openCases: 42,
    closedToday: 7,
    highRisk: 16,
    mediumRisk: 18,
    lowRisk: 8,
    avgResolutionTime: '8.3h',
    strFiled: 12,
    escalations: 3,
    efficiency: 87,
    status: '🟡 Moderate',
    statusClass: 'moderate'
  },
  {
    analyst: 'Meera Iyer',
    id: 'IOB-AML-2402',
    team: 'Team Beta',
    location: 'Mumbai',
    openCases: 38,
    closedToday: 9,
    highRisk: 14,
    mediumRisk: 16,
    lowRisk: 8,
    avgResolutionTime: '7.1h',
    strFiled: 15,
    escalations: 2,
    efficiency: 91,
    status: '🟢 Balanced',
    statusClass: 'balanced'
  },
  {
    analyst: 'Rajesh Kumar',
    id: 'IOB-AML-2403',
    team: 'Team Alpha',
    location: 'Bangalore',
    openCases: 54,
    closedToday: 5,
    highRisk: 24,
    mediumRisk: 22,
    lowRisk: 8,
    avgResolutionTime: '11.8h',
    strFiled: 18,
    escalations: 6,
    efficiency: 68,
    status: '🔴 Overloaded',
    statusClass: 'overloaded'
  },
  {
    analyst: 'Sanjay Menon',
    id: 'IOB-AML-2404',
    team: 'Team Gamma',
    location: 'Delhi',
    openCases: 36,
    closedToday: 8,
    highRisk: 12,
    mediumRisk: 16,
    lowRisk: 8,
    avgResolutionTime: '6.9h',
    strFiled: 11,
    escalations: 1,
    efficiency: 93,
    status: '🟢 Balanced',
    statusClass: 'balanced'
  },
  {
    analyst: 'Priya Raman',
    id: 'IOB-AML-2405',
    team: 'Team Beta',
    location: 'Kolkata',
    openCases: 48,
    closedToday: 6,
    highRisk: 20,
    mediumRisk: 19,
    lowRisk: 9,
    avgResolutionTime: '9.7h',
    strFiled: 16,
    escalations: 4,
    efficiency: 75,
    status: '🔴 Overloaded',
    statusClass: 'overloaded'
  },
  {
    analyst: 'Dhanush Kumar',
    id: 'IOB-AML-2406',
    team: 'Team Gamma',
    location: 'Hyderabad',
    openCases: 40,
    closedToday: 8,
    highRisk: 15,
    mediumRisk: 17,
    lowRisk: 8,
    avgResolutionTime: '7.8h',
    strFiled: 13,
    escalations: 2,
    efficiency: 89,
    status: '🟡 Moderate',
    statusClass: 'moderate'
  },
  {
    analyst: 'Nikita Shah',
    id: 'IOB-AML-2407',
    team: 'Team Alpha',
    location: 'Pune',
    openCases: 34,
    closedToday: 10,
    highRisk: 11,
    mediumRisk: 15,
    lowRisk: 8,
    avgResolutionTime: '6.2h',
    strFiled: 9,
    escalations: 1,
    efficiency: 95,
    status: '🟢 Balanced',
    statusClass: 'balanced'
  },
  {
    analyst: 'Aditya Singh',
    id: 'IOB-AML-2408',
    team: 'Team Beta',
    location: 'Ahmedabad',
    openCases: 52,
    closedToday: 4,
    highRisk: 23,
    mediumRisk: 21,
    lowRisk: 8,
    avgResolutionTime: '12.4h',
    strFiled: 19,
    escalations: 7,
    efficiency: 65,
    status: '🔴 Overloaded',
    statusClass: 'overloaded'
  },
  {
    analyst: 'Kavya Reddy',
    id: 'IOB-AML-2409',
    team: 'Team Gamma',
    location: 'Kochi',
    openCases: 39,
    closedToday: 9,
    highRisk: 14,
    mediumRisk: 17,
    lowRisk: 8,
    avgResolutionTime: '7.5h',
    strFiled: 12,
    escalations: 2,
    efficiency: 90,
    status: '🟢 Balanced',
    statusClass: 'balanced'
  },
  {
    analyst: 'Vikram Bose',
    id: 'IOB-AML-2410',
    team: 'Team Alpha',
    location: 'Jaipur',
    openCases: 44,
    closedToday: 7,
    highRisk: 18,
    mediumRisk: 18,
    lowRisk: 8,
    avgResolutionTime: '9.1h',
    strFiled: 14,
    escalations: 3,
    efficiency: 82,
    status: '🟡 Moderate',
    statusClass: 'moderate'
  },
  {
    analyst: 'Sneha Desai',
    id: 'IOB-AML-2411',
    team: 'Team Beta',
    location: 'Chandigarh',
    openCases: 37,
    closedToday: 8,
    highRisk: 13,
    mediumRisk: 16,
    lowRisk: 8,
    avgResolutionTime: '7.2h',
    strFiled: 10,
    escalations: 2,
    efficiency: 92,
    status: '🟢 Balanced',
    statusClass: 'balanced'
  },
  {
    analyst: 'Rohit Sharma',
    id: 'IOB-AML-2412',
    team: 'Team Gamma',
    location: 'Lucknow',
    openCases: 41,
    closedToday: 7,
    highRisk: 16,
    mediumRisk: 17,
    lowRisk: 8,
    avgResolutionTime: '8.6h',
    strFiled: 13,
    escalations: 3,
    efficiency: 84,
    status: '🟡 Moderate',
    statusClass: 'moderate'
  }
];

const teamMembers = [
  {
    name: 'Arjun Nair',
    role: 'Analyst',
    department: 'AML Operations',
    lastActive: '2026-02-17 09:31',
    casesClosed: 38,
    status: 'Active'
  },
  {
    name: 'Meera Iyer',
    role: 'Analyst',
    department: 'Transaction Surveillance',
    lastActive: '2026-02-17 09:10',
    casesClosed: 41,
    status: 'Active'
  },
  {
    name: 'Sanjay Menon',
    role: 'Auditor',
    department: 'Internal Audit',
    lastActive: '2026-02-16 17:54',
    casesClosed: 19,
    status: 'Reviewing'
  },
  {
    name: 'Priya Raman',
    role: 'Analyst',
    department: 'Fraud Intelligence',
    lastActive: '2026-02-16 15:28',
    casesClosed: 27,
    status: 'Active'
  },
  {
    name: 'Dhanush Kumar',
    role: 'Auditor',
    department: 'Compliance Validation',
    lastActive: '2026-02-15 20:06',
    casesClosed: 14,
    status: 'Idle'
  },
  {
    name: 'Nikita Shah',
    role: 'Analyst',
    department: 'AML Operations',
    lastActive: '2026-02-17 08:58',
    casesClosed: 34,
    status: 'Active'
  }
];

const userActivityLogs = [
  { user: 'Arjun Nair', action: 'Escalated Cluster A2 to L2 review', when: '09:28' },
  { user: 'Meera Iyer', action: 'Updated account risk rationale', when: '09:17' },
  { user: 'Sanjay Menon', action: 'Approved STR draft STR-2026-0216', when: '08:55' },
  { user: 'Priya Raman', action: 'Added 5 accounts to watchlist', when: '08:34' },
  { user: 'Nikita Shah', action: 'Closed case C-774102 after evidence upload', when: '08:11' }
];

const AdminUserManagement = () => {
  const [analystTeamFilter, setAnalystTeamFilter] = useState('All Teams');
  const [analystLocationFilter, setAnalystLocationFilter] = useState('All Locations');
  const [analystStatusFilter, setAnalystStatusFilter] = useState('All Status');

  const teams = useMemo(() => {
    return ['All Teams', ...new Set(analystWorkload.map(a => a.team))];
  }, []);

  const locations = useMemo(() => {
    return ['All Locations', ...new Set(analystWorkload.map(a => a.location))];
  }, []);

  const filteredAnalystWorkload = useMemo(() => {
    return analystWorkload.filter((analyst) => {
      const teamMatch = analystTeamFilter === 'All Teams' || analyst.team === analystTeamFilter;
      const locationMatch = analystLocationFilter === 'All Locations' || analyst.location === analystLocationFilter;
      const statusMatch = analystStatusFilter === 'All Status' || analyst.status === analystStatusFilter;
      return teamMatch && locationMatch && statusMatch;
    });
  }, [analystTeamFilter, analystLocationFilter, analystStatusFilter]);

  const analystSummary = useMemo(() => {
    return {
      total: filteredAnalystWorkload.length,
      totalOpen: filteredAnalystWorkload.reduce((sum, a) => sum + a.openCases, 0),
      totalHighRisk: filteredAnalystWorkload.reduce((sum, a) => sum + a.highRisk, 0),
      totalClosed: filteredAnalystWorkload.reduce((sum, a) => sum + a.closedToday, 0),
      avgEfficiency: filteredAnalystWorkload.length > 0
        ? Math.round(filteredAnalystWorkload.reduce((sum, a) => sum + a.efficiency, 0) / filteredAnalystWorkload.length)
        : 0,
      balanced: filteredAnalystWorkload.filter(a => a.statusClass === 'balanced').length,
      moderate: filteredAnalystWorkload.filter(a => a.statusClass === 'moderate').length,
      overloaded: filteredAnalystWorkload.filter(a => a.statusClass === 'overloaded').length
    };
  }, [filteredAnalystWorkload]);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h3>User & Role Management</h3>
        <p>Manage analysts, auditors, and their day-to-day case handling activities.</p>
      </div>

      {/* Analyst Workload Dashboard */}
      <section className="admin-card analyst-workload-card">
        <div className="card-head card-head-responsive">
          <h4>Analyst Workload Dashboard</h4>
          <div className="filter-group analyst-filters">
            <select 
              className="team-filter" 
              value={analystTeamFilter} 
              onChange={(e) => setAnalystTeamFilter(e.target.value)}
            >
              {teams.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
            <select 
              className="location-filter" 
              value={analystLocationFilter} 
              onChange={(e) => setAnalystLocationFilter(e.target.value)}
            >
              {locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            <select 
              className="status-filter-analyst" 
              value={analystStatusFilter} 
              onChange={(e) => setAnalystStatusFilter(e.target.value)}
            >
              <option value="All Status">All Status</option>
              <option value="🟢 Balanced">🟢 Balanced</option>
              <option value="🟡 Moderate">🟡 Moderate</option>
              <option value="🔴 Overloaded">🔴 Overloaded</option>
            </select>
          </div>
        </div>
        <div className="analyst-summary-stats">
          <div className="summary-stat">
            <span className="summary-label">Total Analysts</span>
            <span className="summary-value">{analystSummary.total}</span>
          </div>
          <div className="summary-stat">
            <span className="summary-label">Total Open Cases</span>
            <span className="summary-value highlight-open">{analystSummary.totalOpen}</span>
          </div>
          <div className="summary-stat">
            <span className="summary-label">High Risk Cases</span>
            <span className="summary-value highlight-risk">{analystSummary.totalHighRisk}</span>
          </div>
          <div className="summary-stat">
            <span className="summary-label">Closed Today</span>
            <span className="summary-value highlight-closed">{analystSummary.totalClosed}</span>
          </div>
          <div className="summary-stat">
            <span className="summary-label">Avg Efficiency</span>
            <span className="summary-value highlight-efficiency">{analystSummary.avgEfficiency}%</span>
          </div>
          <div className="summary-stat status-breakdown">
            <span className="summary-label">Load Distribution</span>
            <div className="status-badges">
              <span className="status-badge balanced">🟢 {analystSummary.balanced}</span>
              <span className="status-badge moderate">🟡 {analystSummary.moderate}</span>
              <span className="status-badge overloaded">🔴 {analystSummary.overloaded}</span>
            </div>
          </div>
        </div>
        <div className="analyst-workload-wrapper">
          <div className="analyst-workload-table">
            <table>
              <thead>
                <tr>
                  <th>Analyst</th>
                  <th>ID</th>
                  <th>Team</th>
                  <th>Location</th>
                  <th>Open</th>
                  <th>High Risk</th>
                  <th>Medium</th>
                  <th>Low</th>
                  <th>Closed Today</th>
                  <th>Avg Time</th>
                  <th>STR Filed</th>
                  <th>Efficiency</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnalystWorkload.map((analyst) => (
                  <tr key={analyst.id}>
                    <td className="analyst-name">{analyst.analyst}</td>
                    <td className="analyst-id-col">{analyst.id}</td>
                    <td className="analyst-team">{analyst.team}</td>
                    <td className="analyst-location">{analyst.location}</td>
                    <td className="analyst-cases">{analyst.openCases}</td>
                    <td className="analyst-high-risk">{analyst.highRisk}</td>
                    <td className="analyst-medium-risk">{analyst.mediumRisk}</td>
                    <td className="analyst-low-risk">{analyst.lowRisk}</td>
                    <td className="analyst-closed">{analyst.closedToday}</td>
                    <td className="analyst-avg-time">{analyst.avgResolutionTime}</td>
                    <td className="analyst-str">{analyst.strFiled}</td>
                    <td className="analyst-efficiency">
                      <div className="efficiency-bar-container">
                        <div className="efficiency-bar" style={{ width: `${analyst.efficiency}%` }}>
                          <span>{analyst.efficiency}%</span>
                        </div>
                      </div>
                    </td>
                    <td className={`analyst-status ${analyst.statusClass}`}>{analyst.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredAnalystWorkload.length === 0 && (
            <div className="no-data-message">
              <p>No analysts match the selected filters</p>
            </div>
          )}
        </div>
      </section>

      {/* Original User Management Section */}
      <section className="admin-card control-card">
        <div className="filters-grid">
          <label>
            Role Type
            <select defaultValue="All">
              <option>All</option>
              <option>Analyst</option>
              <option>Auditor</option>
            </select>
          </label>
          <label>
            Last Active Date
            <input type="date" defaultValue="2026-02-17" />
          </label>
          <label>
            Department
            <select defaultValue="All Departments">
              <option>All Departments</option>
              <option>AML Operations</option>
              <option>Transaction Surveillance</option>
              <option>Fraud Intelligence</option>
              <option>Internal Audit</option>
              <option>Compliance Validation</option>
            </select>
          </label>
        </div>
        <div className="btn-row">
          <button className="btn-primary">Add Analyst</button>
          <button className="btn-secondary">Remove Analyst</button>
        </div>
      </section>

      <section className="admin-card table-card">
        <div className="card-head">
          <h4>Role-based Access Directory</h4>
          <span>Analyst / Auditor access control</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Last Active</th>
                <th>Cases Closed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.name}>
                  <td>{member.name}</td>
                  <td>{member.role}</td>
                  <td>{member.department}</td>
                  <td>{member.lastActive}</td>
                  <td>{member.casesClosed}</td>
                  <td>
                    <span className={`status-pill ${member.status.toLowerCase()}`}>{member.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-card">
        <div className="card-head">
          <h4>Activity Logs per User</h4>
          <span>Recent actions</span>
        </div>
        <ul className="activity-list">
          {userActivityLogs.map((log, index) => (
            <li key={`${log.user}-${index}`}>
              <p>
                <strong>{log.user}</strong> - {log.action}
              </p>
              <span>{log.when}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminUserManagement;
