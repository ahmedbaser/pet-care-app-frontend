import React from 'react';
import Link from 'next/link';

const AdminNavbar = () => {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/admin" className="hover:text-blue-400">
            Admin Dashboard
          </Link>
        </div>
        <ul className="flex space-x-8">
          <li>
            <Link href="/admin/profile" className="hover:text-blue-400 transition-colors duration-200">
              Admin Profile
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className="hover:text-blue-400 transition-colors duration-200">
              Manage Users
            </Link>
          </li>
          <li>
            <Link href="/admin/posts" className="hover:text-blue-400 transition-colors duration-200">
              Manage Posts
            </Link>
          </li>
          <li>
          <Link href="/admin/payments" className="text-white">
            Payments History
          </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;








