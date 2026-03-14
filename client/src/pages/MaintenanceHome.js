import React from 'react';
import { Link } from 'react-router-dom';

const links = [
  { to: '/maintenance/add-membership', title: 'Add Membership', text: 'Register a new member with a timed membership.' },
  { to: '/maintenance/update-membership', title: 'Update Membership', text: 'Extend or cancel an existing membership by number.' },
  { to: '/maintenance/add-book', title: 'Add Book', text: 'Create a new book or movie inventory record.' },
  { to: '/maintenance/update-book', title: 'Update Book', text: 'Update title, category, serial number, and availability.' },
  { to: '/maintenance/users', title: 'User Management', text: 'Create staff accounts or update an existing user role.' },
  { to: '/maintenance/admin-code', title: 'Admin Registration Code', text: 'Generate a random admin registration code or set a custom one.' }
];

export default function MaintenanceHome() {
  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h2>Maintenance</h2>
          <p>Admin-only controls for members, catalog records, and users.</p>
        </div>
      </div>
      <div className="dashboard__grid">
        {links.map((link) => (
          <article key={link.to} className="dashboard__card">
            <h3>{link.title}</h3>
            <p>{link.text}</p>
            <Link to={link.to}>Open</Link>
          </article>
        ))}
      </div>
    </div>
  );
}
