import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

export default function PayFine(){
  const [params] = useSearchParams();
  const payment_id = params.get('payment_id');
  const [paid,setPaid]=useState(false);
  const [remarks,setRemarks]=useState('');
  const [error,setError]=useState('');

  async function submit(e){
    e.preventDefault();
    try{
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/transactions/payfine',{payment_id,paid,remarks},{headers:{Authorization:'Bearer '+token}});
      alert('Completed');
    }catch(err){ setError(err.response?.data?.error || 'Error'); }
  }

  return (
    <div>
      <h2>Pay Fine</h2>
      <div>Payment ID: {payment_id}</div>
      <form onSubmit={submit}>
        <div><label><input type="checkbox" checked={paid} onChange={e=>setPaid(e.target.checked)} /> Fine Paid</label></div>
        <div><input value={remarks} onChange={e=>setRemarks(e.target.value)} placeholder="Remarks"/></div>
        <div style={{color:'red'}}>{error}</div>
        <div><button>Confirm</button></div>
      </form>
    </div>
  );
}
