import { useMemo, useState } from 'react';
import { useAnalystContext } from './AnalystShell';
import { PATTERN_TAGS, formatDateTime, currencyFormatter } from './analystUtils';
import '../Dashboard.css';

const AnalystTransactions = () => {
  const { transactions } = useAnalystContext();

  const [transactionFilters, setTransactionFilters] = useState({
    patternTag: 'All',
    direction: 'All',
    minAmount: '',
    maxAmount: ''
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (transactionFilters.patternTag !== 'All' && transaction.patternTag !== transactionFilters.patternTag) {
        return false;
      }
      if (transactionFilters.direction !== 'All' && transaction.direction !== transactionFilters.direction) {
        return false;
      }
      if (transactionFilters.minAmount && transaction.amount < Number(transactionFilters.minAmount)) return false;
      if (transactionFilters.maxAmount && transaction.amount > Number(transactionFilters.maxAmount)) return false;
      return true;
    });
  }, [transactionFilters, transactions]);

  const flowSummary = useMemo(() => {
    const routes = new Map();
    filteredTransactions.forEach((transaction) => {
      const key = `${transaction.fromAccount} -> ${transaction.toAccount}`;
      routes.set(key, (routes.get(key) || 0) + transaction.amount);
    });
    return [...routes.entries()]
      .map(([path, amount]) => ({ path, amount }))
      .sort((left, right) => right.amount - left.amount)
      .slice(0, 8);
  }, [filteredTransactions]);

  const patternSummary = useMemo(
    () =>
      PATTERN_TAGS.map((tag) => ({
        tag,
        count: filteredTransactions.filter((transaction) => transaction.patternTag === tag).length
      })),
    [filteredTransactions]
  );

  return (
    <section className="analyst-section">
      <div className="section-heading">
        <h2>Transactions</h2>
        <p>Pattern detection with timeline flow, directional visibility, and tag analytics.</p>
      </div>
      <article className="analyst-card">
        <div className="table-filters">
          <label>
            Pattern Tag
            <select
              value={transactionFilters.patternTag}
              onChange={(event) =>
                setTransactionFilters((previous) => ({ ...previous, patternTag: event.target.value }))
              }
            >
              <option value="All">All</option>
              {PATTERN_TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>

          <label>
            Direction
            <select
              value={transactionFilters.direction}
              onChange={(event) =>
                setTransactionFilters((previous) => ({ ...previous, direction: event.target.value }))
              }
            >
              <option value="All">All</option>
              <option value="Inbound">Inbound</option>
              <option value="Outbound">Outbound</option>
            </select>
          </label>

          <label>
            Min Amount
            <input
              type="number"
              value={transactionFilters.minAmount}
              onChange={(event) =>
                setTransactionFilters((previous) => ({ ...previous, minAmount: event.target.value }))
              }
            />
          </label>

          <label>
            Max Amount
            <input
              type="number"
              value={transactionFilters.maxAmount}
              onChange={(event) =>
                setTransactionFilters((previous) => ({ ...previous, maxAmount: event.target.value }))
              }
            />
          </label>
        </div>

        <div className="split-grid">
          <div>
            <div className="card-headline">
              <h3>Transaction Timeline</h3>
              <span>{filteredTransactions.length} records</span>
            </div>
            <ul className="timeline-list">
              {filteredTransactions.slice(0, 12).map((transaction) => (
                <li key={transaction.transactionId}>
                  <div>
                    <strong>{transaction.transactionId}</strong>
                    <p>{transaction.fromAccount} {'->'} {transaction.toAccount}</p>
                  </div>
                  <div>
                    <strong>{currencyFormatter.format(transaction.amount)}</strong>
                    <p>{formatDateTime(transaction.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="card-headline">
              <h3>Flow Visualization</h3>
              <span>Top directional routes</span>
            </div>
            <ul className="flow-list">
              {flowSummary.map((flow) => (
                <li key={flow.path}>
                  <div className="flow-meta">
                    <span>{flow.path}</span>
                    <strong>{currencyFormatter.format(flow.amount)}</strong>
                  </div>
                  <div className="track">
                    <div
                      className="fill"
                      style={{ width: `${Math.max(6, Math.round((flow.amount / flowSummary[0].amount) * 100))}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pattern-grid">
          {patternSummary.map((pattern) => (
            <article key={pattern.tag} className="pattern-card">
              <p>{pattern.tag}</p>
              <strong>{pattern.count}</strong>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
};

export default AnalystTransactions;
