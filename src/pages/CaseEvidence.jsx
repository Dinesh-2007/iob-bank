import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { currencyFormatter, formatDateTime, getCaseById } from '../utils/dataGenerator';
import { buildEvidenceAnalytics } from './evidence/evidenceData';
import { AnomalyDot, DirectedFlowGraph, ForceDirectedGraph } from './evidence/EvidenceGraphs';
import {
  ALERT_SEVERITY_COLORS,
  PIE_COLORS,
  RISK_COLORS,
  SECTION_LINKS,
  formatCurrencyTick,
  toCssSlug
} from './evidence/evidenceUtils';
import './Dashboard.css';
import './CaseEvidence.css';

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'accounts', label: 'Accounts' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'network', label: 'Network Analysis' },
  { id: 'investigations', label: 'Investigations' },
  { id: 'reports', label: 'Reports' }
];

const CaseEvidence = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const [searchParams] = useSearchParams();
  const [alertSort, setAlertSort] = useState({ key: 'riskScore', direction: 'desc' });

  const state = searchParams.get('state') || 'Tamil Nadu';
  const district = searchParams.get('district') || 'Chennai';
  const range = searchParams.get('range') || '30d';

  const caseData = useMemo(() => {
    if (!caseId) return null;
    return getCaseById(caseId, state, district, range);
  }, [caseId, district, range, state]);

  const analytics = useMemo(() => {
    if (!caseData) return null;
    return buildEvidenceAnalytics(caseData, state, district, range);
  }, [caseData, district, range, state]);

  const sortedAlertRows = useMemo(() => {
    if (!analytics) return [];

    const rows = [...analytics.alerts.rows];
    const { key, direction } = alertSort;

    rows.sort((left, right) => {
      const leftValue = left[key];
      const rightValue = right[key];

      if (leftValue instanceof Date && rightValue instanceof Date) {
        return direction === 'asc' ? leftValue - rightValue : rightValue - leftValue;
      }

      if (typeof leftValue === 'number' && typeof rightValue === 'number') {
        return direction === 'asc' ? leftValue - rightValue : rightValue - leftValue;
      }

      return direction === 'asc'
        ? String(leftValue).localeCompare(String(rightValue))
        : String(rightValue).localeCompare(String(leftValue));
    });

    return rows;
  }, [alertSort, analytics]);

  const topFlowRoutes = useMemo(() => {
    if (!analytics) return [];
    return [...analytics.flow.links]
      .sort((left, right) => right.amount - left.amount)
      .slice(0, 6);
  }, [analytics]);

  const handleAlertSort = (key) => {
    setAlertSort((previous) => ({
      key,
      direction: previous.key === key && previous.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getSortLabel = (key) => {
    if (alertSort.key !== key) return '';
    return alertSort.direction === 'desc' ? ' (desc)' : ' (asc)';
  };

  const handleLogout = () => navigate('/');

  if (!caseData || !analytics) {
    return (
      <div className="analyst-dashboard">
        <div className="error-message">Case not found</div>
      </div>
    );
  }

  return (
    <div className="analyst-dashboard">
      <header className="analyst-topbar">
        <div>
          <h1>AML Analyst Command Center</h1>
          <p>Case Evidence Intelligence and Investigation Workflow</p>
        </div>
        <button type="button" onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="analyst-shell">
        <aside className="analyst-sidebar">
          <h2>Analyst Views</h2>
          <nav>
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id === 'investigations' ? 'active' : ''}
                onClick={() => navigate(`/dashboard/analyst/${item.id}`)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="analyst-content">
          <section className="analyst-card evidence-hero">
            <div className="card-headline">
              <div>
                <button type="button" className="back-btn-inline" onClick={() => navigate('/dashboard/analyst/investigations')}>
                  Back to Investigations
                </button>
                <h3>Case Evidence Intelligence</h3>
                <p className="evidence-subtitle">
                  Professional visualization suite for relationship analysis, behavioral anomalies, risk scoring, and workflow tracking.
                </p>
              </div>
              <span>{caseData.caseId}</span>
            </div>

            <div className="case-meta-inline">
              <span className="meta-item">
                <strong>State:</strong> {state}
              </span>
              <span className="meta-item">
                <strong>District:</strong> {district}
              </span>
              <span className="meta-item">
                <strong>Window:</strong> {range}
              </span>
              <span className="meta-item">
                <strong>Risk Score:</strong> {caseData.riskScore}
              </span>
              <span className="meta-item">
                <strong>Risk Class:</strong>{' '}
                <span className={`risk-pill risk-${toCssSlug(analytics.risk.classification)}`}>{analytics.risk.classification}</span>
              </span>
              <span className="meta-item">
                <strong>Status:</strong> {caseData.status}
              </span>
              <span className="meta-item">
                <strong>SLA:</strong> {caseData.slaHoursRemaining}h
              </span>
              <span className="meta-item">
                <strong>Cluster:</strong> {caseData.clusterId}
              </span>
            </div>

            <div className="evidence-kpi-grid">
              <article className="evidence-kpi">
                <p>Total Network Flow</p>
                <strong>{currencyFormatter.format(analytics.summary.totalNetworkFlow)}</strong>
              </article>
              <article className="evidence-kpi">
                <p>Anomalous Spikes</p>
                <strong>{analytics.summary.anomalyCount}</strong>
              </article>
              <article className="evidence-kpi">
                <p>High Priority Alerts</p>
                <strong>{analytics.summary.highPriorityAlerts}</strong>
              </article>
              <article className="evidence-kpi">
                <p>Shared Devices</p>
                <strong>{analytics.summary.sharedDevices}</strong>
              </article>
            </div>

            <nav className="evidence-nav">
              {SECTION_LINKS.map((section) => (
                <a key={section.id} href={`#${section.id}`}>
                  {section.label}
                </a>
              ))}
            </nav>
          </section>

          <section id="relationship" className="analyst-card evidence-panel">
            <div className="section-heading">
              <h2>1) Graph-Based Relationship Analysis</h2>
              <p>Account-to-account transaction network with suspicious clusters, circular movement, and centrality indicators.</p>
            </div>

            <div className="viz-grid two-col">
              <article className="viz-card">
                <div className="card-headline">
                  <h3>Force-Directed Transaction Network</h3>
                  <span>
                    {analytics.relationship.nodes.length} nodes / {analytics.relationship.links.length} links
                  </span>
                </div>
                <ForceDirectedGraph nodes={analytics.relationship.nodes} links={analytics.relationship.links} height={360} />
                <div className="legend-row">
                  {Object.entries(RISK_COLORS).map(([band, color]) => (
                    <span key={band} className="legend-item">
                      <i className="legend-color" style={{ backgroundColor: color }} />
                      {band}
                    </span>
                  ))}
                </div>
              </article>

              <article className="viz-card">
                <h3>Cluster Intelligence</h3>
                <div className="insight-list">
                  <div className="insight-item">
                    <p>Suspicious links</p>
                    <strong>{analytics.relationship.suspiciousLinks}</strong>
                  </div>
                  <div className="insight-item">
                    <p>Circular routes</p>
                    <strong>{analytics.relationship.circularRoutes}</strong>
                  </div>
                  <div className="insight-item">
                    <p>Cluster accounts</p>
                    <strong>{analytics.relationship.nodes.filter((node) => node.kind !== 'external').length}</strong>
                  </div>
                </div>

                <h4>Highly Central Accounts</h4>
                <ul className="compact-list">
                  {analytics.relationship.highCentralityAccounts.map((account) => (
                    <li key={account.id}>
                      <span>{account.id}</span>
                      <strong>
                        C={account.centrality} / {account.riskBand}
                      </strong>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section id="behaviour" className="analyst-card evidence-panel">
            <div className="section-heading">
              <h2>2) Behavioural Profiling (Anomaly Detection)</h2>
              <p>Baseline versus observed transaction amounts with anomaly points highlighted in red.</p>
            </div>

            <div className="viz-grid two-col">
              <article className="viz-card">
                <div className="card-headline">
                  <h3>Time-Series Pattern</h3>
                  <span>{analytics.behaviour.series.length} days</span>
                </div>
                <div className="chart-frame">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.behaviour.series}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d9e5f0" />
                      <XAxis dataKey="label" minTickGap={24} />
                      <YAxis tickFormatter={formatCurrencyTick} />
                      <Tooltip formatter={(value) => currencyFormatter.format(Number(value))} />
                      <Legend />
                      <Line type="monotone" dataKey="baseline" stroke="#7e96ac" strokeDasharray="5 5" dot={false} name="Baseline" />
                      <Line type="monotone" dataKey="amount" stroke="#2f6fa3" dot={<AnomalyDot />} activeDot={{ r: 6 }} strokeWidth={2.3} name="Observed" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="viz-card">
                <h3>Anomaly Watchlist</h3>
                <p className="anomaly-count">{analytics.behaviour.anomalyCount} abnormal spikes detected from baseline behavior.</p>
                <ul className="compact-list">
                  {analytics.behaviour.spikes.map((spike) => (
                    <li key={`${spike.label}-${spike.index}`}>
                      <span>{spike.label}</span>
                      <strong>{currencyFormatter.format(spike.amount)}</strong>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section id="flow" className="analyst-card evidence-panel">
            <div className="section-heading">
              <h2>3) Transaction Network Flow Analysis</h2>
              <p>Directed graph showing source-to-mule-to-layer-to-exit flows with thickness based on transfer volume.</p>
            </div>

            <div className="viz-grid two-col">
              <article className="viz-card">
                <div className="card-headline">
                  <h3>Directed Money Flow</h3>
                  <span>{analytics.flow.links.length} routed transfers</span>
                </div>
                <DirectedFlowGraph nodes={analytics.flow.nodes} links={analytics.flow.links} height={350} />
              </article>

              <article className="viz-card">
                <h3>Flow Pattern Summary</h3>
                <div className="insight-list">
                  <div className="insight-item">
                    <p>Many-to-one transfers</p>
                    <strong>{analytics.flow.manyToOneTransfers}</strong>
                  </div>
                  <div className="insight-item">
                    <p>Layered hand-offs</p>
                    <strong>{analytics.flow.layeredTransfers}</strong>
                  </div>
                  <div className="insight-item">
                    <p>Circular movement routes</p>
                    <strong>{analytics.relationship.circularRoutes}</strong>
                  </div>
                </div>

                <h4>Top Flow Corridors</h4>
                <ul className="compact-list">
                  {topFlowRoutes.map((route, index) => (
                    <li key={`${route.source}-${route.target}-${index}`}>
                      <span>
                        {route.source} {'->'} {route.target}
                      </span>
                      <strong>{currencyFormatter.format(route.amount)}</strong>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section id="risk" className="analyst-card evidence-panel">
            <div className="section-heading">
              <h2>4) Risk Scoring Model</h2>
              <p>Overall risk severity gauge with factor-level decomposition across ML, network, device, and rules.</p>
            </div>

            <div className="viz-grid two-col">
              <article className="viz-card">
                <h3>Overall Risk Gauge</h3>
                <div className="gauge-wrap">
                  <ResponsiveContainer width="100%" height={240}>
                    <RadialBarChart
                      data={[{ name: 'Risk', value: caseData.riskScore, fill: RISK_COLORS[analytics.risk.classification] }]}
                      innerRadius="58%"
                      outerRadius="96%"
                      startAngle={180}
                      endAngle={0}
                    >
                      <RadialBar dataKey="value" cornerRadius={10} background />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="gauge-center">
                    <strong>{caseData.riskScore}</strong>
                    <span>{analytics.risk.classification}</span>
                  </div>
                </div>
              </article>

              <article className="viz-card">
                <h3>Risk Contribution Breakdown</h3>
                <div className="chart-frame">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analytics.risk.stacked} layout="vertical" margin={{ top: 10, right: 24, bottom: 10, left: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d9e5f0" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis type="category" dataKey="name" hide />
                      <Tooltip formatter={(value) => `${value} pts`} />
                      <Legend />
                      <Bar dataKey="ML" stackId="risk" fill="#2f7ec0" />
                      <Bar dataKey="Network" stackId="risk" fill="#447eb2" />
                      <Bar dataKey="Device" stackId="risk" fill="#5f93b8" />
                      <Bar dataKey="Rule" stackId="risk" fill="#89a8bf" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <ul className="compact-list">
                  {analytics.risk.breakdown.map((factor) => (
                    <li key={factor.factor}>
                      <span>{factor.factor}</span>
                      <strong>{factor.value}</strong>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section id="red-flags" className="analyst-card evidence-panel">
            <div className="section-heading">
              <h2>5) Red-Flag Indicators</h2>
              <p>Frequency and distribution of triggered AML red-flag patterns for this investigation scope.</p>
            </div>

            <div className="viz-grid two-col">
              <article className="viz-card">
                <h3>Red-Flag Frequency</h3>
                <div className="chart-frame">
                  <ResponsiveContainer width="100%" height={290}>
                    <BarChart data={analytics.redFlags.frequency}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d9e5f0" />
                      <XAxis dataKey="type" interval={0} angle={-18} textAnchor="end" height={72} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {analytics.redFlags.frequency.map((entry, index) => (
                          <Cell key={`${entry.type}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="viz-card">
                <h3>Red-Flag Distribution</h3>
                <div className="chart-frame">
                  <ResponsiveContainer width="100%" height={290}>
                    <PieChart>
                      <Pie
                        data={analytics.redFlags.distribution}
                        dataKey="count"
                        nameKey="type"
                        innerRadius={54}
                        outerRadius={92}
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {analytics.redFlags.distribution.map((entry, index) => (
                          <Cell key={`${entry.type}-pie-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, _, meta) => [`${value} (${meta?.payload?.share}%)`, 'Triggers']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </article>
            </div>
          </section>

          <section id="devices" className="analyst-card evidence-panel">
            <div className="section-heading">
              <h2>6) Device Usage Analysis</h2>
              <p>Device-to-account mapping for shared access detection, IP-style clustering, and switching patterns.</p>
            </div>

            <div className="viz-grid two-col">
              <article className="viz-card">
                <div className="card-headline">
                  <h3>Device <span className="mono-arrow">{'<->'}</span> Account Graph</h3>
                  <span>{analytics.devices.nodes.filter((node) => node.kind === 'device').length} devices</span>
                </div>
                <ForceDirectedGraph nodes={analytics.devices.nodes} links={analytics.devices.links} height={340} />
              </article>

              <article className="viz-card">
                <h3>Accounts per Device</h3>
                <div className="chart-frame">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.devices.perDevice} margin={{ top: 10, right: 12, bottom: 60, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d9e5f0" />
                      <XAxis dataKey="deviceId" angle={-20} textAnchor="end" interval={0} height={72} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="accounts" fill="#2f6fa3" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="support-text">{analytics.devices.sharedDevices} devices are shared by multiple accounts.</p>
              </article>
            </div>
          </section>

          <section id="alerts" className="analyst-card evidence-panel">
            <div className="section-heading">
              <h2>7) Alert Prioritisation</h2>
              <p>Severity distribution and investigator table sorted by risk for action-ready prioritization.</p>
            </div>

            <div className="viz-grid two-col">
              <article className="viz-card">
                <h3>Severity Distribution</h3>
                <div className="chart-frame">
                  <ResponsiveContainer width="100%" height={270}>
                    <BarChart data={analytics.alerts.severityDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d9e5f0" />
                      <XAxis dataKey="severity" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {analytics.alerts.severityDistribution.map((entry) => (
                          <Cell key={entry.severity} fill={ALERT_SEVERITY_COLORS[entry.severity]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="viz-card">
                <h3>Priority Snapshot</h3>
                <div className="insight-list">
                  <div className="insight-item">
                    <p>Total alerts</p>
                    <strong>{analytics.alerts.rows.length}</strong>
                  </div>
                  <div className="insight-item">
                    <p>High severity</p>
                    <strong>{analytics.alerts.severityDistribution.find((row) => row.severity === 'High')?.count || 0}</strong>
                  </div>
                  <div className="insight-item">
                    <p>Medium severity</p>
                    <strong>{analytics.alerts.severityDistribution.find((row) => row.severity === 'Medium')?.count || 0}</strong>
                  </div>
                  <div className="insight-item">
                    <p>Low severity</p>
                    <strong>{analytics.alerts.severityDistribution.find((row) => row.severity === 'Low')?.count || 0}</strong>
                  </div>
                </div>
              </article>
            </div>

            <article className="viz-card">
              <div className="card-headline">
                <h3>Risk-Ordered Alert Queue</h3>
                <span>{sortedAlertRows.length} alerts</span>
              </div>
              <div className="table-wrap evidence-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>
                        <button type="button" className="sort-header-btn" onClick={() => handleAlertSort('alertId')}>
                          Alert ID{getSortLabel('alertId')}
                        </button>
                      </th>
                      <th>
                        <button type="button" className="sort-header-btn" onClick={() => handleAlertSort('riskScore')}>
                          Risk Score{getSortLabel('riskScore')}
                        </button>
                      </th>
                      <th>Severity</th>
                      <th>Red Flag Type</th>
                      <th>Account</th>
                      <th>
                        <button type="button" className="sort-header-btn" onClick={() => handleAlertSort('amount')}>
                          Amount{getSortLabel('amount')}
                        </button>
                      </th>
                      <th>Status</th>
                      <th>
                        <button type="button" className="sort-header-btn" onClick={() => handleAlertSort('createdAt')}>
                          Created At{getSortLabel('createdAt')}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAlertRows.map((alert) => (
                      <tr key={alert.alertId}>
                        <td>{alert.alertId}</td>
                        <td>{alert.riskScore}</td>
                        <td>
                          <span className={`badge badge-${toCssSlug(alert.severity)}`}>{alert.severity}</span>
                        </td>
                        <td>{alert.flagType}</td>
                        <td>{alert.accountId}</td>
                        <td>{currencyFormatter.format(alert.amount)}</td>
                        <td>
                          <span className={`status-chip status-${toCssSlug(alert.workflowStatus)}`}>{alert.workflowStatus}</span>
                        </td>
                        <td>{formatDateTime(alert.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </section>

          <section id="workflow" className="analyst-card evidence-panel">
            <div className="section-heading">
              <h2>8) Investigation Workflow</h2>
              <p>Kanban case progression with action timeline for governance trail and review readiness.</p>
            </div>

            <div className="workflow-layout">
              <div className="kanban-grid">
                {analytics.workflow.columns.map((column) => (
                  <article key={column.status} className="kanban-column">
                    <div className="kanban-head">
                      <h3>{column.status}</h3>
                      <span>{column.items.length}</span>
                    </div>
                    {column.items.map((item) => (
                      <div key={`${column.status}-${item.alertId}`} className="kanban-card">
                        <strong>{item.alertId}</strong>
                        <p>{item.flagType}</p>
                        <small>Risk {item.riskScore}</small>
                      </div>
                    ))}
                  </article>
                ))}
              </div>

              <article className="timeline-rail">
                <div className="card-headline">
                  <h3>Action History</h3>
                  <span>{analytics.workflow.timeline.length} actions</span>
                </div>
                <ul>
                  {analytics.workflow.timeline.map((event, index) => (
                    <li key={`${event.action}-${event.at.toISOString()}-${index}`}>
                      <div className="timeline-meta">
                        <span>{formatDateTime(event.at)}</span>
                        <span>
                          {event.actor} / {event.channel}
                        </span>
                      </div>
                      <p className="timeline-action">{event.action}</p>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section className="analyst-card evidence-note">
            <div className="card-headline">
              <h3>Case Notes</h3>
              <span>{caseData.caseId}</span>
            </div>
            <p>{caseData.evidence.notes}</p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CaseEvidence;
