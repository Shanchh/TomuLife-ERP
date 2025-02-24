import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './Auth/AuthProvider';
import LoginFormPage from './Pages/Login/LoginPage';
import ProtectedRoute from './Auth/ProtectedRoute';
import Home from './Pages/Content/Home';
import Interface from './Pages/Main/Interface';
import FinancePurchaseStatistics from './Pages/Content/FinancePurchaseStatistics';
import FinancePurchaseReport from './Pages/Content/FinancePurchaseReport';
import FinancePurchaseDetails from './Pages/Content/FinancePurchaseDetails';
import FinanceSalesStatistics from './Pages/Content/FinanceSalesStatistics';
import FinanceSalesReport from './Pages/Content/FinanceSalesReport';
import FinanceSalesDetails from './Pages/Content/FinanceSalesDetails';
import FinanceActivityOverview from './Pages/Content/FinanceActivityOverview';
import FinanceActivityReport from './Pages/Content/FinanceActivityReport';
import SystemCustomerManagement from './Pages/Content/SystemCustomerManagement';
import SystemProductManagement from './Pages/Content/SystemProductManagement';
import SystemRoleManagement from './Pages/Content/SystemRoleManagement';
import SystemUserManagement from './Pages/Content/SystemUserManagement';
import Setting from './Pages/Main/Setting';

function App() {
  return (
    <div className="TomuWine">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginFormPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Interface />}>
                <Route path="/" element={<Home />} />

                <Route path="/finance/purchase-management/statistics" element={<FinancePurchaseStatistics />} />
                <Route path="/finance/purchase-management/report" element={<FinancePurchaseReport />} />
                <Route path="/finance/purchase-management/details" element={<FinancePurchaseDetails />} />
                
                <Route path="/finance/sales-management/statistics" element={<FinanceSalesStatistics />} />
                <Route path="/finance/sales-management/report" element={<FinanceSalesReport />} />
                <Route path="/finance/sales-management/details" element={<FinanceSalesDetails />} />

                <Route path="/finance/activity-management/overview" element={<FinanceActivityOverview />} />
                <Route path="/finance/activity-management/report" element={<FinanceActivityReport />} />

                <Route path="/system/customer-management" element={<SystemCustomerManagement />} />
                <Route path="/system/product-management" element={<SystemProductManagement />} />
                <Route path="/system/role-management" element={<SystemRoleManagement />} />
                <Route path="/system/user-management" element={<SystemUserManagement />} />

                <Route path="/setting" element={<Setting />} />

              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
