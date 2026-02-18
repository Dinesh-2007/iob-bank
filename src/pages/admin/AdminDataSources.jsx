const sourceFeeds = [
  { source: 'Core Banking Ledger', type: 'Internal', latency: '2m 10s', quality: '99.4%', status: 'Healthy' },
  { source: 'UPI Transaction Stream', type: 'Internal', latency: '34s', quality: '98.8%', status: 'Healthy' },
  { source: 'Device Intelligence API', type: 'External', latency: '1m 43s', quality: '97.1%', status: 'Delayed' },
  { source: 'Sanctions Watchlist', type: 'External', latency: '5m 05s', quality: '99.9%', status: 'Synced' },
  { source: 'KYC Registry', type: 'Internal', latency: '3m 18s', quality: '96.7%', status: 'Warning' },
  { source: 'Telecom SIM Mapping', type: 'External', latency: '4m 22s', quality: '95.9%', status: 'Delayed' }
];

const AdminDataSources = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h3>Data Sources</h3>
        <p>Source health monitoring for internal systems and third-party enrichment feeds.</p>
      </div>

      <section className="admin-card table-card">
        <div className="card-head">
          <h4>Ingestion Registry</h4>
          <span>Latency, quality, and sync status</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>Type</th>
                <th>Latency</th>
                <th>Data Quality</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sourceFeeds.map((feed) => (
                <tr key={feed.source}>
                  <td>{feed.source}</td>
                  <td>{feed.type}</td>
                  <td>{feed.latency}</td>
                  <td>{feed.quality}</td>
                  <td>
                    <span className={`status-pill ${feed.status.toLowerCase()}`}>{feed.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDataSources;
