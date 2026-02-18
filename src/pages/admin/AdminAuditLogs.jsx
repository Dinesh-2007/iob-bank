const auditEntries = [
  {
    timestamp: '2026-02-17 09:32',
    actor: 'admin@iobbank',
    action: 'Updated Graph Relationship Sensitivity from 75 to 79',
    module: 'Risk Engine',
    ip: '10.2.45.18'
  },
  {
    timestamp: '2026-02-17 09:21',
    actor: 'sanjay.menon@iobbank',
    action: 'Approved STR-2026-0224 for regulatory submission',
    module: 'Compliance',
    ip: '10.2.21.67'
  },
  {
    timestamp: '2026-02-17 08:56',
    actor: 'meera.iyer@iobbank',
    action: 'Escalated account AC-443198 to Level-2 investigation',
    module: 'Case Management',
    ip: '10.2.31.09'
  },
  {
    timestamp: '2026-02-16 21:07',
    actor: 'admin@iobbank',
    action: 'Disabled Dormant Account Reactivation rule',
    module: 'Risk Engine',
    ip: '10.2.45.18'
  },
  {
    timestamp: '2026-02-16 19:44',
    actor: 'nikita.shah@iobbank',
    action: 'Exported SAR drafts for quarterly audit',
    module: 'Compliance',
    ip: '10.2.31.55'
  },
  {
    timestamp: '2026-02-16 17:30',
    actor: 'system',
    action: 'Device Intelligence API latency threshold breach',
    module: 'Data Sources',
    ip: 'Internal'
  }
];

const AdminAuditLogs = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h3>Audit Logs</h3>
        <p>Immutable trail of administrative actions, model updates, and reporting activities.</p>
      </div>

      <section className="admin-card table-card">
        <div className="card-head">
          <h4>Security Audit Register</h4>
          <span>User, action, module, timestamp, source IP</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Module</th>
                <th>Source IP</th>
              </tr>
            </thead>
            <tbody>
              {auditEntries.map((entry, index) => (
                <tr key={`${entry.actor}-${index}`}>
                  <td>{entry.timestamp}</td>
                  <td>{entry.actor}</td>
                  <td>{entry.action}</td>
                  <td>{entry.module}</td>
                  <td>{entry.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminAuditLogs;
