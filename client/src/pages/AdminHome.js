import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminHome() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/api/reports').then((response) => setSummary(response.data)).catch(() => {});
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h2>Admin Dashboard</h2>
          <p>Manage catalog maintenance, circulation, and reporting from one workspace.</p>
        </div>
      </div>

      {summary && (
        <div className="dashboard__grid">
          <article className="dashboard__card"><h3>Available Books</h3><strong>{summary.availableBooks}</strong></article>
          <article className="dashboard__card"><h3>Issued Books</h3><strong>{summary.issuedBooks}</strong></article>
          <article className="dashboard__card"><h3>Overdue</h3><strong>{summary.overdueTransactions}</strong></article>
        </div>
      )}

      <div className="dashboard__grid">
        <article className="dashboard__card"><h3>Maintenance</h3><p>Memberships, books, and users.</p><Link to="/maintenance">Open Maintenance</Link></article>
        <article className="dashboard__card"><h3>Transactions</h3><p>Issue books, return items, and close fines.</p><Link to="/transactions/search">Open Transactions</Link></article>
        <article className="dashboard__card"><h3>Reports</h3><p>Search availability and review circulation counts.</p><Link to="/reports">Open Reports</Link></article>
      </div>
    </div>
  );
}
