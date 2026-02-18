import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function BookIssue(){
  const loc = useLocation();
  const book_id = loc.state?.book_id;
  const [membership_id,setMembership]=useState('');
  const [issue_date,setIssue]=useState(new Date().toISOString().slice(0,10));
  const [return_date,setReturn]=useState(new Date(Date.now()+15*24*3600*1000).toISOString().slice(0,10));
  const [error,setError]=useState('');

  async function submit(e){
    e.preventDefault();
    if(!book_id||!membership_id||!issue_date||!return_date){ setError('Missing fields'); return; }
    try{
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/transactions/issue',{book_id,membership_id,issue_date,return_date},{headers:{Authorization:'Bearer '+token}});
      alert('Issued');
    }catch(err){ setError(err.response?.data?.error || 'Error'); }
  }

  return (
    <div>
      <h2>Issue Book</h2>
      <form onSubmit={submit}>
        <div>Book ID: {book_id}</div>
        <div><input value={membership_id} onChange={e=>setMembership(e.target.value)} placeholder="Membership ID"/></div>
        <div><input type="date" value={issue_date} onChange={e=>setIssue(e.target.value)} /></div>
        <div><input type="date" value={return_date} onChange={e=>setReturn(e.target.value)} /></div>
        <div style={{color:'red'}}>{error}</div>
        <div><button>Issue</button></div>
      </form>
    </div>
  );
}
