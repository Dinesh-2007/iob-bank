import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalystContext } from './AnalystShell';
import { CASE_STATUSES, DECISION_OPTIONS } from './analystUtils';
import '../Dashboard.css';

const AnalystInvestigations = () => {
  const navigate = useNavigate();
  const { investigations, selectedState, effectiveDistrict, selectedRange } = useAnalystContext();

  const [caseFilters, setCaseFilters] = useState({
    status: 'All',
    slaRisk: 'All',
    decision: 'All'
  });

  const filteredInvestigations = useMemo(() => {
    return investigations.filter((investigation) => {
      if (caseFilters.status !== 'All' && investigation.status !== caseFilters.status) return false;
      if (caseFilters.decision !== 'All' && investigation.recommendedAction !== caseFilters.decision) return false;
      if (caseFilters.slaRisk === 'Breach Risk') {
        if (!(investigation.slaHoursRemaining <= 8 && investigation.status !== 'Closed')) return false;
      }
      if (caseFilters.slaRisk === 'Within SLA') {
        if (investigation.slaHoursRemaining <= 8 && investigation.status !== 'Closed') return false;
      }
      return true;
    });
  }, [caseFilters, investigations]);

  return (
    <section className="analyst-section">
      <div className="section-heading">
        <h2>Investigations</h2>
        <p>Case workflow with evidence panels, SLA monitoring, and decisions.</p>
      </div>
      <article className="analyst-card table-card">
        <div className="card-headline">
          <h3>Case Overview</h3>
          <span>{filteredInvestigations.length} cases</span>
        </div>

        <div className="table-filters">
          <label>
            Status
            <select
              value={caseFilters.status}
              onChange={(event) => setCaseFilters((previous) => ({ ...previous, status: event.target.value }))}
            >
              <option value="All">All</option>
              {CASE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label>
            SLA
            <select
              value={caseFilters.slaRisk}
              onChange={(event) => setCaseFilters((previous) => ({ ...previous, slaRisk: event.target.value }))}
            >
              <option value="All">All</option>
              <option value="Breach Risk">Breach Risk</option>
              <option value="Within SLA">Within SLA</option>
            </select>
          </label>

          <label>
            Decision
            <select
              value={caseFilters.decision}
              onChange={(event) => setCaseFilters((previous) => ({ ...previous, decision: event.target.value }))}
            >
              <option value="All">All</option>
              {DECISION_OPTIONS.map((decision) => (
                <option key={decision} value={decision}>
                  {decision}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Linked Alerts</th>
                <th>Risk Score</th>
                <th>Cluster ID</th>
                <th>Status</th>
                <th>SLA</th>
                <th>Investigate</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvestigations.map((investigation) => (
                <tr
                  key={investigation.caseId}
                >
                  <td>{investigation.caseId}</td>
                  <td>{investigation.linkedAlertIds.length}</td>
                  <td>{investigation.riskScore}</td>
                  <td>{investigation.clusterId}</td>
                  <td>{investigation.status}</td>
                  <td>{investigation.slaHoursRemaining}h</td>
                  <td>
                    <button
                      type="button"
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/case/${investigation.caseId}/evidence?state=${selectedState}&district=${effectiveDistrict}&range=${selectedRange}`);
                      }}
                    >
                      Investigate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
};

export default AnalystInvestigations;
