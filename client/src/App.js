import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import UserLogin from './pages/UserLogin';
import AdminHome from './pages/AdminHome';
import UserHome from './pages/UserHome';
import AddMembership from './pages/AddMembership';
import AddBook from './pages/AddBook';
import BookSearch from './pages/BookSearch';
import BookIssue from './pages/BookIssue';
import ReturnBook from './pages/ReturnBook';
import PayFine from './pages/PayFine';

function App(){
  return (
    <div>
      <h1>Library Management System (React)</h1>
      <Routes>
        <Route path='/' element={<UserLogin/>} />
        <Route path='/admin-login' element={<AdminLogin/>} />
        <Route path='/user-login' element={<UserLogin/>} />
        <Route path='/admin-home' element={<AdminHome/>} />
        <Route path='/user-home' element={<UserHome/>} />
        <Route path='/maintenance/add-membership' element={<AddMembership/>} />
        <Route path='/maintenance/add-book' element={<AddBook/>} />
        <Route path='/transactions/search' element={<BookSearch/>} />
        <Route path='/transactions/issue' element={<BookIssue/>} />
        <Route path='/transactions/return' element={<ReturnBook/>} />
        <Route path='/transactions/payfine' element={<PayFine/>} />
      </Routes>
    </div>
  );
}

export default App;
