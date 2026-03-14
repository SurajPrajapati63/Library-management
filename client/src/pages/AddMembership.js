import React, { useState } from 'react';
import api from '../services/api';

export default function AddMembership() {
  const [memberName, setMemberName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [duration, setDuration] = useState('6 months');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!memberName.trim() || !address.trim() || !phone.trim() || !email.trim()) {
      setError('All fields mandatory');
      return;
    }

    try {
      await api.post('/api/memberships', {
        memberName: memberName.trim(),
        address: address.trim(),
        phone: phone.trim(),
        email: email.trim(),
        membershipDuration: duration
      });
      setSuccess('Membership added successfully.');
      setMemberName('');
      setAddress('');
      setPhone('');
      setEmail('');
      setDuration('6 months');
    } catch (err) {
      setError(err.response?.data?.error || 'Error');
    }
  }

  return (
    <div>
      <h2>Add Membership</h2>
      <form onSubmit={submit}>
        <div><input value={memberName} onChange={(e) => setMemberName(e.target.value)} placeholder="Member Name" /></div>
        <div><input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" /></div>
        <div><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" /></div>
        <div><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" /></div>
        <div className="inline-options">
          <label><input type="radio" name="dur" value="6 months" checked={duration === '6 months'} onChange={() => setDuration('6 months')} />6 months</label>
          <label><input type="radio" name="dur" value="1 year" checked={duration === '1 year'} onChange={() => setDuration('1 year')} />1 year</label>
          <label><input type="radio" name="dur" value="2 years" checked={duration === '2 years'} onChange={() => setDuration('2 years')} />2 years</label>
        </div>
        <div className="form-message form-message--error">{error}</div>
        <div className="form-message form-message--success">{success}</div>
        <div><button>Add</button></div>
      </form>
    </div>
  );
}
