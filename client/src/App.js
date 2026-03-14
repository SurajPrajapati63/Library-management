import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import './App.css';

const publicPaths = new Set(['/', '/admin-login', '/user-login', '/register']);

function AppLayout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  useEffect(() => {
    setMenuOpen(false);
    setRole(localStorage.getItem('role') || '');
  }, [location.pathname]);

  const isAuthenticated = Boolean(localStorage.getItem('token'));
  const showPrivateLinks = isAuthenticated && !publicPaths.has(location.pathname);
  const isAdmin = role === 'admin';

  return (
    <div className="app-shell">
      <Navbar
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        showPrivateLinks={showPrivateLinks}
      />

      <main className="app-shell__content">
        <section className="page-card">
          <AppRoutes />
        </section>
      </main>
    </div>
  );
}

function App(){
  return (
    <AppLayout />
  );
}

export default App;
