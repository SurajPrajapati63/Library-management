import React, { useState } from 'react';
import axios from 'axios';

export default function AddMembership(){
  const [name,setName]=useState('');
  const [address,setAddress]=useState('');
  const [contact,setContact]=useState('');
  const [email,setEmail]=useState('');
  const [duration,setDuration]=useState('6 months');
  const [error,setError]=useState('');

  async function submit(e){
    e.preventDefault();
    if(!name||!address||!contact||!email){ setError('All fields mandatory'); return; }
    try{
      const token = localStorage.getItem('token');
      await axios.post('/api/maintenance/memberships',{name,address,contact,email,duration},{headers:{Authorization:'Bearer '+token}});
      alert('Membership added');
    }catch(err){ setError(err.response?.data?.error || 'Error'); }
  }

  return (
    <div>
      <h2>Add Membership</h2>
      <form onSubmit={submit}>
        <div><input value={name} onChange={e=>setName(e.target.value)} placeholder="Name"/></div>
        <div><input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Address"/></div>
        <div><input value={contact} onChange={e=>setContact(e.target.value)} placeholder="Contact"/></div>
        <div><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"/></div>
        <div>
          <label><input type="radio" name="dur" value="6 months" checked={duration==='6 months'} onChange={()=>setDuration('6 months')} />6 months</label>
          <label><input type="radio" name="dur" value="1 year" checked={duration==='1 year'} onChange={()=>setDuration('1 year')} />1 year</label>
          <label><input type="radio" name="dur" value="2 years" checked={duration==='2 years'} onChange={()=>setDuration('2 years')} />2 years</label>
        </div>
        <div style={{color:'red'}}>{error}</div>
        <div><button>Add</button></div>
      </form>
    </div>
  );
}
