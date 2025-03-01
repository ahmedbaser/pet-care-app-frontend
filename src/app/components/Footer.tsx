"use client";

import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

const Footer: React.FC = () => {

    const pathname = usePathname();
   
     
    const hiddenRoutes = ['/admin', '/dashboard'];
    const shouldHideFooter = hiddenRoutes.includes(pathname);

    if(shouldHideFooter) return null;

  return (
    <footer className="bg-gradient-to-r bg-gray-800 p text-white py-8">
      <div className="w-full px-6 md:px-56 mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
        {/* Logo and Description */}
        <div className="text-center md:text-left">
          <Link href="/" className="text-2xl font-bold tracking-wide hover:text-teal-200 transition duration-200">
            PetCare
          </Link>
          <p className="mt-2 text-sm">
            Empowering you with the best tips and stories for caring for your pets.
          </p>
        </div>

      

        {/* Social Media Links */}
        <div className="flex space-x-4 text-2xl justify-center">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-200 transition duration-200">
            <FaFacebook />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-200 transition duration-200">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-200 transition duration-200">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-200 transition duration-200">
            <FaLinkedin />
          </a>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-8 text-center text-sm">
        &copy; {new Date().getFullYear()} Pet Care Stories. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

