import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ReturnBook() {
  const nav = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [transactionId, setTransactionId] = useState('');
  const [returnDate, setReturnDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/transactions/open')
      .then((res) => setTransactions(res.data || []))
      .catch((err) => setError(err.response?.data?.error || 'Unable to load active issues'));
  }, []);

  const selectedTransaction = transactions.find((transaction) => transaction._id === transactionId);

  async function submit(e) {
    e.preventDefault();
    setError('');

    if (!transactionId || !returnDate) {
      setError('Missing fields');
      return;
    }

    try {
      const res = await api.post('/api/transactions/return', {
        transactionId,
        actualReturnDate: returnDate
      });
      nav(`/transactions/payfine?transactionId=${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Error');
    }
  }

  return (
    <div>
      <h2>Return Book</h2>
      <form onSubmit={submit}>
        <div>
          <select value={transactionId} onChange={(e) => setTransactionId(e.target.value)}>
            <option value="">Select issued item</option>
            {transactions.map((transaction) => (
              <option key={transaction._id} value={transaction._id}>
                {transaction.bookId?.title || 'Unknown book'} - {transaction.memberId?.memberName || 'Unknown member'}
              </option>
            ))}
          </select>
        </div>

        {selectedTransaction && (
          <section>
            <div className="info-grid">
              <div><strong>Book Name:</strong> {selectedTransaction.bookId?.title}</div>
              <div><strong>Author Name:</strong> {selectedTransaction.bookId?.author}</div>
              <div><strong>Serial Number:</strong> {selectedTransaction.bookId?.serialNumber}</div>
              <div><strong>Issue Date:</strong> {new Date(selectedTransaction.issueDate).toLocaleDateString()}</div>
            </div>
          </section>
        )}

        <div><input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} /></div>
        <div className="form-message form-message--error">{error}</div>
        <div><button>Return</button></div>
      </form>
    </div>
  );
}
