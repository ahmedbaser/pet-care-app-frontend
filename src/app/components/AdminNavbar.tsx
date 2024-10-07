import React from 'react';
import Link from 'next/link';

const AdminNavbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/admin/profile">Admin Profile</Link>
        </li>
        <li>
          <Link href="/admin/users">Manage Users</Link>
        </li>
        <li>
          <Link href="/admin/posts">Manage Posts</Link>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
