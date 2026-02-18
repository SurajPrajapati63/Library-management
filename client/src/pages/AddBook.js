import React, { useState } from 'react';
import axios from 'axios';

export default function AddBook(){
  const [type,setType]=useState('book');
  const [title,setTitle]=useState('');
  const [author,setAuthor]=useState('');
  const [serial,setSerial]=useState('');
  const [count,setCount]=useState(0);
  const [error,setError]=useState('');

  async function submit(e){
    e.preventDefault();
    if(!title||!author||!serial||count===undefined){ setError('All fields mandatory'); return; }
    try{
      const token = localStorage.getItem('token');
      await axios.post('/api/maintenance/books',{title,author,serial_no:serial,available_count:count,type},{headers:{Authorization:'Bearer '+token}});
      alert('Added');
    }catch(err){ setError(err.response?.data?.error || 'Error'); }
  }

  return (
    <div>
      <h2>Add Book/Movie</h2>
      <form onSubmit={submit}>
        <div>
          <select value={type} onChange={e=>setType(e.target.value)}>
            <option value="book">Book</option>
            <option value="movie">Movie</option>
          </select>
        </div>
        <div><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title"/></div>
        <div><input value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Author"/></div>
        <div><input value={serial} onChange={e=>setSerial(e.target.value)} placeholder="Serial No"/></div>
        <div><input type="number" value={count} onChange={e=>setCount(parseInt(e.target.value||0))} /></div>
        <div style={{color:'red'}}>{error}</div>
        <div><button>Add</button></div>
      </form>
    </div>
  );
}
