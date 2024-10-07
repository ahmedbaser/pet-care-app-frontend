import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { updateProfile } from '../../../redux/slices/authSlice';
import { useRouter } from 'next/router';

const AdminProfilePage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(updateProfile(profileData));
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            disabled
          />
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            name="phone"
            value={profileData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            value={profileData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default AdminProfilePage;
