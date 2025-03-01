'use client';

import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import { useRouter, usePathname } from 'next/navigation';
import { FaUserCircle, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Routes where the navbar is hidden when logged in
  const hiddenRoutes = ['/admin', '/dashboard'];
  const shouldHideNavbar = isAuthenticated && pathname && hiddenRoutes.includes(pathname);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  // Conditionally render Navbar
  if (shouldHideNavbar) return null;
  return (
    <nav className="bg-gradient-to-r bg-gray-800  shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="text-white text-2xl font-bold tracking-wide">
          <span className="hover:text-teal-200 transition duration-200">PetCare</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {/* Public Links */}
         <Link href={{pathname:"/newsFeed", query:{ source: "navbar"}}} className="block text-white hover:text-teal-200 transition duration-200">
            News Feed
          </Link> 
          <Link href="/about" className="text-white hover:text-teal-200 transition duration-200">
            About Us
          </Link>
          <Link href="/contact" className="text-white hover:text-teal-200 transition duration-200">
            Contact Us
          </Link>

          {/* Conditional Links */}
          {isAuthenticated ? (
            <>
              {/* Authenticated Links */}
              <Link href="/profile" className="text-white hover:text-teal-200 transition duration-200 flex items-center">
                <FaUserCircle className="mr-1" />
                {user?.name || 'Profile'}
              </Link>

              {user?.isAdmin ? (
                <Link href="/admin" className="text-white hover:text-teal-200 transition duration-200">
                  Admin Dashboard
                </Link>
              ) : (
                <Link href="/dashboard" className="text-white hover:text-teal-200 transition duration-200">
                  User Dashboard
                </Link>
              )}

              <button onClick={handleLogout} className="flex items-center text-white hover:text-red-400 transition duration-200">
                <FaSignOutAlt className="mr-1" />
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Guest Links */}
              <Link href="/auth/login" className="text-white hover:text-teal-200 transition duration-200">
                Login
              </Link>
              <Link href="/auth/register" className="text-white hover:text-teal-200 transition duration-200">
                Register
              </Link>
             
              <Link href="/auth/forgot-password" className="block text-white hover:text-teal-200 transition duration-200">
                Forgot-Password
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white hover:text-teal-200 transition duration-200"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <AiOutlineClose size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-blue-600 rounded-lg shadow-lg p-4 space-y-3">
          <Link href={{pathname:"/newsFeed", query:{ source: "navbar"}}} className="block text-white hover:text-teal-200 transition duration-200">
            News Feed
          </Link> 

          <Link href="/about" className="block text-white hover:text-teal-200 transition duration-200">
            About Us
          </Link>
          <Link href="/contact" className="block text-white hover:text-teal-200 transition duration-200">
            Contact Us
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/profile" className="block text-white hover:text-teal-200 transition duration-200">
                Profile
              </Link>
              {user?.isAdmin ? (
                <Link href="/admin" className="block text-white hover:text-teal-200 transition duration-200">
                  Admin Dashboard
                </Link>
              ) : (
                <Link href="/dashboard" className="block text-white hover:text-teal-200 transition duration-200">
                  User Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="block text-white hover:text-red-400 transition duration-200">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="block text-white hover:text-teal-200 transition duration-200">
                Login
              </Link>
              <Link href="/auth/register" className="block text-white hover:text-teal-200 transition duration-200">
                Register
              </Link>
             
              <Link href="/auth/forgot-password" className="block text-white hover:text-teal-200 transition duration-200">
                Forgot-Password
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;












