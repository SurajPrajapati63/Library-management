import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/reports')
      .then((response) => setSummary(response.data))
      .catch((err) => setError(err.response?.data?.error || 'Unable to load reports'));
  }, []);

  async function submitSearch(e) {
    e.preventDefault();
    setError('');

    if (!title.trim() && !author.trim()) {
      setError('Please enter Book Name or Author Name.');
      return;
    }

    try {
      const response = await api.get('/api/books/search', {
        params: { title: title.trim(), author: author.trim() }
      });
      setRows(response.data || []);
      setSelectedId('');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to search books.');
    }
  }

  return (
    <div className="page-stack">
      <h2>Reports</h2>

      {summary && (
        <div className="dashboard__grid">
          <article className="dashboard__card">
            <h3>Available Books</h3>
            <strong>{summary.availableBooks}</strong>
          </article>
          <article className="dashboard__card">
            <h3>Issued Books</h3>
            <strong>{summary.issuedBooks}</strong>
          </article>
          <article className="dashboard__card">
            <h3>Overdue Transactions</h3>
            <strong>{summary.overdueTransactions}</strong>
          </article>
        </div>
      )}

      <section>
        <h3>Book Availability Search</h3>
        <form onSubmit={submitSearch}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Book Name" />
          <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author Name" />
          <button>Search</button>
        </form>
      </section>

      {error && <p className="form-message form-message--error">{error}</p>}

      {rows.length > 0 && (
        <section>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Book Name</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Availability</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row._id}>
                    <td>{row.title}</td>
                    <td>{row.author}</td>
                    <td>{row.category}</td>
                    <td>{row.available ? 'Available' : 'Issued'}</td>
                    <td>
                      <input
                        type="radio"
                        name="reportSelection"
                        checked={selectedId === row._id}
                        onChange={() => setSelectedId(row._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
