import React, { useState } from 'react';
import api from '../services/api';

export default function AddBook() {
  const [mediaType, setMediaType] = useState('book');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [availability, setAvailability] = useState('Yes');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !author.trim() || !category.trim() || !serialNumber.trim()) {
      setError('All fields mandatory');
      return;
    }

    try {
      await api.post('/api/books', {
        mediaType,
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        serialNumber: serialNumber.trim(),
        available: availability === 'Yes'
      });
      setSuccess('Item added successfully.');
      setMediaType('book');
      setTitle('');
      setAuthor('');
      setCategory('');
      setSerialNumber('');
      setAvailability('Yes');
    } catch (err) {
      setError(err.response?.data?.error || 'Error');
    }
  }

  return (
    <div>
      <h2>Add Book</h2>
      <form onSubmit={submit}>
        <div className="inline-options">
          <label><input type="radio" name="mediaType" checked={mediaType === 'book'} onChange={() => setMediaType('book')} />Book</label>
          <label><input type="radio" name="mediaType" checked={mediaType === 'movie'} onChange={() => setMediaType('movie')} />Movie</label>
        </div>
        <div><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" /></div>
        <div><input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" /></div>
        <div><input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" /></div>
        <div><input value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder="Serial Number" /></div>
        <div className="inline-options">
          <label><input type="radio" name="availability" checked={availability === 'Yes'} onChange={() => setAvailability('Yes')} />Availability: Yes</label>
          <label><input type="radio" name="availability" checked={availability === 'No'} onChange={() => setAvailability('No')} />Availability: No</label>
        </div>
        <div className="form-message form-message--error">{error}</div>
        <div className="form-message form-message--success">{success}</div>
        <div><button>Add</button></div>
      </form>
    </div>
  );
}
