import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function BookSearch(){
  const [title,setTitle]=useState('');
  const [author,setAuthor]=useState('');
  const [authors,setAuthors]=useState([]);
  const [rows,setRows]=useState([]);
  const [error,setError]=useState('');
  const nav = useNavigate();

  useEffect(()=>{ axios.get('/api/transactions/books/authors').then(r=>setAuthors(r.data||r)).catch(()=>{}); },[]);

  async function submit(e){
    e.preventDefault();
    if(!title && !author){ setError('Enter book name or select author'); return; }
    try{
      const q = new URLSearchParams({ title, author });
      const res = await axios.get('/api/transactions/books/search?'+q.toString());
      setRows(res.data||res);
    }catch(err){ setError(err.response?.data?.error || 'Error'); }
  }

  return (
    <div>
      <h2>Search Books</h2>
      <form onSubmit={submit}>
        <div><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Book Name"/></div>
        <div>
          <select value={author} onChange={e=>setAuthor(e.target.value)}>
            <option value="">--select--</option>
            {authors.map(a=> <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div style={{color:'red'}}>{error}</div>
        <div><button>Search</button></div>
      </form>
      <div>
        {rows.map(r=> (
          <div key={r._id}>
            {r.title} - {r.author} - Available: {r.available_count} <input name="sel" type="radio" onClick={()=>nav('/transactions/issue',{state:{book_id:r._id}})} />
          </div>
        ))}
      </div>
    </div>
  );
}
