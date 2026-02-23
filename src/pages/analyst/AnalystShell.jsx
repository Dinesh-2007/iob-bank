import { NavLink, Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useMemo, createContext, useContext } from 'react';
import { SIDEBAR_ITEMS, INDIA_STATE_DISTRICTS, buildAnalystData, numberFormatter } from './analystUtils';
import '../Dashboard.css';

// Create context for shared analyst state
const AnalystContext = createContext();

export const useAnalystContext = () => {
  const context = useContext(AnalystContext);
  if (!context) {
    throw new Error('useAnalystContext must be used within AnalystShell');
  }
  return context;
};

const AnalystShell = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stateOptions = useMemo(() => Object.keys(INDIA_STATE_DISTRICTS), []);

  // Get initial values from URL params or defaults
  const urlState = searchParams.get('state');
  const urlDistrict = searchParams.get('district');
  const urlRange = searchParams.get('range');

  const [selectedState, setSelectedState] = useState(urlState || 'Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState(urlDistrict || 'Chennai');
  const [selectedRange, setSelectedRange] = useState(urlRange || '30d');

  const availableDistricts = useMemo(
    () => ['All Districts', ...(INDIA_STATE_DISTRICTS[selectedState] || [])],
    [selectedState]
  );

  const effectiveDistrict = availableDistricts.includes(selectedDistrict)
    ? selectedDistrict
    : availableDistricts[1] || 'All Districts';

  const analystData = useMemo(
    () => buildAnalystData(selectedState, effectiveDistrict, selectedRange),
    [effectiveDistrict, selectedRange, selectedState]
  );

  const { accounts, alerts, transactions, clusters, investigations } = analystData;

  const globalSummary = useMemo(
    () => ({
      alerts: alerts.length,
      accounts: accounts.length,
      transactions: transactions.length,
      investigations: investigations.length
    }),
    [accounts.length, alerts.length, investigations.length, transactions.length]
  );

  // Context value to share with child routes
  const contextValue = {
    selectedState,
    setSelectedState,
    selectedDistrict,
    setSelectedDistrict,
    selectedRange,
    setSelectedRange,
    effectiveDistrict,
    availableDistricts,
    stateOptions,
    accounts,
    alerts,
    transactions,
    clusters,
    investigations,
    globalSummary
  };

  return (
    <AnalystContext.Provider value={contextValue}>
      <div className="analyst-dashboard">
        <header className="analyst-topbar">
          <div>
            <h1>AML Analyst Command Center</h1>
            <p>Onboarding Risk to Transaction Monitoring to Network Analysis to Investigation to STR Filing</p>
          </div>
          <button type="button" onClick={() => navigate('/')} className="logout-btn">
            Logout
          </button>
        </header>

        <div className="analyst-shell">
          <aside className="analyst-sidebar">
            <h2>Analyst Views</h2>
            <nav>
              {SIDEBAR_ITEMS.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  end={item.id === 'dashboard'}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          <main className="analyst-content">
            <section className="analyst-card global-filter-card">
              <div className="table-filters">
                <label>
                  State
                  <select
                    value={selectedState}
                    onChange={(event) => {
                      const nextState = event.target.value;
                      setSelectedState(nextState);
                      setSelectedDistrict('All Districts');
                    }}
                  >
                    {stateOptions.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  District
                  <select value={effectiveDistrict} onChange={(event) => setSelectedDistrict(event.target.value)}>
                    {availableDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Monitoring Window
                  <select value={selectedRange} onChange={(event) => setSelectedRange(event.target.value)}>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                  </select>
                </label>
              </div>

              <div className="summary-strip">
                <article>
                  <p>Alerts</p>
                  <strong>{numberFormatter.format(globalSummary.alerts)}</strong>
                </article>
                <article>
                  <p>Accounts</p>
                  <strong>{numberFormatter.format(globalSummary.accounts)}</strong>
                </article>
                <article>
                  <p>Transactions</p>
                  <strong>{numberFormatter.format(globalSummary.transactions)}</strong>
                </article>
                <article>
                  <p>Investigations</p>
                  <strong>{numberFormatter.format(globalSummary.investigations)}</strong>
                </article>
              </div>
            </section>

            <Outlet />
          </main>
        </div>
      </div>
    </AnalystContext.Provider>
  );
};

export default AnalystShell;
