import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser } from '../../../redux/slices/userSlice';
import { RootState } from '../../../redux/store';

const AdminUsersPage = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <div>
        {users.map((user) => (
          <div key={user._id} className="border-b py-4">
            <h2 className="text-xl">{user.name}</h2>
            <p>{user.email}</p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => handleDelete(user._id)}
            >
              Delete User
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsersPage;
