import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/dashboard/Dashboard';
import MainLayout from './components/layout/MainLayout';
import LCCreate from './pages/lc/LCCreate';
import LCAmendment from './pages/lc/LCAmendment';
import BGCreate from './pages/bg/BGCreate';
import AMLReview from './pages/compliance/AMLReview';
import ApprovalQueue from './pages/approvals/ApprovalQueue';
import DocumentUpload from './pages/reports/DocumentUpload';
import TradeReports from './pages/reports/TradeReports';
import TradeLoans from './pages/loans/TradeLoans';
import TradeApplication from './pages/trade/TradeApplication';
import LCDocCheck from './pages/lc/LCDocCheck';
import BGClaim from './pages/bg/BGClaim';
import CountryRisk from './pages/compliance/CountryRisk';
import CustomerSearch from './pages/admin/CustomerSearch';
import DocCollection from './pages/trade/DocCollection';
import AuditLogViewer from './pages/admin/AuditLogViewer';
import DocumentCenter from './pages/docs/DocumentCenter';
import ChargesConfig from './pages/admin/ChargesConfig';
import UserRole from './pages/admin/UserRole';
import GLEntries from './pages/admin/GLEntries';
import CustomerProfile from './pages/admin/CustomerProfile';
import TransactionHistory from './pages/reports/TransactionHistory';


const Placeholder = ({ title }: { title: string }) => (
    <div style={{ padding: 20 }}>
        <h2>{title}</h2>
        <p>This module is under development.</p>
    </div>
);

function App() {
    const isAuthenticated = !!localStorage.getItem('token'); // Check token

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route path="/" element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
                        <Route index element={<Dashboard />} />

                        {/* Trade Application */}
                        <Route path="trade/new" element={<TradeApplication />} />

                        {/* Letter of Credit Module */}
                        <Route path="lc" element={<Navigate to="/lc/create" />} />
                        <Route path="lc/create" element={<LCCreate />} />
                        <Route path="lc/amend" element={<LCAmendment />} />
                        <Route path="lc/docs" element={<LCDocCheck />} />

                        {/* Bank Guarantee Module */}
                        <Route path="bg" element={<Navigate to="/bg/create" />} />
                        <Route path="bg/create" element={<BGCreate />} />
                        <Route path="bg/claim" element={<BGClaim />} />

                        {/* Trade Loans */}
                        <Route path="loans" element={<TradeLoans />} />
                        <Route path="collections" element={<DocCollection />} />

                        {/* Compliance & Risk */}
                        <Route path="compliance" element={<Navigate to="/compliance/risk" />} />
                        <Route path="compliance/risk" element={<CountryRisk />} />
                        <Route path="compliance/aml" element={<AMLReview />} />

                        {/* Approvals & Reports */}
                        <Route path="approvals" element={<ApprovalQueue />} />
                        <Route path="documents" element={<DocumentCenter />} />
                        <Route path="reports" element={<TradeReports />} />
                        <Route path="reports/docs" element={<DocumentUpload />} />
                        <Route path="history" element={<TransactionHistory />} />

                        {/* Admin */}
                        <Route path="admin/audit" element={<AuditLogViewer />} />
                        <Route path="admin/customers" element={<CustomerSearch />} />
                        <Route path="admin/customers/:id" element={<CustomerProfile />} />
                        <Route path="admin/charges" element={<ChargesConfig />} />
                        <Route path="admin/users" element={<UserRole />} />
                        <Route path="admin/gl" element={<GLEntries />} />

                    </Route>


                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </ThemeProvider >
    );
}

export default App;
