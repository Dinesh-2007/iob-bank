import { useMemo } from 'react';
import { useAnalystContext } from './AnalystShell';
import { formatDateTime, currencyFormatter } from './analystUtils';
import '../Dashboard.css';

const isSameDate = (leftDate, rightDate) =>
  leftDate.getFullYear() === rightDate.getFullYear() &&
  leftDate.getMonth() === rightDate.getMonth() &&
  leftDate.getDate() === rightDate.getDate();

const AnalystDashboard = () => {
  const { alerts, investigations, accounts, clusters, transactions, effectiveDistrict, selectedState } =
    useAnalystContext();

  const myWorkSummary = useMemo(() => {
    const now = new Date();
    const openCases = investigations.filter((investigation) => investigation.status !== 'Closed').length;
    const highPriority = investigations.filter(
      (investigation) => investigation.riskScore >= 82 && investigation.status !== 'Closed'
    ).length;
    const dueToday = investigations.filter(
      (investigation) => investigation.status !== 'Closed' && isSameDate(investigation.dueAt, now)
    ).length;
    const slaRisk = investigations.filter(
      (investigation) => investigation.status !== 'Closed' && investigation.slaHoursRemaining <= 8
    ).length;
    const closedCases = investigations.filter((investigation) => investigation.status === 'Closed');
    const avgClosure = closedCases.length
      ? (
          closedCases.reduce((sum, investigation) => sum + investigation.closureHours, 0) / closedCases.length
        ).toFixed(1)
      : '0.0';

    return [
      { label: 'My Open Cases', value: openCases },
      { label: 'High Priority Assigned', value: highPriority },
      { label: 'Cases Due Today', value: dueToday },
      { label: 'SLA Breach Risk', value: slaRisk },
      { label: 'Avg Closure Time (Hrs)', value: avgClosure }
    ];
  }, [investigations]);

  const alertActivityTrend = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 7 }, (_, offset) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - offset));
      const dailyAlerts = alerts.filter((alert) => isSameDate(alert.createdAt, date));
      const escalations = dailyAlerts.filter((alert) => alert.status === 'Escalated').length;
      const strFiled = investigations.filter(
        (investigation) => investigation.status === 'STR Filed' && isSameDate(investigation.openedAt, date)
      ).length;

      return {
        label: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        alerts: dailyAlerts.length,
        escalations,
        strFiled
      };
    });
  }, [alerts, investigations]);

  const riskComposition = useMemo(() => {
    const deviceRaw =
      accounts.filter((account) => account.riskIndicators.deviceSharing || account.riskIndicators.geoMismatch).length + 1;
    const transactionRaw =
      transactions.filter((transaction) => transaction.patternTag === 'Rapid In-Out' || transaction.patternTag === 'Smurfing')
        .length + 1;
    const networkRaw =
      clusters.filter((cluster) => cluster.avgRisk >= 75 || cluster.sharedDeviceCount > 2).length + 1;
    const behaviorRaw =
      accounts.filter((account) => account.riskIndicators.rapidMovement || account.riskIndicators.structuringPattern).length + 1;
    const total = deviceRaw + transactionRaw + networkRaw + behaviorRaw;
    const device = Math.round((deviceRaw / total) * 100);
    const transaction = Math.round((transactionRaw / total) * 100);
    const network = Math.round((networkRaw / total) * 100);
    const behavior = Math.max(0, 100 - (device + transaction + network));

    return [
      { label: 'Device Risk', value: device, color: '#d3564d' },
      { label: 'Transaction Risk', value: transaction, color: '#2f7fd8' },
      { label: 'Network Risk', value: network, color: '#c79627' },
      { label: 'Behavioral Risk', value: behavior, color: '#2c9c7b' }
    ];
  }, [accounts, clusters, transactions]);

  const riskCompositionGradient = useMemo(() => {
    let pointer = 0;
    const segments = riskComposition.map((item) => {
      const start = pointer;
      const end = pointer + item.value;
      pointer = end;
      return `${item.color} ${start}% ${end}%`;
    });
    return `conic-gradient(${segments.join(', ')})`;
  }, [riskComposition]);

  return (
    <section className="analyst-section">
      <div className="section-heading">
        <h2>Dashboard Overview</h2>
        <p>Personal work summary and live alert intelligence for {effectiveDistrict}, {selectedState}.</p>
      </div>

      <div className="metric-grid">
        {myWorkSummary.map((item) => (
          <article key={item.label} className="analyst-card metric-card">
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>

      <div className="split-grid">
        <article className="analyst-card">
          <div className="card-headline">
            <h3>Alert Activity Trend</h3>
            <span>Last 7 Days</span>
          </div>
          <div className="trend-grid">
            {alertActivityTrend.map((point) => (
              <div key={point.label} className="trend-col">
                <p className="trend-day">{point.label}</p>
                <div className="trend-values">
                  <span>A {point.alerts}</span>
                  <span>E {point.escalations}</span>
                  <span>STR {point.strFiled}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="analyst-card">
          <div className="card-headline">
            <h3>Risk Composition</h3>
            <span>Component Breakdown</span>
          </div>
          <div className="composition-wrap">
            <div className="composition-donut" style={{ background: riskCompositionGradient }}>
              <div className="composition-center">{riskComposition.reduce((sum, item) => sum + item.value, 0)}%</div>
            </div>
            <ul className="composition-list">
              {riskComposition.map((item) => (
                <li key={item.label}>
                  <span className="dot" style={{ backgroundColor: item.color }} />
                  <p>{item.label}</p>
                  <strong>{item.value}%</strong>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
};

export default AnalystDashboard;
