import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

function addDays(dateString, days) {
  const nextDate = new Date(dateString);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate.toISOString().slice(0, 10);
}

export default function BookIssue() {
  const loc = useLocation();
  const nav = useNavigate();
  const book = loc.state?.book;
  const [memberships, setMemberships] = useState([]);
  const [memberId, setMemberId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [returnDate, setReturnDate] = useState(addDays(new Date().toISOString().slice(0, 10), 15));
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/api/memberships')
      .then((res) => setMemberships(res.data || []))
      .catch((err) => setError(err.response?.data?.error || 'Unable to load memberships'));
  }, []);

  useEffect(() => {
    const maxReturnDate = addDays(issueDate, 15);
    if (!returnDate || returnDate < issueDate || returnDate > maxReturnDate) {
      setReturnDate(maxReturnDate);
    }
  }, [issueDate, returnDate]);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!book?._id || !memberId || !issueDate || !returnDate) {
      setError('All required fields must be provided.');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    if (issueDate < today) {
      setError('Issue Date cannot be earlier than today.');
      return;
    }

    if (returnDate < issueDate) {
      setError('Return Date cannot be earlier than Issue Date.');
      return;
    }

    if (returnDate > addDays(issueDate, 15)) {
      setError('Return Date cannot exceed 15 days from Issue Date.');
      return;
    }

    try {
      await api.post('/api/transactions/issue', {
        bookId: book._id,
        memberId,
        issueDate,
        returnDate,
        remarks
      });
      setSuccess('Book issued successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Error');
    }
  }

  if (!book?._id) {
    return (
      <div>
        <h2>Issue Book</h2>
        <p>Select a book from the search page before issuing.</p>
        <p><Link to="/transactions/search">Back to search</Link></p>
      </div>
    );
  }

  return (
    <div>
      <h2>Issue Book</h2>
      <form onSubmit={submit}>
        <div><input value={book.title || ''} readOnly placeholder="Book Name" /></div>
        <div><input value={book.author || ''} readOnly placeholder="Author Name" /></div>
        <div>
          <select value={memberId} onChange={(e) => setMemberId(e.target.value)}>
            <option value="">Select membership</option>
            {memberships.map((membership) => (
              <option key={membership._id} value={membership._id}>
                {membership.memberName} ({membership.membershipNumber})
              </option>
            ))}
          </select>
        </div>
        <div><input type="date" value={issueDate} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setIssueDate(e.target.value)} /></div>
        <div><input type="date" value={returnDate} min={issueDate} max={addDays(issueDate, 15)} onChange={(e) => setReturnDate(e.target.value)} /></div>
        <div><input value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Remarks (optional)" /></div>
        <div className="form-message form-message--error">{error}</div>
        <div className="form-message form-message--success">{success}</div>
        <div><button>Issue</button></div>
      </form>
      <p><button type="button" onClick={() => nav('/transactions/search')}>Choose another book</button></p>
    </div>
  );
}
