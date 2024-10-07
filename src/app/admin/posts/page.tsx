import { deletePost, fetchPosts } from '@/app/redux/slices/postSlice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchPosts, deletePost } from '../../../redux/slices/postSlice';
// import { RootState } from '../../../redux/store';

const AdminPostsPage = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state: RootState) => state.post);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(id));
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Posts</h1>
      <div>
        {posts.map((post) => (
          <div key={post._id} className="border-b py-4">
            <h2 className="text-xl">{post.title}</h2>
            <p>{post.content}</p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => handleDelete(post._id)}
            >
              Delete Post
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPostsPage;
