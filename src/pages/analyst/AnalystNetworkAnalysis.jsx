import { useMemo, useState } from 'react';
import { useAnalystContext } from './AnalystShell';
import '../Dashboard.css';

const AnalystNetworkAnalysis = () => {
  const { clusters } = useAnalystContext();

  const [networkFilters, setNetworkFilters] = useState({
    minClusterSize: 0,
    minAvgRisk: 0,
    sharedDeviceOnly: false
  });

  const filteredClusters = useMemo(() => {
    return clusters.filter((cluster) => {
      if (cluster.clusterSize < Number(networkFilters.minClusterSize)) return false;
      if (cluster.avgRisk < Number(networkFilters.minAvgRisk)) return false;
      if (networkFilters.sharedDeviceOnly && cluster.sharedDeviceCount === 0) return false;
      return true;
    });
  }, [clusters, networkFilters]);

  return (
    <section className="analyst-section">
      <div className="section-heading">
        <h2>Network Analysis</h2>
        <p>Cluster detection with central node analytics and relationship mapping.</p>
      </div>
      <article className="analyst-card">
        <div className="table-filters">
          <label>
            Min Cluster Size
            <input
              type="number"
              min="0"
              value={networkFilters.minClusterSize}
              onChange={(event) =>
                setNetworkFilters((previous) => ({ ...previous, minClusterSize: Number(event.target.value || 0) }))
              }
            />
          </label>

          <label>
            Min Avg Risk
            <input
              type="number"
              min="0"
              max="100"
              value={networkFilters.minAvgRisk}
              onChange={(event) =>
                setNetworkFilters((previous) => ({ ...previous, minAvgRisk: Number(event.target.value || 0) }))
              }
            />
          </label>

          <label className="inline-checkbox">
            <input
              type="checkbox"
              checked={networkFilters.sharedDeviceOnly}
              onChange={(event) =>
                setNetworkFilters((previous) => ({ ...previous, sharedDeviceOnly: event.target.checked }))
              }
            />
            Shared Device Only
          </label>
        </div>

        <div className="split-grid">
          <div>
            <div className="card-headline">
              <h3>Relationship Graph</h3>
              <span>Nodes and edges by cluster</span>
            </div>
            <ul className="relationship-list">
              {filteredClusters.slice(0, 8).map((cluster) => (
                <li key={cluster.clusterId}>
                  <strong>{cluster.clusterId}</strong>
                  <p>{cluster.hubAccount} {'->'} {cluster.transitAccount} {'->'} {cluster.controllerAccount}</p>
                  <span>{cluster.clusterSize} linked accounts</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="card-headline">
              <h3>Central Node Detection</h3>
              <span>Hub / transit / controller</span>
            </div>
            <ul className="central-node-list">
              {filteredClusters.slice(0, 8).map((cluster) => (
                <li key={`${cluster.clusterId}-central`}>
                  <p>{cluster.clusterId}</p>
                  <small>Hub: {cluster.hubAccount}</small>
                  <small>Transit: {cluster.transitAccount}</small>
                  <small>Controller: {cluster.controllerAccount}</small>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Cluster ID</th>
                <th>Cluster Size</th>
                <th>Avg Risk</th>
                <th>Shared Device Count</th>
                <th>Shared Beneficiary</th>
              </tr>
            </thead>
            <tbody>
              {filteredClusters.map((cluster) => (
                <tr key={cluster.clusterId}>
                  <td>{cluster.clusterId}</td>
                  <td>{cluster.clusterSize}</td>
                  <td>{cluster.avgRisk}</td>
                  <td>{cluster.sharedDeviceCount}</td>
                  <td>{cluster.sharedBeneficiary ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
};

export default AnalystNetworkAnalysis;
