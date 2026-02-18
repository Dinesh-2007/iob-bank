import { useState } from 'react';

const initialRules = [
  {
    id: 'velocity',
    rule: 'Transaction Velocity Burst',
    category: 'Behavioral Thresholds',
    weight: 84,
    enabled: true,
    priority: 1
  },
  {
    id: 'device',
    rule: 'Device Fingerprint Volatility',
    category: 'Device Risk Settings',
    weight: 73,
    enabled: true,
    priority: 2
  },
  {
    id: 'graph',
    rule: 'Graph Relationship Sensitivity',
    category: 'Graph Relationship Sensitivity',
    weight: 79,
    enabled: true,
    priority: 1
  },
  {
    id: 'cashin',
    rule: 'Rapid Cash-in Cash-out',
    category: 'Red Flag Library',
    weight: 89,
    enabled: true,
    priority: 1
  },
  {
    id: 'dormant',
    rule: 'Dormant Account Reactivation',
    category: 'Risk Scoring Rules',
    weight: 58,
    enabled: false,
    priority: 4
  },
  {
    id: 'geo',
    rule: 'Cross-geo Beneficiary Spike',
    category: 'Behavioral Thresholds',
    weight: 66,
    enabled: true,
    priority: 3
  }
];

const categorySummary = [
  { label: 'Risk Scoring Rules', count: 32, tuned: 7 },
  { label: 'Behavioral Thresholds', count: 18, tuned: 4 },
  { label: 'Device Risk Settings', count: 14, tuned: 3 },
  { label: 'Graph Relationship Sensitivity', count: 9, tuned: 2 },
  { label: 'Red Flag Library', count: 41, tuned: 6 }
];

const AdminRiskEngine = () => {
  const [rules, setRules] = useState(initialRules);

  const updateRule = (id, key, value) => {
    setRules((currentRules) =>
      currentRules.map((rule) => (rule.id === id ? { ...rule, [key]: value } : rule))
    );
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h3>Risk Engine Configuration</h3>
        <p>Calibrate risk scoring models, thresholds, and relationship sensitivity in real time.</p>
      </div>

      <section className="kpi-grid compact-grid">
        {categorySummary.map((item) => (
          <article key={item.label} className="admin-card kpi-card compact">
            <p className="kpi-label">{item.label}</p>
            <p className="kpi-value">{item.count}</p>
            <p className="kpi-delta">{item.tuned} tuned this week</p>
          </article>
        ))}
      </section>

      <section className="admin-card">
        <div className="card-head">
          <h4>Risk Rule Controls</h4>
          <span>Editable weight, enable/disable, and priority ordering</span>
        </div>
        <div className="risk-rule-list">
          {rules.map((rule) => (
            <article key={rule.id} className="risk-rule-item">
              <div className="risk-rule-head">
                <div>
                  <h5>{rule.rule}</h5>
                  <p>{rule.category}</p>
                </div>
                <button
                  className={`toggle-btn${rule.enabled ? ' enabled' : ''}`}
                  onClick={() => updateRule(rule.id, 'enabled', !rule.enabled)}
                  aria-label={`${rule.enabled ? 'Disable' : 'Enable'} ${rule.rule}`}
                >
                  <span />
                </button>
              </div>

              <div className="risk-rule-controls">
                <label>
                  Risk Weight: {rule.weight}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={rule.weight}
                    onChange={(event) => updateRule(rule.id, 'weight', Number(event.target.value))}
                  />
                </label>

                <label>
                  Rule Priority
                  <select
                    value={rule.priority}
                    onChange={(event) => updateRule(rule.id, 'priority', Number(event.target.value))}
                  >
                    <option value={1}>1 - Critical</option>
                    <option value={2}>2 - High</option>
                    <option value={3}>3 - Medium</option>
                    <option value={4}>4 - Low</option>
                    <option value={5}>5 - Informational</option>
                  </select>
                </label>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminRiskEngine;
