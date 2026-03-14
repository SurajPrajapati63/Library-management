import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function BookSearch() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError('');

    if (!title.trim() && !author.trim()) {
      setError('Please enter Book Name or Author Name.');
      return;
    }

    try {
      const res = await api.get('/api/books/search', {
        params: { title: title.trim(), author: author.trim() }
      });
      setRows(res.data || []);
      setSelectedId('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error');
    }
  }

  function continueToIssue() {
    const selectedBook = rows.find((row) => row._id === selectedId);
    if (!selectedBook) {
      setError('Select a book to continue.');
      return;
    }

    nav('/transactions/issue', { state: { book: selectedBook } });
  }

  return (
    <div className="page-stack">
      <h2>Search Books</h2>
      <form onSubmit={submit}>
        <div><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Book Name" /></div>
        <div><input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author Name" /></div>
        <div className="form-message form-message--error">{error}</div>
        <div><button>Search</button></div>
      </form>

      {rows.length > 0 && (
        <section>
          <h3>Search Results</h3>
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
                        name="selectedBook"
                        checked={selectedId === row._id}
                        onChange={() => setSelectedId(row._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={continueToIssue}>Issue Selected Book</button>
        </section>
      )}
    </div>
  );
}
