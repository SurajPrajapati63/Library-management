import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function UserHome() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/api/reports').then((response) => setSummary(response.data)).catch(() => {});
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h2>User Dashboard</h2>
          <p>Search the catalog, issue available books, return items, and review reports.</p>
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
        <article className="dashboard__card"><h3>Search and Issue</h3><p>Look up titles by book or author name and issue a selected book.</p><Link to="/transactions/search">Start Search</Link></article>
        <article className="dashboard__card"><h3>Return Book</h3><p>Select an open transaction and continue to fine settlement.</p><Link to="/transactions/return">Return Item</Link></article>
        <article className="dashboard__card"><h3>Reports</h3><p>Run availability searches and view circulation summaries.</p><Link to="/reports">Open Reports</Link></article>
      </div>
    </div>
  );
}
