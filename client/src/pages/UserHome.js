import React from 'react';
import { Link } from 'react-router-dom';

export default function UserHome(){
  return (
    <div>
      <h2>User Home</h2>
      <ul>
        <li><Link to="/transactions/search">Transactions</Link></li>
        <li><Link to="/reports">Reports</Link></li>
      </ul>
    </div>
  );
}
