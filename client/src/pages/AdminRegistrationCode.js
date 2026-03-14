import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminRegistrationCode() {
  const [currentCode, setCurrentCode] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadCode() {
    try {
      const response = await api.get('/api/settings/admin-registration-code');
      setCurrentCode(response.data.code || '');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load admin registration code.');
    }
  }

  useEffect(() => {
    loadCode();
  }, []);

  async function saveManualCode(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!manualCode.trim()) {
      setError('Enter a code before saving.');
      return;
    }

    try {
      const response = await api.put('/api/settings/admin-registration-code', {
        code: manualCode.trim()
      });
      setCurrentCode(response.data.code || '');
      setManualCode('');
      setSuccess('Admin registration code updated.');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to update code.');
    }
  }

  async function generateRandomCode() {
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/api/settings/admin-registration-code/generate');
      setCurrentCode(response.data.code || '');
      setManualCode('');
      setSuccess('Random admin registration code generated.');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to generate code.');
    }
  }

  return (
    <div className="page-stack">
      <div>
        <h2>Admin Registration Code</h2>
        <p>Use this screen to view the current code, generate a random code, or set a new one manually.</p>
      </div>

      <section>
        <h3>Current Code</h3>
        <input value={currentCode} readOnly placeholder="No code configured" />
        <button type="button" onClick={generateRandomCode}>Generate Random Code</button>
      </section>

      <section>
        <h3>Set Custom Code</h3>
        <form onSubmit={saveManualCode}>
          <input
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Enter custom admin registration code"
          />
          <button>Save Code</button>
        </form>
      </section>

      {error && <p className="form-message form-message--error">{error}</p>}
      {success && <p className="form-message form-message--success">{success}</p>}
    </div>
  );
}
