import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function UpdateBook() {
  const [books, setBooks] = useState([]);
  const [selectedSerial, setSelectedSerial] = useState('');
  const [form, setForm] = useState({
    mediaType: 'book',
    title: '',
    author: '',
    category: '',
    serialNumber: '',
    available: 'Yes'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/api/books')
      .then((response) => setBooks(response.data))
      .catch((err) => setError(err.response?.data?.error || 'Unable to load books.'));
  }, []);

  function handleSelect(serialNumber) {
    setSelectedSerial(serialNumber);
    const book = books.find((item) => item.serialNumber === serialNumber);
    if (!book) return;

    setForm({
      mediaType: book.mediaType || 'book',
      title: book.title || '',
      author: book.author || '',
      category: book.category || '',
      serialNumber: book.serialNumber || '',
      available: book.available ? 'Yes' : 'No'
    });
    setError('');
    setSuccess('');
  }

  function handleChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim() || !form.author.trim() || !form.category.trim() || !form.serialNumber.trim()) {
      setError('All book fields are mandatory.');
      return;
    }

    try {
      await api.put('/api/books', {
        ...form,
        available: form.available === 'Yes'
      });
      setSuccess('Book updated successfully.');
      const response = await api.get('/api/books');
      setBooks(response.data);
      handleSelect(form.serialNumber);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to update book.');
    }
  }

  return (
    <div className="page-stack">
      <div>
        <h2>Update Book</h2>
        <p>Select an existing title by serial number, then update its details.</p>
      </div>

      <div className="control-row">
        <select value={selectedSerial} onChange={(e) => handleSelect(e.target.value)}>
          <option value="">Select serial number</option>
          {books.map((book) => (
            <option key={book._id} value={book.serialNumber}>
              {book.serialNumber} - {book.title}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={submit}>
        <div className="inline-options">
          <label><input type="radio" name="mediaType" checked={form.mediaType === 'book'} onChange={() => handleChange('mediaType', 'book')} /> Book</label>
          <label><input type="radio" name="mediaType" checked={form.mediaType === 'movie'} onChange={() => handleChange('mediaType', 'movie')} /> Movie</label>
        </div>
        <input value={form.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Title" />
        <input value={form.author} onChange={(e) => handleChange('author', e.target.value)} placeholder="Author" />
        <input value={form.category} onChange={(e) => handleChange('category', e.target.value)} placeholder="Category" />
        <input value={form.serialNumber} onChange={(e) => handleChange('serialNumber', e.target.value)} placeholder="Serial Number" />
        <div className="inline-options">
          <label><input type="radio" name="available" checked={form.available === 'Yes'} onChange={() => handleChange('available', 'Yes')} /> Available: Yes</label>
          <label><input type="radio" name="available" checked={form.available === 'No'} onChange={() => handleChange('available', 'No')} /> Available: No</label>
        </div>
        <button>Update Book</button>
      </form>

      {error && <p className="form-message form-message--error">{error}</p>}
      {success && <p className="form-message form-message--success">{success}</p>}
    </div>
  );
}
