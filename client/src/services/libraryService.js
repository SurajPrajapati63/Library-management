import api from './api';

export function searchBooks(params) {
  return api.get('/api/books/search', { params });
}

export function createBook(payload) {
  return api.post('/api/books', payload);
}

export function updateBook(payload) {
  return api.put('/api/books', payload);
}

export function createMembership(payload) {
  return api.post('/api/memberships', payload);
}

export function updateMembership(payload) {
  return api.put('/api/memberships', payload);
}

export function issueBook(payload) {
  return api.post('/api/transactions/issue', payload);
}

export function returnBook(payload) {
  return api.post('/api/transactions/return', payload);
}

export function payFine(payload) {
  return api.post('/api/transactions/payfine', payload);
}

export function fetchReports() {
  return api.get('/api/reports');
}
