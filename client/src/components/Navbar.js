import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Navbar({ isAuthenticated, isAdmin, menuOpen, setMenuOpen, showPrivateLinks }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/user-login');
  }

  return (
    <header className="app-shell__header">
      <div className="app-shell__brand">
        <Link to={isAuthenticated ? (isAdmin ? '/admin-home' : '/user-home') : '/'} className="app-shell__brand-link">
          <span className="app-shell__brand-mark">L</span>
          <span>
            <strong>Library Hub</strong>
            <small>Manage books, members, and reports</small>
          </span>
        </Link>
        <button
          type="button"
          className="app-shell__menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          Menu
        </button>
      </div>

      <nav className={`app-shell__nav ${menuOpen ? 'app-shell__nav--open' : ''}`}>
        <div className="app-shell__nav-group">
          {!showPrivateLinks && <NavLink to="/" className="app-shell__nav-link">Home</NavLink>}
          {!showPrivateLinks && (
            <>
              <NavLink to="/user-login" className="app-shell__nav-link">User Login</NavLink>
              <NavLink to="/admin-login" className="app-shell__nav-link">Admin Login</NavLink>
            </>
          )}
          {showPrivateLinks && (
            <>
              <NavLink to={isAdmin ? '/admin-home' : '/user-home'} className="app-shell__nav-link">Dashboard</NavLink>
              <NavLink to="/transactions/search" className="app-shell__nav-link">Transactions</NavLink>
              <NavLink to="/reports" className="app-shell__nav-link">Reports</NavLink>
              {isAdmin && <NavLink to="/maintenance" className="app-shell__nav-link">Maintenance</NavLink>}
            </>
          )}
        </div>
        <div className="app-shell__nav-group app-shell__nav-group--actions">
          {!showPrivateLinks ? (
            <NavLink to="/register" className="app-shell__nav-link app-shell__nav-link--accent">Get Started</NavLink>
          ) : (
            <button type="button" className="app-shell__logout" onClick={logout}>Logout</button>
          )}
        </div>
      </nav>
    </header>
  );
}
