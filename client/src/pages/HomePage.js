import React from 'react';
import { Link } from 'react-router-dom';

const highlights = [
  {
    title: 'Circulation control',
    text: 'Search titles, issue books, track returns, and keep inventory movement visible across the library.'
  },
  {
    title: 'Membership operations',
    text: 'Register members, manage validity windows, and keep borrowing access tied to active memberships.'
  },
  {
    title: 'Operational reporting',
    text: 'Review live availability, overdue transactions, and circulation counts from one place.'
  }
];

export default function HomePage() {
  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero__copy">
          <span className="hero__eyebrow">Library operations platform</span>
          <h1>Professional library management for daily circulation and reporting.</h1>
          <p>
            Run member onboarding, catalog maintenance, issue and return flows, and reporting from a single
            workspace built for staff and readers.
          </p>
          <div className="hero__actions">
            <Link to="/register" className="hero__cta hero__cta--primary">Create Account</Link>
            <Link to="/admin-login" className="hero__cta hero__cta--secondary">Admin Access</Link>
          </div>
        </div>

        <div className="hero__panel">
          <div className="metric-card">
            <strong>Unified Flow</strong>
            <span>Catalog, members, circulation, fines</span>
          </div>
          <div className="metric-grid">
            <article>
              <strong>15-day</strong>
              <span>issue window enforcement</span>
            </article>
            <article>
              <strong>Role-based</strong>
              <span>admin and user access</span>
            </article>
            <article>
              <strong>Live reports</strong>
              <span>availability and overdue tracking</span>
            </article>
            <article>
              <strong>Fine tracking</strong>
              <span>return and payment workflow</span>
            </article>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        {highlights.map((item) => (
          <article key={item.title} className="feature-card">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="cta-band">
        <div>
          <h2>Start with the right entry point.</h2>
          <p>Readers and administrators can register from one form. Admin registration requires the admin code.</p>
        </div>
        <div className="cta-band__links">
          <Link to="/user-login">User Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/admin-login">Admin Login</Link>
        </div>
      </section>
    </div>
  );
}
