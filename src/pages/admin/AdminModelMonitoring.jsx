const modelRegistry = [
  {
    model: 'Mule Graph Classifier v4.2',
    auc: '0.942',
    precision: '0.911',
    recall: '0.884',
    drift: '1.6%',
    status: 'Stable'
  },
  {
    model: 'Transaction Sequence RNN v2.9',
    auc: '0.917',
    precision: '0.872',
    recall: '0.901',
    drift: '3.8%',
    status: 'Monitor'
  },
  {
    model: 'Beneficiary Network Risk v3.5',
    auc: '0.933',
    precision: '0.897',
    recall: '0.893',
    drift: '2.1%',
    status: 'Stable'
  },
  {
    model: 'Device Anomaly Scorer v1.8',
    auc: '0.885',
    precision: '0.844',
    recall: '0.812',
    drift: '6.2%',
    status: 'Drift'
  }
];

const AdminModelMonitoring = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h3>Model Monitoring</h3>
        <p>Model quality, drift status, and operational performance for detection pipelines.</p>
      </div>

      <section className="admin-card table-card">
        <div className="card-head">
          <h4>Model Performance Board</h4>
          <span>AUC, Precision, Recall, Drift</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Model</th>
                <th>AUC</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>Drift</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {modelRegistry.map((model) => (
                <tr key={model.model}>
                  <td>{model.model}</td>
                  <td>{model.auc}</td>
                  <td>{model.precision}</td>
                  <td>{model.recall}</td>
                  <td>{model.drift}</td>
                  <td>
                    <span className={`status-pill ${model.status.toLowerCase()}`}>{model.status}</span>
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

export default AdminModelMonitoring;
