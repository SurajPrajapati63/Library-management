import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin(){
  const [name,setName]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const nav = useNavigate();
  async function submit(e){
    e.preventDefault();
    try{
      const res = await axios.post('/api/auth/login',{name,password});
      localStorage.setItem('token', res.data.token);
      if(res.data.role==='admin') nav('/admin-home'); else nav('/user-home');
    }catch(err){ setError(err.response?.data?.error || 'Login failed'); }
  }
  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={submit}>
        <div><input value={name} onChange={e=>setName(e.target.value)} placeholder="Name"/></div>
        <div><input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password"/></div>
        <div><button>Login</button></div>
        <div style={{color:'red'}}>{error}</div>
      </form>
    </div>
  );
}
