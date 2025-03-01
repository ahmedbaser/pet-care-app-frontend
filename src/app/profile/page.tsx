"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { notification, Spin } from "antd";
import { AppDispatch, RootState } from "../redux/store";
import { updateProfile } from "../redux/slices/authSlice";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}


const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData(user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (profileData) {
      setProfileData({
        ...profileData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (profileData) {
      setLoading(true);
      dispatch(updateProfile(profileData))
        .unwrap()
        .then(() => {
          notification.success({
            message: "Success",
            description: "Profile updated successfully",
            placement: "topRight",
          });
        })
        .catch(() => {
          notification.error({
            message: "Error",
            description: "Profile update failed",
            placement: "top",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "55%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
        }}
      >
        <Spin size="default" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          User Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={profileData?.name || ""}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profileData?.email || ""}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={profileData?.phone || ""}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={profileData?.address || ""}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="w-full py-3 px-6 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
