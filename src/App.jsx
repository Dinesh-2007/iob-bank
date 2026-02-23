import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CaseEvidence from './pages/CaseEvidence';
import AdminShell from './pages/admin/AdminShell';
import AdminOverview from './pages/admin/AdminOverview';
import AdminUserManagement from './pages/admin/AdminUserManagement';
import AdminRiskEngine from './pages/admin/AdminRiskEngine';
import AdminCompliance from './pages/admin/AdminCompliance';
import AdminDataSources from './pages/admin/AdminDataSources';
import AdminModelMonitoring from './pages/admin/AdminModelMonitoring';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AnalystShell from './pages/analyst/AnalystShell';
import AnalystDashboard from './pages/analyst/AnalystDashboard';
import AnalystAlerts from './pages/analyst/AnalystAlerts';
import AnalystAccounts from './pages/analyst/AnalystAccounts';
import AnalystTransactions from './pages/analyst/AnalystTransactions';
import AnalystNetworkAnalysis from './pages/analyst/AnalystNetworkAnalysis';
import AnalystInvestigations from './pages/analyst/AnalystInvestigations';
import AnalystReports from './pages/analyst/AnalystReports';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminShell />}>
          <Route index element={<AdminOverview />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="user-management" element={<AdminUserManagement />} />
          <Route path="risk-engine" element={<AdminRiskEngine />} />
          <Route path="compliance" element={<AdminCompliance />} />
          <Route path="data-sources" element={<AdminDataSources />} />
          <Route path="model-monitoring" element={<AdminModelMonitoring />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
        </Route>
        <Route path="/dashboard/admin" element={<Navigate to="/admin" replace />} />
        <Route path="/dashboard/analyst" element={<AnalystShell />}>
          <Route index element={<AnalystDashboard />} />
          <Route path="dashboard" element={<Navigate to="/dashboard/analyst" replace />} />
          <Route path="alerts" element={<AnalystAlerts />} />
          <Route path="accounts" element={<AnalystAccounts />} />
          <Route path="transactions" element={<AnalystTransactions />} />
          <Route path="network" element={<AnalystNetworkAnalysis />} />
          <Route path="investigations" element={<AnalystInvestigations />} />
          <Route path="reports" element={<AnalystReports />} />
        </Route>
        <Route path="/case/:caseId/evidence" element={<CaseEvidence />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
