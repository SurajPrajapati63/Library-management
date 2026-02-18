import React, { useState } from 'react';
import axios from 'axios';

export default function ReturnBook(){
  const [transaction_id,setTransaction]=useState('');
  const [return_date,setReturn]=useState(new Date().toISOString().slice(0,10));
  const [error,setError]=useState('');
  
  async function submit(e){
    e.preventDefault();
    if(!transaction_id||!return_date){ setError('Missing fields'); return; }
    try{
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/transactions/return',{transaction_id,actual_return_date:return_date},{headers:{Authorization:'Bearer '+token}});
      const data = res.data || res;
      // redirect to pay fine
      window.location = '/transactions/payfine?payment_id=' + data.payment_id;
    }catch(err){ setError(err.response?.data?.error || 'Error'); }
  }

  return (
    <div>
      <h2>Return Book</h2>
      <form onSubmit={submit}>
        <div><input value={transaction_id} onChange={e=>setTransaction(e.target.value)} placeholder="Transaction ID"/></div>
        <div><input type="date" value={return_date} onChange={e=>setReturn(e.target.value)} /></div>
        <div style={{color:'red'}}>{error}</div>
        <div><button>Return</button></div>
      </form>
    </div>
  );
}
