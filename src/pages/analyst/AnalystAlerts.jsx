import { useMemo, useState } from 'react';
import { useAnalystContext } from './AnalystShell';
import { ALERT_TYPES, ALERT_STATUSES, GEO_RISK_LEVELS, formatDateTime, currencyFormatter } from './analystUtils';
import '../Dashboard.css';

const isSameDate = (leftDate, rightDate) =>
  leftDate.getFullYear() === rightDate.getFullYear() &&
  leftDate.getMonth() === rightDate.getMonth() &&
  leftDate.getDate() === rightDate.getDate();

const AnalystAlerts = () => {
  const { alerts } = useAnalystContext();

  const [alertFilters, setAlertFilters] = useState({
    riskMin: 0,
    riskMax: 100,
    alertType: 'All',
    minAmount: '',
    maxAmount: '',
    clusterMin: '',
    clusterMax: '',
    sharedDeviceFlag: 'All',
    geoRisk: 'All',
    status: 'All',
    dateWindow: 'All'
  });

  const filteredAlerts = useMemo(() => {
    const now = new Date();
    return alerts.filter((alert) => {
      if (alert.riskScore < Number(alertFilters.riskMin)) return false;
      if (alert.riskScore > Number(alertFilters.riskMax)) return false;
      if (alertFilters.alertType !== 'All' && alert.alertType !== alertFilters.alertType) return false;
      if (alertFilters.status !== 'All' && alert.status !== alertFilters.status) return false;
      if (alertFilters.geoRisk !== 'All' && alert.geoRisk !== alertFilters.geoRisk) return false;
      if (alertFilters.sharedDeviceFlag === 'Yes' && !alert.sharedDeviceFlag) return false;
      if (alertFilters.sharedDeviceFlag === 'No' && alert.sharedDeviceFlag) return false;
      if (alertFilters.minAmount && alert.amount < Number(alertFilters.minAmount)) return false;
      if (alertFilters.maxAmount && alert.amount > Number(alertFilters.maxAmount)) return false;
      if (alertFilters.clusterMin && alert.clusterSize < Number(alertFilters.clusterMin)) return false;
      if (alertFilters.clusterMax && alert.clusterSize > Number(alertFilters.clusterMax)) return false;

      if (alertFilters.dateWindow === 'Today' && !isSameDate(alert.createdAt, now)) return false;
      if (alertFilters.dateWindow === 'Last 7 Days') {
        const ageHours = (now.getTime() - alert.createdAt.getTime()) / (1000 * 60 * 60);
        if (ageHours > 24 * 7) return false;
      }
      if (alertFilters.dateWindow === 'Last 30 Days') {
        const ageHours = (now.getTime() - alert.createdAt.getTime()) / (1000 * 60 * 60);
        if (ageHours > 24 * 30) return false;
      }
      return true;
    });
  }, [alerts, alertFilters]);

  return (
    <section className="analyst-section">
      <div className="section-heading">
        <h2>Alerts</h2>
        <p>Main operational queue with advanced risk filters and prioritization logic.</p>
      </div>
      <div className="section-layout">
        <aside className="analyst-card filter-panel">
          <h3>Advanced Filters</h3>

          <label>
            Risk Score Range
            <div className="inline-field">
              <input
                type="number"
                min="0"
                max="100"
                value={alertFilters.riskMin}
                onChange={(event) =>
                  setAlertFilters((previous) => ({ ...previous, riskMin: Math.min(Number(event.target.value), previous.riskMax) }))
                }
              />
              <input
                type="number"
                min="0"
                max="100"
                value={alertFilters.riskMax}
                onChange={(event) =>
                  setAlertFilters((previous) => ({ ...previous, riskMax: Math.max(Number(event.target.value), previous.riskMin) }))
                }
              />
            </div>
          </label>

          <label>
            Alert Type
            <select
              value={alertFilters.alertType}
              onChange={(event) => setAlertFilters((previous) => ({ ...previous, alertType: event.target.value }))}
            >
              <option value="All">All</option>
              {ALERT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label>
            Transaction Amount
            <div className="inline-field">
              <input
                type="number"
                placeholder="Min"
                value={alertFilters.minAmount}
                onChange={(event) => setAlertFilters((previous) => ({ ...previous, minAmount: event.target.value }))}
              />
              <input
                type="number"
                placeholder="Max"
                value={alertFilters.maxAmount}
                onChange={(event) => setAlertFilters((previous) => ({ ...previous, maxAmount: event.target.value }))}
              />
            </div>
          </label>

          <label>
            Cluster Size
            <div className="inline-field">
              <input
                type="number"
                placeholder="Min"
                value={alertFilters.clusterMin}
                onChange={(event) => setAlertFilters((previous) => ({ ...previous, clusterMin: event.target.value }))}
              />
              <input
                type="number"
                placeholder="Max"
                value={alertFilters.clusterMax}
                onChange={(event) => setAlertFilters((previous) => ({ ...previous, clusterMax: event.target.value }))}
              />
            </div>
          </label>

          <label>
            Shared Device Flag
            <select
              value={alertFilters.sharedDeviceFlag}
              onChange={(event) => setAlertFilters((previous) => ({ ...previous, sharedDeviceFlag: event.target.value }))}
            >
              <option value="All">All</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>

          <label>
            Geo Risk
            <select
              value={alertFilters.geoRisk}
              onChange={(event) => setAlertFilters((previous) => ({ ...previous, geoRisk: event.target.value }))}
            >
              <option value="All">All</option>
              {GEO_RISK_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>

          <label>
            Date Range
            <select
              value={alertFilters.dateWindow}
              onChange={(event) => setAlertFilters((previous) => ({ ...previous, dateWindow: event.target.value }))}
            >
              <option value="All">All</option>
              <option value="Today">Today</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
          </label>

          <label>
            Status
            <select
              value={alertFilters.status}
              onChange={(event) => setAlertFilters((previous) => ({ ...previous, status: event.target.value }))}
            >
              <option value="All">All</option>
              {ALERT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </aside>

        <article className="analyst-card table-card">
          <div className="card-headline">
            <h3>Alert Queue</h3>
            <span>{filteredAlerts.length} records</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Alert ID</th>
                  <th>Account ID</th>
                  <th>Risk Score</th>
                  <th>Alert Type</th>
                  <th>Cluster ID</th>
                  <th>Triggered Rule</th>
                  <th>Amount</th>
                  <th>Created Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr key={alert.alertId}>
                    <td>{alert.alertId}</td>
                    <td>{alert.accountId}</td>
                    <td>{alert.riskScore}</td>
                    <td>{alert.alertType}</td>
                    <td>{alert.clusterId}</td>
                    <td>{alert.triggeredRule}</td>
                    <td>{currencyFormatter.format(alert.amount)}</td>
                    <td>{formatDateTime(alert.createdAt)}</td>
                    <td>{alert.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
};

export default AnalystAlerts;
