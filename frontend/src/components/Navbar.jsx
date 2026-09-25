import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isCustomer, isAgent } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardPath = isAgent ? '/agent/dashboard' : '/customer/dashboard';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to={user ? dashboardPath : '/login'} className="navbar-brand">
          <div className="brand-icon">SD</div>
          <span>SupportDesk</span>
        </Link>

        {user && (
          <div className="navbar-user">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>

            <span className={`badge ${isCustomer ? 'badge-customer' : 'badge-agent'}`}>
              {isCustomer ? 'Customer' : 'Support Agent'}
            </span>

            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm"
              id="logout-btn"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
