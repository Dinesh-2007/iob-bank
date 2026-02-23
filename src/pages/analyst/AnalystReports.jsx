import { useMemo, useState } from 'react';
import { useAnalystContext } from './AnalystShell';
import { REPORT_PERIODS, numberFormatter } from './analystUtils';
import '../Dashboard.css';

const AnalystReports = () => {
  const { investigations, alerts, transactions, selectedState, effectiveDistrict } = useAnalystContext();

  const [reportFilters, setReportFilters] = useState({
    reportType: 'All',
    period: 'This Week'
  });

  const reportRows = useMemo(() => {
    const strDraftCount = investigations.filter(
      (investigation) => investigation.status === 'STR Filed' || investigation.recommendedAction === 'File STR'
    ).length;
    const caseReportCount = investigations.length;
    const activityCount = Math.round((alerts.length + investigations.length + transactions.length) / 3);
    const compliancePct = investigations.length
      ? Math.round(
          (investigations.filter((investigation) => investigation.status === 'Closed').length / investigations.length) * 100
        )
      : 0;

    const rows = [
      {
        type: 'STR Draft',
        total: strDraftCount,
        owner: 'AML Team',
        status: 'Ready for Review',
        description: 'Draft suspicious transaction reports pending compliance review.'
      },
      {
        type: 'Export Case Report',
        total: caseReportCount,
        owner: 'Case Management',
        status: 'Export Available',
        description: 'Case packets with linked alerts, evidence, and analyst actions.'
      },
      {
        type: 'Analyst Activity Report',
        total: activityCount,
        owner: 'Operations Governance',
        status: 'Daily Refresh',
        description: 'Analyst throughput, closure pace, and escalation trend.'
      },
      {
        type: 'Compliance Summary',
        total: compliancePct,
        owner: 'Compliance Office',
        status: 'Monthly Certified',
        description: 'Closure ratio, SLA adherence, and STR conversion metrics.'
      }
    ];

    return rows.filter((row) => reportFilters.reportType === 'All' || row.type === reportFilters.reportType);
  }, [alerts.length, investigations, reportFilters.reportType, transactions.length]);

  return (
    <section className="analyst-section">
      <div className="section-heading">
        <h2>Reports</h2>
        <p>Regulatory output and compliance summary generation.</p>
      </div>
      <article className="analyst-card">
        <div className="table-filters">
          <label>
            Report Type
            <select
              value={reportFilters.reportType}
              onChange={(event) =>
                setReportFilters((previous) => ({ ...previous, reportType: event.target.value }))
              }
            >
              <option value="All">All</option>
              <option value="STR Draft">STR Draft</option>
              <option value="Export Case Report">Export Case Report</option>
              <option value="Analyst Activity Report">Analyst Activity Report</option>
              <option value="Compliance Summary">Compliance Summary</option>
            </select>
          </label>

          <label>
            Period
            <select
              value={reportFilters.period}
              onChange={(event) => setReportFilters((previous) => ({ ...previous, period: event.target.value }))}
            >
              {REPORT_PERIODS.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="report-grid">
          {reportRows.map((report) => (
            <article key={report.type} className="report-card">
              <p>{report.type}</p>
              <strong>{report.type === 'Compliance Summary' ? `${report.total}%` : numberFormatter.format(report.total)}</strong>
              <span>{report.description}</span>
              <div className="report-meta">
                <small>{selectedState} / {effectiveDistrict}</small>
                <small>{reportFilters.period}</small>
              </div>
            </article>
          ))}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Report</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Region</th>
                <th>Period</th>
              </tr>
            </thead>
            <tbody>
              {reportRows.map((report) => (
                <tr key={`${report.type}-row`}>
                  <td>{report.type}</td>
                  <td>{report.owner}</td>
                  <td>{report.status}</td>
                  <td>{selectedState} / {effectiveDistrict}</td>
                  <td>{reportFilters.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
};

export default AnalystReports;
