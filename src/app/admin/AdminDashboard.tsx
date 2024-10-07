import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import { getPosts, updatePostStatus } from '../api/admin'; // Fetch and update post APIs

const AdminDashboard: React.FC = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch all posts
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getPosts();
      setPosts(response.data.posts);
    } catch (error) {
      message.error('Error fetching posts.');
    }
  };

  const handlePublishToggle = async (postId: string, publishStatus: boolean) => {
    try {
      await updatePostStatus(postId, publishStatus);
      message.success(`Post ${publishStatus ? 'published' : 'unpublished'} successfully.`);
      fetchPosts(); // Refresh the posts
    } catch (error) {
      message.error('Error updating post status.');
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <Table dataSource={posts} rowKey="_id">
        <Table.Column title="Title" dataIndex="title" />
        <Table.Column title="Status" dataIndex="published" render={(published) => (published ? 'Published' : 'Unpublished')} />
        <Table.Column
          title="Actions"
          render={(text, record) => (
            <>
              <Button
                type="primary"
                onClick={() => handlePublishToggle(record._id, !record.published)}
              >
                {record.published ? 'Unpublish' : 'Publish'}
              </Button>
            </>
          )}
        />
      </Table>
    </div>
  );
};

export default AdminDashboard;
