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
import { PIE_COLORS, RISK_COLORS, SECTION_LINKS, formatCurrencyTick, toCssSlug } from './evidence/evidenceUtils';
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
  const [txnTimeFilter, setTxnTimeFilter] = useState('30d');
  const [txnViewMode, setTxnViewMode] = useState('volume');
  const [txnRiskFilter, setTxnRiskFilter] = useState('all');
  const [relationshipFilters, setRelationshipFilters] = useState({
    accountId: '',
    riskBand: 'All',
    timeRange: 'All',
    minDegree: 0,
    clusterId: '',
    amountMin: '',
    amountMax: '',
    highCentralityOnly: false,
    circularOnly: false,
    depth: 'all',
    linkedDeviceOnly: false,
    highlightSuspicious: false
  });
  const [behaviourFilters, setBehaviourFilters] = useState({
    dateRange: '30d',
    timeWindow: 'all',
    freqMin: 0,
    amountDeviation: 0,
    anomalyMin: 0,
    dormantToggle: 'all',
    anomaliesOnly: false,
    riskThreshold: 0
  });
  const [flowFilters, setFlowFilters] = useState({
    minAmount: 0,
    maxAmount: '',
    direction: 'All',
    flowPattern: 'All',
    layerDepth: '3',
    velocityMin: 0,
    rapidFlipOnly: false
  });
  const [riskFilters, setRiskFilters] = useState({
    riskMin: 0,
    riskMax: 100,
    mlMin: 0,
    networkMin: 0,
    deviceMin: 0,
    category: 'All',
    watchlistOnly: false,
    timeFilter: 'all'
  });
  const [redFlagFilters, setRedFlagFilters] = useState({
    flagType: 'All',
    minCount: 0,
    multiFlagOnly: false,
    timeRange: '30d'
  });
  const [deviceFilters, setDeviceFilters] = useState({
    deviceId: '',
    ip: '',
    geo: '',
    minAccounts: 0,
    sharedOnly: false,
    highRiskOnly: false,
    crossBorderOnly: false,
    recentMinutes: 0
  });

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

  const filteredRelationship = useMemo(() => {
    if (!analytics) return { nodes: [], links: [] };

    const circularPairs = new Set();
    analytics.relationship.links.forEach((link) => {
      const reverse = `${link.target}->${link.source}`;
      const key = `${link.source}->${link.target}`;
      if (analytics.relationship.links.find((candidate) => `${candidate.source}->${candidate.target}` === reverse)) {
        circularPairs.add(key);
        circularPairs.add(reverse);
      }
    });

    let nodes = analytics.relationship.nodes;
    let links = analytics.relationship.links;

    if (relationshipFilters.riskBand !== 'All') {
      nodes = nodes.filter((node) => node.riskBand === relationshipFilters.riskBand);
    }

    if (relationshipFilters.accountId.trim()) {
      const q = relationshipFilters.accountId.trim().toLowerCase();
      nodes = nodes.filter((node) => node.id.toLowerCase().includes(q));
    }

    if (relationshipFilters.clusterId.trim()) {
      const q = relationshipFilters.clusterId.trim().toLowerCase();
      nodes = nodes.filter((node) => node.id.toLowerCase().includes(q));
    }

    if (relationshipFilters.highCentralityOnly) {
      const threshold = Math.max(4, Math.round(nodes.reduce((m, n) => Math.max(m, n.centrality), 0) * 0.6));
      nodes = nodes.filter((node) => node.centrality >= threshold);
    }

    if (relationshipFilters.minDegree > 0) {
      nodes = nodes.filter((node) => node.centrality >= relationshipFilters.minDegree);
    }

    if (relationshipFilters.amountMin) {
      links = links.filter((link) => link.amount >= Number(relationshipFilters.amountMin));
    }
    if (relationshipFilters.amountMax) {
      links = links.filter((link) => link.amount <= Number(relationshipFilters.amountMax));
    }

    if (relationshipFilters.circularOnly) {
      links = links.filter((link) => circularPairs.has(`${link.source}->${link.target}`));
      const circularNodeIds = new Set();
      links.forEach((link) => {
        circularNodeIds.add(link.source);
        circularNodeIds.add(link.target);
      });
      nodes = nodes.filter((node) => circularNodeIds.has(node.id));
    }

    const nodeIds = new Set(nodes.map((node) => node.id));
    links = links.filter((link) => nodeIds.has(link.source) && nodeIds.has(link.target));

    return { nodes, links };
  }, [analytics, relationshipFilters]);

  const behaviourSeriesFiltered = useMemo(() => {
    if (!analytics) return [];
    let series = analytics.behaviour.series;

    if (behaviourFilters.dateRange === '7d') {
      series = series.slice(-7);
    } else if (behaviourFilters.dateRange === '30d') {
      series = series.slice(-30);
    }

    if (behaviourFilters.anomaliesOnly) {
      series = series.filter((point) => point.isAnomaly);
    }

    if (behaviourFilters.amountDeviation > 0 || behaviourFilters.anomalyMin > 0) {
      series = series.filter((point) => {
        const deviation = Math.abs(point.amount - point.baseline) / Math.max(1, point.baseline) * 100;
        return (
          deviation >= behaviourFilters.amountDeviation &&
          (!behaviourFilters.anomalyMin || deviation >= behaviourFilters.anomalyMin || point.isAnomaly)
        );
      });
    }

    if (behaviourFilters.freqMin > 0) {
      series = series.filter((point) => point.amount >= behaviourFilters.freqMin);
    }

    if (behaviourFilters.riskThreshold > 0) {
      series = series.filter((point) => point.amount >= behaviourFilters.riskThreshold);
    }

    if (behaviourFilters.timeWindow !== 'all') {
      series = series.filter((point) => {
        const hour = point.date.getHours();
        if (behaviourFilters.timeWindow === 'night') return hour >= 0 && hour < 6;
        if (behaviourFilters.timeWindow === 'morning') return hour >= 6 && hour < 12;
        if (behaviourFilters.timeWindow === 'afternoon') return hour >= 12 && hour < 18;
        return hour >= 18;
      });
    }

    return series;
  }, [analytics, behaviourFilters]);

  const flowFiltered = useMemo(() => {
    if (!analytics) return { links: [], manyToOne: 0, layered: 0 };
    let links = analytics.flow.links;

    if (flowFilters.minAmount) {
      links = links.filter((link) => link.amount >= Number(flowFilters.minAmount));
    }
    if (flowFilters.maxAmount) {
      links = links.filter((link) => link.amount <= Number(flowFilters.maxAmount));
    }

    if (flowFilters.flowPattern !== 'All') {
      links = links.filter((link) => link.pattern === flowFilters.flowPattern);
    }

    if (flowFilters.rapidFlipOnly) {
      links = links.filter((link) => link.pattern === 'Circular Return');
    }

    if (flowFilters.direction === 'ManyToOne') {
      const targetCounts = links.reduce((map, link) => {
        map.set(link.target, (map.get(link.target) || 0) + 1);
        return map;
      }, new Map());
      links = links.filter((link) => (targetCounts.get(link.target) || 0) >= 2);
    } else if (flowFilters.direction === 'OneToMany') {
      const sourceCounts = links.reduce((map, link) => {
        map.set(link.source, (map.get(link.source) || 0) + 1);
        return map;
      }, new Map());
      links = links.filter((link) => (sourceCounts.get(link.source) || 0) >= 2);
    }

    const targetCounts = links.reduce((map, link) => {
      map.set(link.target, (map.get(link.target) || 0) + 1);
      return map;
    }, new Map());
    const manyToOne = Array.from(targetCounts.values()).filter((count) => count >= 2).length;
    const layered = links.filter((link) => link.pattern && link.pattern.toLowerCase().includes('layer')).length;

    return { links, manyToOne, layered };
  }, [analytics, flowFilters]);

  const riskVisible = useMemo(
    () => caseData && caseData.riskScore >= riskFilters.riskMin && caseData.riskScore <= riskFilters.riskMax,
    [caseData, riskFilters.riskMax, riskFilters.riskMin]
  );

  const filteredRiskBreakdown = useMemo(() => {
    if (!analytics) return [];
    return analytics.risk.breakdown.filter((row) => {
      if (row.key === 'ml' && row.value < riskFilters.mlMin) return false;
      if (row.key === 'network' && row.value < riskFilters.networkMin) return false;
      if (row.key === 'device' && row.value < riskFilters.deviceMin) return false;
      if (riskFilters.category !== 'All') {
        const band = analytics.risk.classification;
        if (band !== riskFilters.category) return false;
      }
      return true;
    });
  }, [analytics, riskFilters]);

  const redFlagFiltered = useMemo(() => {
    if (!analytics) return { frequency: [], distribution: [] };
    let freq = analytics.redFlags.frequency;
    if (redFlagFilters.flagType !== 'All') {
      freq = freq.filter((row) => row.type === redFlagFilters.flagType);
    }
    if (redFlagFilters.minCount) {
      freq = freq.filter((row) => row.count >= redFlagFilters.minCount);
    }
    if (redFlagFilters.multiFlagOnly) {
      freq = freq.filter((row) => row.count > 1);
    }
    const total = freq.reduce((sum, row) => sum + row.count, 0) || 1;
    const distribution = freq.map((row) => ({ ...row, share: Number(((row.count / total) * 100).toFixed(1)) }));
    return { frequency: freq, distribution };
  }, [analytics, redFlagFilters]);

  const deviceFiltered = useMemo(() => {
    if (!analytics) return { perDevice: [], nodes: [], links: [] };
    let perDevice = analytics.devices.perDevice;
    if (deviceFilters.deviceId.trim()) {
      const q = deviceFilters.deviceId.trim().toLowerCase();
      perDevice = perDevice.filter((row) => row.deviceId.toLowerCase().includes(q));
    }
    if (deviceFilters.minAccounts) {
      perDevice = perDevice.filter((row) => row.accounts >= Number(deviceFilters.minAccounts));
    }
    if (deviceFilters.sharedOnly) {
      perDevice = perDevice.filter((row) => row.accounts > 1);
    }

    const allowedDevices = new Set(perDevice.map((row) => row.deviceId));
    let nodes = analytics.devices.nodes.filter(
      (node) => node.kind !== 'device' || allowedDevices.has(node.id) || deviceFilters.deviceId.trim() === ''
    );
    if (deviceFilters.highRiskOnly) {
      nodes = nodes.filter((node) => node.kind !== 'device' || node.riskBand === 'High' || node.riskBand === 'Critical');
    }
    let links = analytics.devices.links.filter(
      (link) => allowedDevices.has(link.source) || allowedDevices.has(link.target) || deviceFilters.deviceId.trim() === ''
    );

    return { perDevice, nodes, links };
  }, [analytics, deviceFilters]);

  const transactionSeries = useMemo(() => {
    if (!analytics) return [];

    let series = analytics.transactionsBehaviour.series;

    if (txnTimeFilter === '24h') {
      series = series.slice(-Math.min(2, series.length));
    } else if (txnTimeFilter === '7d') {
      series = series.slice(-7);
    } else if (txnTimeFilter === '30d') {
      series = series.slice(-30);
    }

    if (txnRiskFilter === 'anomalies') {
      series = series.filter((point) => point.isAnomaly);
    } else if (txnRiskFilter === 'high') {
      series = series.filter((point) => point.riskBand === 'High');
    }

    return series;
  }, [analytics, txnRiskFilter, txnTimeFilter]);

  const topFlowRoutes = useMemo(() => {
    if (!analytics) return [];
    return [...analytics.flow.links]
      .sort((left, right) => right.amount - left.amount)
      .slice(0, 6);
  }, [analytics]);

  const pillStyle = (active) => ({
    padding: '6px 10px',
    borderRadius: '999px',
    border: `1px solid ${active ? '#1f3b56' : '#c8d6e4'}`,
    background: active ? '#1f3b56' : '#f6f9fc',
    color: active ? '#ffffff' : '#1f3a55',
    fontSize: '12px',
    cursor: 'pointer'
  });

  const getKpiTone = (value, type) => {
    if (type === 'score') return value >= 80 ? '#c0392b' : value >= 60 ? '#d9a33f' : '#2f7d58';
    if (type === 'ratio') return value > 1.4 ? '#c0392b' : value > 1.1 ? '#d9a33f' : '#2f7d58';
    if (type === 'time') return value > 36 ? '#c0392b' : value > 18 ? '#d9a33f' : '#2f7d58';
    return '#2f6fa3';
  };

  const TransactionDot = ({ cx, cy, payload }) => {
    const tone = payload.isAnomaly ? '#c0392b' : payload.riskBand === 'High' ? '#d9a33f' : '#2f7d58';
    return <circle cx={cx} cy={cy} r={payload.isAnomaly ? 6 : 4} fill={tone} stroke="#ffffff" strokeWidth={1.4} />;
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

            <div className="table-filters">
              <label>
                Account ID
                <input
                  type="text"
                  value={relationshipFilters.accountId}
                  onChange={(event) => setRelationshipFilters((prev) => ({ ...prev, accountId: event.target.value }))}
                  placeholder="Search account"
                />
              </label>
              <label>
                Risk Level
                <select
                  value={relationshipFilters.riskBand}
                  onChange={(event) => setRelationshipFilters((prev) => ({ ...prev, riskBand: event.target.value }))}
                >
                  <option value="All">All</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="Critical">Critical</option>
                </select>
              </label>
              <label>
                Time Range
                <select
                  value={relationshipFilters.timeRange}
                  onChange={(event) => setRelationshipFilters((prev) => ({ ...prev, timeRange: event.target.value }))}
                >
                  <option value="All">All</option>
                  <option value="24h">Last 24h</option>
                  <option value="7d">Last 7d</option>
                  <option value="30d">Last 30d</option>
                  <option value="custom">Custom</option>
                </select>
              </label>
              <label>
                Amount Range
                <div className="inline-field">
                  <input
                    type="number"
                    placeholder="Min"
                    value={relationshipFilters.amountMin}
                    onChange={(event) => setRelationshipFilters((prev) => ({ ...prev, amountMin: event.target.value }))}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={relationshipFilters.amountMax}
                    onChange={(event) => setRelationshipFilters((prev) => ({ ...prev, amountMax: event.target.value }))}
                  />
                </div>
              </label>
              <label>
                Min Connection Count
                <input
                  type="number"
                  min="0"
                  value={relationshipFilters.minDegree}
                  onChange={(event) => setRelationshipFilters((prev) => ({ ...prev, minDegree: Number(event.target.value || 0) }))}
                />
              </label>
              <label>
                Cluster ID
                <input
                  type="text"
                  value={relationshipFilters.clusterId}
                  onChange={(event) => setRelationshipFilters((prev) => ({ ...prev, clusterId: event.target.value }))}
                  placeholder="e.g., CL-TN-001"
                />
              </label>
              <label className="inline-checkbox">
                <input
                  type="checkbox"
                  checked={relationshipFilters.highCentralityOnly}
                  onChange={(event) => setRelationshipFilters((prev) => ({ ...prev, highCentralityOnly: event.target.checked }))}
                />
                Show Only High-Centrality Nodes
              </label>
              <label className="inline-checkbox">
                <input
                  type="checkbox"
                  checked={relationshipFilters.circularOnly}
                  onChange={(event) => setRelationshipFilters((prev) => ({ ...prev, circularOnly: event.target.checked }))}
                />
                Show Circular Flows Only
              </label>
              <label>
                Depth Level
                <select
                  value={relationshipFilters.depth}
                  onChange={(event) => setRelationshipFilters((prev) => ({ ...prev, depth: event.target.value }))}
                >
                  <option value="all">All</option>
                  <option value="1">1-hop</option>
                  <option value="2">2-hop</option>
                  <option value="3">3-hop</option>
                </select>
              </label>
              <label className="inline-checkbox">
                <input
                  type="checkbox"
                  checked={relationshipFilters.highlightSuspicious}
                  onChange={(event) => setRelationshipFilters((prev) => ({ ...prev, highlightSuspicious: event.target.checked }))}
                />
                Highlight suspicious nodes
              </label>
            </div>

            <div className="viz-grid two-col">
              <article className="viz-card">
                <div className="card-headline">
                  <h3>Force-Directed Transaction Network</h3>
                  <span>
                    {filteredRelationship.nodes.length} nodes / {filteredRelationship.links.length} links
                  </span>
                </div>
                <ForceDirectedGraph nodes={filteredRelationship.nodes} links={filteredRelationship.links} height={360} />
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
                    <strong>{filteredRelationship.nodes.filter((node) => node.kind !== 'external').length}</strong>
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

            <div className="table-filters">
              <label>
                Date Range
                <select
                  value={behaviourFilters.dateRange}
                  onChange={(event) => setBehaviourFilters((prev) => ({ ...prev, dateRange: event.target.value }))}
                >
                  <option value="7d">Last 7d</option>
                  <option value="30d">Last 30d</option>
                  <option value="90d">Last 90d</option>
                </select>
              </label>
              <label>
                Time of Day
                <select
                  value={behaviourFilters.timeWindow}
                  onChange={(event) => setBehaviourFilters((prev) => ({ ...prev, timeWindow: event.target.value }))}
                >
                  <option value="all">All</option>
                  <option value="night">12 AM–6 AM</option>
                  <option value="morning">6 AM–12 PM</option>
                  <option value="afternoon">12 PM–6 PM</option>
                  <option value="evening">6 PM–12 AM</option>
                </select>
              </label>
              <label>
                Transaction Frequency &gt;
                <input
                  type="number"
                  min="0"
                  value={behaviourFilters.freqMin}
                  onChange={(event) => setBehaviourFilters((prev) => ({ ...prev, freqMin: Number(event.target.value || 0) }))}
                  placeholder="Amount floor"
                />
              </label>
              <label>
                Amount Deviation %
                <input
                  type="number"
                  min="0"
                  value={behaviourFilters.amountDeviation}
                  onChange={(event) => setBehaviourFilters((prev) => ({ ...prev, amountDeviation: Number(event.target.value || 0) }))}
                />
              </label>
              <label>
                Anomaly Score Min (% dev)
                <input
                  type="number"
                  min="0"
                  value={behaviourFilters.anomalyMin}
                  onChange={(event) => setBehaviourFilters((prev) => ({ ...prev, anomalyMin: Number(event.target.value || 0) }))}
                />
              </label>
              <label className="inline-checkbox">
                <input
                  type="checkbox"
                  checked={behaviourFilters.anomaliesOnly}
                  onChange={(event) => setBehaviourFilters((prev) => ({ ...prev, anomaliesOnly: event.target.checked }))}
                />
                Show Only Anomalies
              </label>
              <label>
                Above Risk Score X (amount proxy)
                <input
                  type="number"
                  min="0"
                  value={behaviourFilters.riskThreshold}
                  onChange={(event) =>
                    setBehaviourFilters((prev) => ({ ...prev, riskThreshold: Number(event.target.value || 0) }))
                  }
                />
              </label>
            </div>

            <div className="viz-grid two-col">
              <article className="viz-card">
                <div className="card-headline">
                  <h3>Time-Series Pattern</h3>
                  <span>{behaviourSeriesFiltered.length} days</span>
                </div>
                <div className="chart-frame">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={behaviourSeriesFiltered}>
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

            <div className="table-filters">
              <label>
                Min Amount
                <input
                  type="number"
                  min="0"
                  value={flowFilters.minAmount}
                  onChange={(event) => setFlowFilters((prev) => ({ ...prev, minAmount: Number(event.target.value || 0) }))}
                />
              </label>
              <label>
                Max Amount
                <input
                  type="number"
                  min="0"
                  value={flowFilters.maxAmount}
                  onChange={(event) => setFlowFilters((prev) => ({ ...prev, maxAmount: event.target.value }))}
                />
              </label>
              <label>
                Direction
                <select
                  value={flowFilters.direction}
                  onChange={(event) => setFlowFilters((prev) => ({ ...prev, direction: event.target.value }))}
                >
                  <option value="All">All</option>
                  <option value="ManyToOne">Many-to-One Only</option>
                  <option value="OneToMany">One-to-Many Only</option>
                </select>
              </label>
              <label>
                Transaction Type / Pattern
                <select
                  value={flowFilters.flowPattern}
                  onChange={(event) => setFlowFilters((prev) => ({ ...prev, flowPattern: event.target.value }))}
                >
                  <option value="All">All</option>
                  <option value="Funnel Inflow">Funnel Inflow</option>
                  <option value="Layered Transfer">Layered Transfer</option>
                  <option value="Circular Return">Circular Pattern Only</option>
                  <option value="Outbound Dispersion">Outbound Dispersion</option>
                  <option value="Smurfing">Smurfing</option>
                </select>
              </label>
              <label>
                Layer Depth
                <select
                  value={flowFilters.layerDepth}
                  onChange={(event) => setFlowFilters((prev) => ({ ...prev, layerDepth: event.target.value }))}
                >
                  <option value="2">2-step</option>
                  <option value="3">3-step</option>
                </select>
              </label>
              <label>
                Velocity (txn/min) &gt;
                <input
                  type="number"
                  min="0"
                  value={flowFilters.velocityMin}
                  onChange={(event) => setFlowFilters((prev) => ({ ...prev, velocityMin: Number(event.target.value || 0) }))}
                />
              </label>
              <label className="inline-checkbox">
                <input
                  type="checkbox"
                  checked={flowFilters.rapidFlipOnly}
                  onChange={(event) => setFlowFilters((prev) => ({ ...prev, rapidFlipOnly: event.target.checked }))}
                />
                Rapid Credit → Debit Only
              </label>
            </div>

            <div className="viz-grid two-col">
              <article className="viz-card">
                <div className="card-headline">
                  <h3>Directed Money Flow</h3>
                  <span>{flowFiltered.links.length} routed transfers</span>
                </div>
                <DirectedFlowGraph nodes={analytics.flow.nodes} links={flowFiltered.links} height={350} />
              </article>

              <article className="viz-card">
                <h3>Flow Pattern Summary</h3>
                <div className="insight-list">
                  <div className="insight-item">
                    <p>Many-to-one transfers</p>
                    <strong>{flowFiltered.manyToOne || analytics.flow.manyToOneTransfers}</strong>
                  </div>
                  <div className="insight-item">
                    <p>Layered hand-offs</p>
                    <strong>{flowFiltered.layered || analytics.flow.layeredTransfers}</strong>
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

            <div className="table-filters">
              <label>
                Risk Score Range
                <div className="inline-field">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={riskFilters.riskMin}
                    onChange={(event) => setRiskFilters((prev) => ({ ...prev, riskMin: Number(event.target.value || 0) }))}
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={riskFilters.riskMax}
                    onChange={(event) => setRiskFilters((prev) => ({ ...prev, riskMax: Number(event.target.value || 100) }))}
                  />
                </div>
              </label>
              <label>
                ML Probability ≥
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={riskFilters.mlMin}
                  onChange={(event) => setRiskFilters((prev) => ({ ...prev, mlMin: Number(event.target.value || 0) }))}
                />
              </label>
              <label>
                Network Risk ≥
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={riskFilters.networkMin}
                  onChange={(event) => setRiskFilters((prev) => ({ ...prev, networkMin: Number(event.target.value || 0) }))}
                />
              </label>
              <label>
                Device Risk ≥
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={riskFilters.deviceMin}
                  onChange={(event) => setRiskFilters((prev) => ({ ...prev, deviceMin: Number(event.target.value || 0) }))}
                />
              </label>
              <label>
                Risk Category
                <select
                  value={riskFilters.category}
                  onChange={(event) => setRiskFilters((prev) => ({ ...prev, category: event.target.value }))}
                >
                  <option value="All">All</option>
                  <option value="Critical">High Risk Only</option>
                  <option value="High">Medium Risk Only</option>
                  <option value="Medium">Low Risk Only</option>
                </select>
              </label>
              <label>
                Time Filter
                <select
                  value={riskFilters.timeFilter}
                  onChange={(event) => setRiskFilters((prev) => ({ ...prev, timeFilter: event.target.value }))}
                >
                  <option value="all">All</option>
                  <option value="new">Newly Generated Alerts</option>
                  <option value="historical">Historical Cases</option>
                </select>
              </label>
            </div>

            <div className="viz-grid two-col">
              <article className="viz-card">
                <div className="card-headline">
                  <h3>Overall Risk Gauge</h3>
                  <span className={`risk-trend ${caseData.riskScore >= 80 ? 'trend-up' : caseData.riskScore >= 50 ? 'trend-stable' : 'trend-down'}`}>
                    {caseData.riskScore >= 80 ? '↑' : caseData.riskScore >= 50 ? '→' : '↓'}
                    {caseData.riskScore >= 80 ? '+12' : caseData.riskScore >= 50 ? '+3' : '-5'} pts
                  </span>
                </div>
                {riskVisible ? (
                  <>
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
                    
                    <div className="risk-gauge-metrics">
                      <div className="metric-item">
                        <span className="metric-label">Percentile</span>
                        <strong className="metric-value">{caseData.riskScore >= 90 ? '98th' : caseData.riskScore >= 75 ? '92nd' : caseData.riskScore >= 50 ? '78th' : '45th'}</strong>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Threshold</span>
                        <strong className="metric-value" style={{color: caseData.riskScore >= 75 ? '#d74844' : '#f59940'}}>{
                          caseData.riskScore >= 75 ? 'Breached' : 'Elevated'
                        }</strong>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Days at Level</span>
                        <strong className="metric-value">{caseData.riskScore >= 80 ? '3' : '7'} days</strong>
                      </div>
                    </div>

                    <div className="risk-drivers">
                      <p className="drivers-label">Key Risk Drivers:</p>
                      <div className="driver-pills">
                        {analytics.risk.breakdown
                          .filter(item => item.value >= 15)
                          .sort((a, b) => b.value - a.value)
                          .slice(0, 4)
                          .map((driver) => (
                            <span key={driver.factor} className="driver-pill" style={{background: `${RISK_COLORS[analytics.risk.classification]}15`, color: RISK_COLORS[analytics.risk.classification]}}>
                              {driver.factor} ({driver.value})
                            </span>
                          ))}
                      </div>
                    </div>

                    <div className="risk-context">
                      <svg width="100%" height="4" style={{marginBottom: '6px'}}>
                        <defs>
                          <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{stopColor: '#48b574', stopOpacity: 1}} />
                            <stop offset="33%" style={{stopColor: '#f59940', stopOpacity: 1}} />
                            <stop offset="66%" style={{stopColor: '#e8753a', stopOpacity: 1}} />
                            <stop offset="100%" style={{stopColor: '#d74844', stopOpacity: 1}} />
                          </linearGradient>
                        </defs>
                        <rect width="100%" height="4" fill="url(#riskGradient)" rx="2" />
                        <circle cx={`${caseData.riskScore}%`} cy="2" r="5" fill="#17334f" stroke="#fff" strokeWidth="2" />
                      </svg>
                      <div className="risk-scale-labels">
                        <span>0 Low</span>
                        <span>50 Medium</span>
                        <span>75 High</span>
                        <span>100 Critical</span>
                      </div>
                      <p className="risk-update-time">Last assessed: {formatDateTime(new Date(Date.now() - 15 * 60 * 1000))}</p>
                    </div>
                  </>
                ) : (
                  <p className="support-text">No records within the selected risk range.</p>
                )}
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
                  {filteredRiskBreakdown.map((factor) => (
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

            <div className="table-filters">
              <label>
                Flag Type
                <select
                  value={redFlagFilters.flagType}
                  onChange={(event) => setRedFlagFilters((prev) => ({ ...prev, flagType: event.target.value }))}
                >
                  <option value="All">All</option>
                  <option value="Immediate Withdrawal">Immediate Withdrawal</option>
                  <option value="Shared Device">Shared Device</option>
                  <option value="High Velocity">High Velocity</option>
                  <option value="Dormant Activation">Dormant Activation</option>
                  <option value="Large Inflow">Large Inflow</option>
                </select>
              </label>
              <label>
                Flag Count &gt;
                <input
                  type="number"
                  min="0"
                  value={redFlagFilters.minCount}
                  onChange={(event) => setRedFlagFilters((prev) => ({ ...prev, minCount: Number(event.target.value || 0) }))}
                />
              </label>
              <label className="inline-checkbox">
                <input
                  type="checkbox"
                  checked={redFlagFilters.multiFlagOnly}
                  onChange={(event) => setRedFlagFilters((prev) => ({ ...prev, multiFlagOnly: event.target.checked }))}
                />
                Show Multiple Flags Only
              </label>
              <label>
                Time Range
                <select
                  value={redFlagFilters.timeRange}
                  onChange={(event) => setRedFlagFilters((prev) => ({ ...prev, timeRange: event.target.value }))}
                >
                  <option value="24h">Last 24h</option>
                  <option value="7d">Last 7d</option>
                  <option value="30d">Last 30d</option>
                </select>
              </label>
            </div>

            <div className="viz-grid two-col">
              <article className="viz-card">
                <h3>Red-Flag Frequency</h3>
                <div className="chart-frame">
                  <ResponsiveContainer width="100%" height={290}>
                    <BarChart data={redFlagFiltered.frequency}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d9e5f0" />
                      <XAxis dataKey="type" interval={0} angle={-18} textAnchor="end" height={72} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {redFlagFiltered.frequency.map((entry, index) => (
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
                        data={redFlagFiltered.distribution}
                        dataKey="count"
                        nameKey="type"
                        innerRadius={54}
                        outerRadius={92}
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {redFlagFiltered.distribution.map((entry, index) => (
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

            <div className="table-filters">
              <label>
                Device ID
                <input
                  type="text"
                  value={deviceFilters.deviceId}
                  onChange={(event) => setDeviceFilters((prev) => ({ ...prev, deviceId: event.target.value }))}
                  placeholder="DV-12345"
                />
              </label>
              <label>
                IP Address
                <input
                  type="text"
                  value={deviceFilters.ip}
                  onChange={(event) => setDeviceFilters((prev) => ({ ...prev, ip: event.target.value }))}
                  placeholder="optional"
                />
              </label>
              <label>
                Geo Location
                <input
                  type="text"
                  value={deviceFilters.geo}
                  onChange={(event) => setDeviceFilters((prev) => ({ ...prev, geo: event.target.value }))}
                  placeholder="Region / Country"
                />
              </label>
              <label>
                Device used by &gt; X accounts
                <input
                  type="number"
                  min="0"
                  value={deviceFilters.minAccounts}
                  onChange={(event) => setDeviceFilters((prev) => ({ ...prev, minAccounts: Number(event.target.value || 0) }))}
                />
              </label>
              <label className="inline-checkbox">
                <input
                  type="checkbox"
                  checked={deviceFilters.sharedOnly}
                  onChange={(event) => setDeviceFilters((prev) => ({ ...prev, sharedOnly: event.target.checked }))}
                />
                Show Shared Devices Only
              </label>
              <label className="inline-checkbox">
                <input
                  type="checkbox"
                  checked={deviceFilters.highRiskOnly}
                  onChange={(event) => setDeviceFilters((prev) => ({ ...prev, highRiskOnly: event.target.checked }))}
                />
                High-Risk Device Only
              </label>
              <label className="inline-checkbox">
                <input
                  type="checkbox"
                  checked={deviceFilters.crossBorderOnly}
                  onChange={(event) => setDeviceFilters((prev) => ({ ...prev, crossBorderOnly: event.target.checked }))}
                />
                Cross-Border Login Only
              </label>
              <label>
                Multiple logins in X minutes
                <input
                  type="number"
                  min="0"
                  value={deviceFilters.recentMinutes}
                  onChange={(event) => setDeviceFilters((prev) => ({ ...prev, recentMinutes: Number(event.target.value || 0) }))}
                />
              </label>
            </div>

            <div className="viz-grid two-col">
              <article className="viz-card">
                <div className="card-headline">
                  <h3>Device <span className="mono-arrow">{'<->'}</span> Account Graph</h3>
                  <span>{deviceFiltered.nodes.filter((node) => node.kind === 'device').length} devices</span>
                </div>
                <ForceDirectedGraph nodes={deviceFiltered.nodes} links={deviceFiltered.links} height={340} />
              </article>

              <article className="viz-card">
                <h3>Accounts per Device</h3>
                <div className="chart-frame">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={deviceFiltered.perDevice} margin={{ top: 10, right: 12, bottom: 60, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d9e5f0" />
                      <XAxis dataKey="deviceId" angle={-20} textAnchor="end" interval={0} height={72} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="accounts" fill="#2f6fa3" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="support-text">{deviceFiltered.perDevice.filter((item) => item.accounts > 1).length} devices are shared by multiple accounts.</p>
              </article>
            </div>
          </section>

          <section id="alerts" className="analyst-card evidence-panel">
            <div className="section-heading">
              <h2>7) Transactional Behaviour Card</h2>
              <p>One advanced chart with anomalies, credit/debit overlays, and clutter-free filters.</p>
            </div>

            <article className="viz-card">
              <div className="card-headline">
                <h3>Behaviour Timeline</h3>
                <span>{transactionSeries.length} points</span>
              </div>

              <div className="insight-list">
                {[
                  {
                    label: 'Velocity Score',
                    value: `${analytics.transactionsBehaviour.kpis.velocityScore}/100`,
                    tone: getKpiTone(analytics.transactionsBehaviour.kpis.velocityScore, 'score')
                  },
                  {
                    label: 'Credit/Debit Ratio',
                    value: analytics.transactionsBehaviour.kpis.creditDebitRatio.toFixed(2),
                    tone: getKpiTone(analytics.transactionsBehaviour.kpis.creditDebitRatio, 'ratio')
                  },
                  {
                    label: 'Avg Retention Time',
                    value: `${analytics.transactionsBehaviour.kpis.avgRetentionHours}h`,
                    tone: getKpiTone(analytics.transactionsBehaviour.kpis.avgRetentionHours, 'time')
                  },
                  {
                    label: 'Anomaly Score',
                    value: `${analytics.transactionsBehaviour.kpis.anomalyScore}/100`,
                    tone: getKpiTone(analytics.transactionsBehaviour.kpis.anomalyScore, 'score')
                  }
                ].map((item) => (
                  <div key={item.label} className="insight-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.tone }} />
                      <p>{item.label}</p>
                    </div>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>

              <div className="table-filters">
                <label>
                  Time Filter
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    <button type="button" style={pillStyle(txnTimeFilter === '24h')} onClick={() => setTxnTimeFilter('24h')}>
                      Last 24h
                    </button>
                    <button type="button" style={pillStyle(txnTimeFilter === '7d')} onClick={() => setTxnTimeFilter('7d')}>
                      7 Days
                    </button>
                    <button type="button" style={pillStyle(txnTimeFilter === '30d')} onClick={() => setTxnTimeFilter('30d')}>
                      30 Days
                    </button>
                    <button type="button" style={pillStyle(txnTimeFilter === 'custom')} onClick={() => setTxnTimeFilter('custom')}>
                      Custom range
                    </button>
                  </div>
                </label>

                <label>
                  View Toggle
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    <button type="button" style={pillStyle(txnViewMode === 'volume')} onClick={() => setTxnViewMode('volume')}>
                      Volume View
                    </button>
                    <button type="button" style={pillStyle(txnViewMode === 'amount')} onClick={() => setTxnViewMode('amount')}>
                      Amount View
                    </button>
                    <button
                      type="button"
                      style={pillStyle(txnViewMode === 'credit-debit')}
                      onClick={() => setTxnViewMode('credit-debit')}
                    >
                      Credit vs Debit
                    </button>
                    <button type="button" style={pillStyle(txnViewMode === 'heatmap')} onClick={() => setTxnViewMode('heatmap')}>
                      Heatmap View
                    </button>
                  </div>
                </label>

                <label>
                  Risk Filter
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    <button type="button" style={pillStyle(txnRiskFilter === 'all')} onClick={() => setTxnRiskFilter('all')}>
                      Show All
                    </button>
                    <button
                      type="button"
                      style={pillStyle(txnRiskFilter === 'anomalies')}
                      onClick={() => setTxnRiskFilter('anomalies')}
                    >
                      Show Only Anomalies
                    </button>
                    <button type="button" style={pillStyle(txnRiskFilter === 'high')} onClick={() => setTxnRiskFilter('high')}>
                      Show High-Risk Only
                    </button>
                  </div>
                </label>
              </div>

              <div className="chart-frame">
                {transactionSeries.length ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={transactionSeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d9e5f0" />
                      <XAxis dataKey="label" minTickGap={18} />
                      <YAxis yAxisId="left" allowDecimals={false} />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickFormatter={formatCurrencyTick}
                        hide={txnViewMode === 'volume'}
                      />
                      <Tooltip
                        formatter={(value, name) =>
                          name.toLowerCase().includes('amount') || name.toLowerCase().includes('debit') || name.toLowerCase().includes('credit')
                            ? currencyFormatter.format(Number(value))
                            : value
                        }
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="count"
                        stroke="#2f6fa3"
                        strokeWidth={2.2}
                        dot={<TransactionDot />}
                        activeDot={{ r: 6 }}
                        name="Txn Count"
                      />
                      {(txnViewMode === 'amount' || txnViewMode === 'heatmap') && (
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="avgAmount"
                          stroke="#7e96ac"
                          strokeWidth={2}
                          strokeDasharray="5 4"
                          dot={false}
                          name="Avg Amount"
                        />
                      )}
                      {txnViewMode === 'credit-debit' && (
                        <>
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="creditAmount"
                            stroke="#2f7d58"
                            strokeWidth={2}
                            dot={false}
                            name="Credit Amount"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="debitAmount"
                            stroke="#c85d33"
                            strokeWidth={2}
                            dot={false}
                            name="Debit Amount"
                          />
                        </>
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="support-text">No data for selected filters.</p>
                )}
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
