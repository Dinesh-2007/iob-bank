import '../Dashboard.css';

const AnalystReports = ({ reportFilters, setReportFilters, REPORT_PERIODS, selectedReportItem, setSelectedReportItem, downloadFormat, setDownloadFormat, handleDownload, filteredInvestigations, reportRows, numberFormatter, selectedState, effectiveDistrict, selectedRange, explanationData, navigate }) => (
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
            onChange={(event) => {
              const nextType = event.target.value;
              setReportFilters((previous) => ({ ...previous, reportType: nextType }));
              setSelectedReportItem('All');
            }}
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

        {/* download controls for reports */}
        <div className="report-download">
          {reportFilters.reportType !== 'All' && (
            <label>
              Select Item
              <select
                value={selectedReportItem}
                onChange={(e) => setSelectedReportItem(e.target.value)}
              >
                <option value="All">All</option>
                {reportFilters.reportType === 'Export Case Report' &&
                  filteredInvestigations.map((inv) => (
                    <option key={inv.caseId} value={inv.caseId}>
                      {inv.caseId}
                    </option>
                  ))}
              </select>
            </label>
          )}

          <button
            disabled={reportFilters.reportType === 'All'}
            onClick={() => handleDownload(reportFilters.reportType)}
          >
            📥 Download
          </button>

          {reportFilters.reportType === 'All' && (
            <small style={{ marginLeft: '8px', color: '#d9534f' }}>
              Please select a specific report type to download.
            </small>
          )}

          {reportFilters.reportType === 'Analyst Activity Report' && (
            <label className="download-format">
              Download As:
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
              >
                <option value="CSV">CSV</option>
                <option value="Excel">Excel</option>
              </select>
            </label>
          )}
        </div>
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

      {/* explanation panel for selected report item */}
      {explanationData && (
        <div className="analyst-card explanation-card">
          <h3>Risk Explanation &nbsp;({explanationData.caseId})</h3>
          <p>
            <strong>Analyst:</strong> {explanationData.analyst}{' '}
            {explanationData.caseId && explanationData.caseId.startsWith('CASE-') && (
              <button
                type="button"
                className="link-button"
                onClick={() =>
                  navigate(
                    `/case/${explanationData.caseId}/evidence?state=${selectedState}&district=${effectiveDistrict}&range=${selectedRange}`
                  )
                }
              >
                View investigation
              </button>
            )}
          </p>
          <div className="factor-list">
            <p><strong>Top contributing factors:</strong></p>
            <ol>
              {explanationData.factors.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ol>
          </div>
          <div className="weight-bars">
            {explanationData.weights.map((w) => (
              <div key={w.label} className="weight-bar">
                <span>{w.label} ({w.percent}%)</span>
                <div
                  className="bar"
                  style={{ width: `${w.percent}%`, backgroundColor: '#2f7fd8', height: '8px', margin: '4px 0' }}
                />
              </div>
            ))}
          </div>
          <p><strong>Behaviour deviation:</strong> {explanationData.behaviourDeviation}</p>
          <p>
            <strong>Graph centrality:</strong> degree {explanationData.centrality.degree},
            {` cluster risk ${explanationData.centrality.clusterRisk}, `}
            {explanationData.centrality.hops}-hop connection to confirmed STR account
          </p>
        </div>
      )}
    </article>
  </section>
);

export default AnalystReports;
