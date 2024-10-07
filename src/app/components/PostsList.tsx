import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost } from '../redux/slices/postSlice';
import Link from 'next/link';

const PostsList = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.posts);

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(id));
    }
  };

  return (
    <div>
      {posts.map((post) => (
        <div key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <Link href={`/post/${post._id}`}>View Details</Link>
          <button onClick={() => handleDelete(post._id)}>Delete</button>
          <Link href={`/post/${post._id}/edit`}>
            <button>Edit</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PostsList;
