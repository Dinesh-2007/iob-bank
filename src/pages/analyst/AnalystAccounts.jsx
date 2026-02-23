import { useMemo, useState } from 'react';
import { useAnalystContext } from './AnalystShell';
import { ONBOARDING_CHANNELS, getRiskBand, currencyFormatter } from './analystUtils';
import '../Dashboard.css';

const AnalystAccounts = () => {
  const { accounts } = useAnalystContext();

  const [accountFilters, setAccountFilters] = useState({
    onboarding: 'All',
    riskBand: 'All',
    rapidMovement: 'All',
    deviceSharing: 'All'
  });

  const [selectedAccountId, setSelectedAccountId] = useState('');

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      if (accountFilters.onboarding !== 'All' && account.onboardingChannel !== accountFilters.onboarding) {
        return false;
      }
      if (accountFilters.riskBand !== 'All' && getRiskBand(account.riskScore) !== accountFilters.riskBand) {
        return false;
      }
      if (accountFilters.rapidMovement === 'Yes' && !account.riskIndicators.rapidMovement) return false;
      if (accountFilters.rapidMovement === 'No' && account.riskIndicators.rapidMovement) return false;
      if (accountFilters.deviceSharing === 'Yes' && !account.riskIndicators.deviceSharing) return false;
      if (accountFilters.deviceSharing === 'No' && account.riskIndicators.deviceSharing) return false;
      return true;
    });
  }, [accountFilters, accounts]);

  const activeAccountId = filteredAccounts.some((account) => account.accountId === selectedAccountId)
    ? selectedAccountId
    : filteredAccounts[0]?.accountId || '';

  const selectedAccount = useMemo(
    () => filteredAccounts.find((account) => account.accountId === activeAccountId) || null,
    [activeAccountId, filteredAccounts]
  );

  return (
    <section className="analyst-section">
      <div className="section-heading">
        <h2>Accounts</h2>
        <p>Account-level intelligence with risk indicators and transaction summaries.</p>
      </div>
      <div className="split-grid">
        <article className="analyst-card table-card">
          <div className="card-headline">
            <h3>Account Universe</h3>
            <span>{filteredAccounts.length} accounts</span>
          </div>

          <div className="table-filters">
            <label>
              Onboarding
              <select
                value={accountFilters.onboarding}
                onChange={(event) => setAccountFilters((previous) => ({ ...previous, onboarding: event.target.value }))}
              >
                <option value="All">All</option>
                {ONBOARDING_CHANNELS.map((channel) => (
                  <option key={channel} value={channel}>
                    {channel}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Risk Band
              <select
                value={accountFilters.riskBand}
                onChange={(event) => setAccountFilters((previous) => ({ ...previous, riskBand: event.target.value }))}
              >
                <option value="All">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </label>

            <label>
              Rapid Movement
              <select
                value={accountFilters.rapidMovement}
                onChange={(event) =>
                  setAccountFilters((previous) => ({ ...previous, rapidMovement: event.target.value }))
                }
              >
                <option value="All">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>

            <label>
              Device Sharing
              <select
                value={accountFilters.deviceSharing}
                onChange={(event) =>
                  setAccountFilters((previous) => ({ ...previous, deviceSharing: event.target.value }))
                }
              >
                <option value="All">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Account ID</th>
                  <th>Holder</th>
                  <th>Risk Score</th>
                  <th>KYC</th>
                  <th>Age (Months)</th>
                  <th>Onboarding</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <tr
                    key={account.accountId}
                    onClick={() => setSelectedAccountId(account.accountId)}
                    className={activeAccountId === account.accountId ? 'active-row' : ''}
                  >
                    <td>{account.accountId}</td>
                    <td>{account.holderName}</td>
                    <td>{account.riskScore}</td>
                    <td>{account.kycLevel}</td>
                    <td>{account.accountAgeMonths}</td>
                    <td>{account.onboardingChannel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="analyst-card">
          <div className="card-headline">
            <h3>Account Profile</h3>
            <span>{selectedAccount ? selectedAccount.accountId : 'No selection'}</span>
          </div>
          {selectedAccount ? (
            <>
              <div className="profile-row"><p>KYC Info</p><strong>{selectedAccount.kycLevel}</strong></div>
              <div className="profile-row"><p>Risk Score</p><strong>{selectedAccount.riskScore}</strong></div>
              <div className="profile-row"><p>Account Age</p><strong>{selectedAccount.accountAgeMonths} months</strong></div>
              <div className="profile-row"><p>Onboarding Channel</p><strong>{selectedAccount.onboardingChannel}</strong></div>

              <h4>Risk Indicators</h4>
              <ul className="indicator-list">
                <li><span>Rapid Movement Flag</span><strong>{selectedAccount.riskIndicators.rapidMovement ? 'Yes' : 'No'}</strong></li>
                <li><span>Structuring Pattern</span><strong>{selectedAccount.riskIndicators.structuringPattern ? 'Yes' : 'No'}</strong></li>
                <li><span>Dormant Reactivation</span><strong>{selectedAccount.riskIndicators.dormantReactivation ? 'Yes' : 'No'}</strong></li>
                <li><span>Device Sharing</span><strong>{selectedAccount.riskIndicators.deviceSharing ? 'Yes' : 'No'}</strong></li>
                <li><span>Geo Mismatch</span><strong>{selectedAccount.riskIndicators.geoMismatch ? 'Yes' : 'No'}</strong></li>
              </ul>

              <h4>Transaction Summary</h4>
              <div className="metric-grid compact">
                <article className="metric-card"><p>Total Inflow</p><strong>{currencyFormatter.format(selectedAccount.transactionSummary.totalInflow)}</strong></article>
                <article className="metric-card"><p>Total Outflow</p><strong>{currencyFormatter.format(selectedAccount.transactionSummary.totalOutflow)}</strong></article>
                <article className="metric-card"><p>Velocity</p><strong>{selectedAccount.transactionSummary.velocity} tx/day</strong></article>
                <article className="metric-card"><p>Avg Txn Amount</p><strong>{currencyFormatter.format(selectedAccount.transactionSummary.avgTransactionAmount)}</strong></article>
              </div>
            </>
          ) : (
            <p>No account available for current filters.</p>
          )}
        </article>
      </div>
    </section>
  );
};

export default AnalystAccounts;
