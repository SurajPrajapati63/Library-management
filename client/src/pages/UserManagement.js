import React, { useState } from 'react';
import api from '../services/api';

const initialCreateForm = {
  mode: 'new',
  name: '',
  email: '',
  role: 'user',
  password: ''
};

const initialUpdateForm = {
  mode: 'existing',
  name: '',
  email: '',
  role: 'user'
};

export default function UserManagement() {
  const [mode, setMode] = useState('new');
  const [createForm, setCreateForm] = useState(initialCreateForm);
  const [updateForm, setUpdateForm] = useState(initialUpdateForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function updateCreate(field, value) {
    setCreateForm((current) => ({ ...current, [field]: value }));
  }

  function updateExisting(field, value) {
    setUpdateForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (mode === 'new') {
        if (!createForm.name.trim() || !createForm.email.trim()) {
          setError('Name and email are required.');
          return;
        }

        await api.post('/api/users', {
          name: createForm.name.trim(),
          email: createForm.email.trim(),
          role: createForm.role,
          password: createForm.password || undefined
        });
        setSuccess('User created successfully.');
        setCreateForm(initialCreateForm);
      } else {
        if (!updateForm.email.trim() || !updateForm.name.trim()) {
          setError('Name and email are required.');
          return;
        }

        await api.put('/api/users', {
          name: updateForm.name.trim(),
          email: updateForm.email.trim(),
          role: updateForm.role
        });
        setSuccess('User updated successfully.');
        setUpdateForm(initialUpdateForm);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to save user.');
    }
  }

  return (
    <div className="page-stack">
      <div>
        <h2>User Management</h2>
        <p>Create a new user or update the role and name for an existing user account.</p>
      </div>

      <div className="inline-options">
        <label><input type="radio" name="userMode" checked={mode === 'new'} onChange={() => setMode('new')} /> New User</label>
        <label><input type="radio" name="userMode" checked={mode === 'existing'} onChange={() => setMode('existing')} /> Existing User</label>
      </div>

      <form onSubmit={submit}>
        {mode === 'new' ? (
          <>
            <input value={createForm.name} onChange={(e) => updateCreate('name', e.target.value)} placeholder="Name" />
            <input value={createForm.email} onChange={(e) => updateCreate('email', e.target.value)} placeholder="Email" type="email" />
            <input value={createForm.password} onChange={(e) => updateCreate('password', e.target.value)} placeholder="Password (optional)" type="password" />
            <div className="inline-options">
              <label><input type="radio" name="createRole" checked={createForm.role === 'user'} onChange={() => updateCreate('role', 'user')} /> User</label>
              <label><input type="radio" name="createRole" checked={createForm.role === 'admin'} onChange={() => updateCreate('role', 'admin')} /> Admin</label>
            </div>
          </>
        ) : (
          <>
            <input value={updateForm.email} onChange={(e) => updateExisting('email', e.target.value)} placeholder="Email" type="email" />
            <input value={updateForm.name} onChange={(e) => updateExisting('name', e.target.value)} placeholder="Name" />
            <div className="inline-options">
              <label><input type="radio" name="updateRole" checked={updateForm.role === 'user'} onChange={() => updateExisting('role', 'user')} /> User</label>
              <label><input type="radio" name="updateRole" checked={updateForm.role === 'admin'} onChange={() => updateExisting('role', 'admin')} /> Admin</label>
            </div>
          </>
        )}
        <button>{mode === 'new' ? 'Create User' : 'Update User'}</button>
      </form>

      {error && <p className="form-message form-message--error">{error}</p>}
      {success && <p className="form-message form-message--success">{success}</p>}
    </div>
  );
}
