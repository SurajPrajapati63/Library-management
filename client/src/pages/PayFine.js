import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

export default function PayFine() {
  const [params] = useSearchParams();
  const transactionId = params.get('transactionId');
  const [transaction, setTransaction] = useState(null);
  const [paid, setPaid] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!transactionId) return;

    api.get(`/api/transactions/${transactionId}`)
      .then((res) => {
        setTransaction(res.data);
        setPaid(!!res.data.finePaid);
        setRemarks(res.data.remarks || '');
      })
      .catch((err) => setError(err.response?.data?.error || 'Unable to load transaction'));
  }, [transactionId]);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!transaction) {
      setError('No transaction selected.');
      return;
    }

    if (transaction.fineAmount > 0 && !paid) {
      setError('Please confirm that the fine has been paid.');
      return;
    }

    try {
      await api.post('/api/transactions/payfine', {
        transactionId,
        finePaid: paid,
        remarks
      });
      setSuccess('Payment updated successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Error');
    }
  }

  if (!transactionId) {
    return (
      <div>
        <h2>Pay Fine</h2>
        <p>No transaction selected.</p>
        <p><Link to="/transactions/return">Back to returns</Link></p>
      </div>
    );
  }

  return (
    <div>
      <h2>Pay Fine</h2>
      <div>Transaction ID: {transactionId}</div>
      {transaction && (
        <section>
          <div className="info-grid">
            <div><strong>Book Name:</strong> {transaction.bookId?.title || 'Unknown'}</div>
            <div><strong>Author:</strong> {transaction.bookId?.author || 'Unknown'}</div>
            <div><strong>Issue Date:</strong> {transaction.issueDate ? new Date(transaction.issueDate).toLocaleDateString() : '-'}</div>
            <div><strong>Return Date:</strong> {transaction.actualReturnDate ? new Date(transaction.actualReturnDate).toLocaleDateString() : '-'}</div>
            <div><strong>Fine Amount:</strong> {transaction.fineAmount}</div>
          </div>
        </section>
      )}
      <form onSubmit={submit}>
        <div><label><input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} disabled={transaction?.fineAmount === 0} /> Fine Paid</label></div>
        <div><input value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Remarks" /></div>
        <div className="form-message form-message--error">{error}</div>
        <div className="form-message form-message--success">{success}</div>
        <div><button>Confirm</button></div>
      </form>
    </div>
  );
}
