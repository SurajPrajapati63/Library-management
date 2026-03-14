import React, { useState } from 'react';
import api from '../services/api';

export default function UpdateMembership() {
  const [membershipNumber, setMembershipNumber] = useState('');
  const [membership, setMembership] = useState(null);
  const [action, setAction] = useState('extend');
  const [extendDuration, setExtendDuration] = useState('6 months');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function lookupMembership(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setMembership(null);

    if (!membershipNumber.trim()) {
      setError('Membership Number is required.');
      return;
    }

    try {
      const response = await api.get(`/api/memberships/${membershipNumber.trim()}`);
      setMembership(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load membership.');
    }
  }

  async function submitUpdate(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!membership) {
      setError('Load a membership before updating.');
      return;
    }

    try {
      await api.put('/api/memberships', {
        membershipNumber: membership.membershipNumber,
        action,
        extendDuration
      });
      setSuccess(action === 'cancel' ? 'Membership cancelled.' : 'Membership extended successfully.');
      const response = await api.get(`/api/memberships/${membership.membershipNumber}`);
      setMembership(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to update membership.');
    }
  }

  return (
    <div className="page-stack">
      <div>
        <h2>Update Membership</h2>
        <p>Enter the membership number to load the member details, then extend or cancel it.</p>
      </div>

      <form onSubmit={lookupMembership}>
        <input
          value={membershipNumber}
          onChange={(e) => setMembershipNumber(e.target.value)}
          placeholder="Membership Number"
        />
        <button>Load Membership</button>
      </form>

      {membership && (
        <section>
          <h3>Member Details</h3>
          <div className="info-grid">
            <div><strong>Name:</strong> {membership.memberName}</div>
            <div><strong>Email:</strong> {membership.email}</div>
            <div><strong>Phone:</strong> {membership.phone}</div>
            <div><strong>Address:</strong> {membership.address}</div>
            <div><strong>Start:</strong> {new Date(membership.membershipStartDate).toLocaleDateString()}</div>
            <div><strong>End:</strong> {new Date(membership.membershipEndDate).toLocaleDateString()}</div>
            <div><strong>Status:</strong> {membership.cancelled ? 'Cancelled' : 'Active'}</div>
          </div>

          <form onSubmit={submitUpdate}>
            <div className="inline-options">
              <label><input type="radio" name="membershipAction" checked={action === 'extend'} onChange={() => setAction('extend')} /> Extend membership</label>
              <label><input type="radio" name="membershipAction" checked={action === 'cancel'} onChange={() => setAction('cancel')} /> Cancel membership</label>
            </div>

            {action === 'extend' && (
              <div className="inline-options">
                <label><input type="radio" name="extendDuration" checked={extendDuration === '6 months'} onChange={() => setExtendDuration('6 months')} /> 6 months</label>
                <label><input type="radio" name="extendDuration" checked={extendDuration === '1 year'} onChange={() => setExtendDuration('1 year')} /> 1 year</label>
                <label><input type="radio" name="extendDuration" checked={extendDuration === '2 years'} onChange={() => setExtendDuration('2 years')} /> 2 years</label>
              </div>
            )}

            <button>{action === 'cancel' ? 'Cancel Membership' : 'Extend Membership'}</button>
          </form>
        </section>
      )}

      {error && <p className="form-message form-message--error">{error}</p>}
      {success && <p className="form-message form-message--success">{success}</p>}
    </div>
  );
}
