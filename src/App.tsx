import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import BookingPage from './pages/BookingPage';
import PartsPage from './pages/PartsPage';
import CartPage from './pages/CartPage';
import MasterDashboard from './pages/MasterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoyaltyPage from './pages/LoyaltyPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import { UserRole } from './types';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route 
                path="profile" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="booking" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <BookingPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="parts" element={<PartsPage />} />
              <Route 
                path="cart" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <CartPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="loyalty" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <LoyaltyPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="master" 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.MASTER, UserRole.ADMIN]}>
                    <MasterDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin" 
                element={
                  <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
