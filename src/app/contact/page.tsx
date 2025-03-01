'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  
  const [loading, setLoading] = useState(false); 

  // Handle change in input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, 
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true); 

    
    setTimeout(() => {
      // Show success notification
      toast.success('Message sent successfully!', {
        position: "top-center",
        autoClose: 400,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Reset form data after submit
      setFormData({ name: '', email: '', message: '' });
      setLoading(false); 
    }, 2000); 
  };

  return (
    <>
      <Head>
        <title>Contact Us - Pet Care Tips & Stories</title>
        <meta name="description" content="Contact the team at Pet Care Tips & Stories for inquiries or support." />
      </Head>
      <main className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-extrabold leading-tight mb-4 text-white">Contact Us</h1>
          <p className="text-xl mb- text-white">
            We would love to hear from you! Whether you have a question, feedback, or need support, feel free to reach out.
          </p>
        </div>
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full space-y-6 transform transition-all duration-300 hover:scale-105"
          >
            {/* Name Field */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-800 font-semibold mb-2">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter your name"
              />
            </div>

            {/* Email Field */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-800 font-semibold mb-2">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            {/* Message Field */}
            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-800 font-semibold mb-2">Your Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                rows={6}
                placeholder="Write your message here"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-4 text-white text-xl font-semibold rounded-lg transition-all duration-300 ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={loading} // Disable the button while loading
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0l-3-3m3 3l3-3m3 7v-2a9 9 0 10-18 0v2" />
                  </svg>
                  Sending...
                </div>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>

        {/* Toast Container for displaying notifications */}
        <ToastContainer />
      </main>
    </>
  );
};

export default Contact;
