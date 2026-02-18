import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminHome(){
  return (
    <div>
      <h2>Admin Home</h2>
      <ul>
        <li><Link to="/maintenance/add-membership">Maintenance - Add Membership</Link></li>
        <li><Link to="/maintenance/add-book">Maintenance - Add Book</Link></li>
        <li><Link to="/transactions/search">Transactions</Link></li>
        <li><Link to="/reports">Reports</Link></li>
      </ul>
    </div>
  );
}
