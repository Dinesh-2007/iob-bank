const complianceReports = [
  {
    id: 'STR-2026-0224',
    type: 'STR Report',
    risk: 'Critical',
    status: 'Submitted',
    state: 'Tamil Nadu / Chennai',
    updated: '2026-02-17 08:42'
  },
  {
    id: 'SAR-2026-0177',
    type: 'SAR Draft',
    risk: 'High',
    status: 'Draft',
    state: 'Maharashtra / Mumbai',
    updated: '2026-02-16 18:20'
  },
  {
    id: 'REG-2026-Q1-14',
    type: 'Regulatory Export',
    risk: 'Moderate',
    status: 'Queued',
    state: 'Delhi / Central',
    updated: '2026-02-16 15:06'
  },
  {
    id: 'CCR-2026-0051',
    type: 'Case Closure Report',
    risk: 'Low',
    status: 'Approved',
    state: 'Karnataka / Bengaluru',
    updated: '2026-02-15 11:48'
  },
  {
    id: 'STR-2026-0211',
    type: 'STR Report',
    risk: 'High',
    status: 'Submitted',
    state: 'West Bengal / Kolkata',
    updated: '2026-02-15 09:14'
  },
  {
    id: 'SAR-2026-0169',
    type: 'SAR Draft',
    risk: 'Critical',
    status: 'Review',
    state: 'Telangana / Hyderabad',
    updated: '2026-02-14 19:23'
  }
];

const AdminCompliance = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h3>Compliance & Reporting</h3>
        <p>Track STR/SAR workflows, regulatory exports, and case closure documents.</p>
      </div>

      <section className="admin-card control-card">
        <div className="filters-grid compliance-filters">
          <label>
            Date Range
            <input type="date" defaultValue="2026-02-01" />
          </label>
          <label>
            Risk Level
            <select defaultValue="All">
              <option>All</option>
              <option>Critical</option>
              <option>High</option>
              <option>Moderate</option>
              <option>Low</option>
            </select>
          </label>
          <label>
            Report Status
            <select defaultValue="All">
              <option>All</option>
              <option>Draft</option>
              <option>Review</option>
              <option>Queued</option>
              <option>Submitted</option>
              <option>Approved</option>
            </select>
          </label>
          <label>
            State / District
            <select defaultValue="All">
              <option>All</option>
              <option>Tamil Nadu / Chennai</option>
              <option>Maharashtra / Mumbai</option>
              <option>Delhi / Central</option>
              <option>Karnataka / Bengaluru</option>
              <option>West Bengal / Kolkata</option>
              <option>Telangana / Hyderabad</option>
            </select>
          </label>
        </div>
      </section>

      <section className="admin-card table-card">
        <div className="card-head">
          <h4>Report Register</h4>
          <span>STR Reports, SAR Drafts, Regulatory Export, Case Closure Reports</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Type</th>
                <th>Risk Level</th>
                <th>Status</th>
                <th>State / District</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {complianceReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.type}</td>
                  <td>
                    <span className={`status-pill ${report.risk.toLowerCase()}`}>{report.risk}</span>
                  </td>
                  <td>{report.status}</td>
                  <td>{report.state}</td>
                  <td>{report.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminCompliance;
