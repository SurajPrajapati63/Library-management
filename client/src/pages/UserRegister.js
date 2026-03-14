import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

export default function UserRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Name, email, and password are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (role === 'admin' && !adminCode.trim()) {
      setError('Admin registration code is required');
      return;
    }

    try {
      const res = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        adminCode: role === 'admin' ? adminCode.trim() : undefined
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      nav(res.data.role === 'admin' ? '/admin-home' : '/user-home');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" /></div>
        <div><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" /></div>
        <div><input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" /></div>
        <div><input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" type="password" /></div>
        <div className="inline-options">
          <label><input type="radio" name="role" checked={role === 'user'} onChange={() => setRole('user')} />User</label>
          <label><input type="radio" name="role" checked={role === 'admin'} onChange={() => setRole('admin')} />Admin</label>
        </div>
        {role === 'admin' && (
          <div><input value={adminCode} onChange={(e) => setAdminCode(e.target.value)} placeholder="Admin Registration Code" type="password" /></div>
        )}
        <div><button>Create Account</button></div>
        <div className="form-message form-message--error">{error}</div>
      </form>
      <p>If you are registering as admin, ask an existing admin for the current registration code.</p>
      <p><Link to="/user-login">User login</Link></p>
      <p><Link to="/admin-login">Admin login</Link></p>
    </div>
  );
}
