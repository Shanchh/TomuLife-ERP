import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './Auth/AuthProvider';
import LoginFormPage from './Pages/Login/LoginPage';
import ProtectedRoute from './Auth/ProtectedRoute';
import Home from './Pages/Content/Home';
import Interface from './Pages/Main/Interface';

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
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
