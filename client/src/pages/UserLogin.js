import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError('');

    try {
      const res = await login({ email, password });
      if (res.data.role !== 'user') {
        setError('Use the admin login page for administrator accounts.');
        return;
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      nav('/user-home');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div>
      <h2>User Login</h2>
      <form onSubmit={submit}>
        <div><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" /></div>
        <div><input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" /></div>
        <div><button>Login</button></div>
        <div className="form-message form-message--error">{error}</div>
      </form>
      <p><Link to="/register">Create a new account</Link></p>
      <p><Link to="/admin-login">Admin login</Link></p>
    </div>
  );
}
