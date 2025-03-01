'use client';

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Divider,
  Spin,
  message,
  Button,
  Row,
  Col,
  Tooltip,
  Tag,
} from 'antd';
import { Post } from '@/app/redux/slices/postSlice';
import { LikeOutlined, DislikeOutlined, CrownOutlined } from '@ant-design/icons';
import CommentsSection, { Comment } from '@/app/components/CommentsSection';
import PaymentComponent from '@/app/user/PaymentComponent';
import { RootState } from '@/app/redux/store';
import { useSelector } from 'react-redux';
import api from '@/app/utils/api';

const { Title, Paragraph, Text } = Typography;

// Function to strip HTML tags
function stripHtmlTags(content: string) {
  return content.replace(/<\/?[^>]+(>|$)/g, "");
}

interface PostPageParams {
  params: {
    id: string;
  };
}

const PostPage = ({ params }: PostPageParams) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const { id } = params;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [showFullContent, setShowFullContent] = useState(false);
  const [isPaymentComponentVisible, setPaymentComponentVisible] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await api.fetchPostById(id);
        setPost(postData);
        setUpvotes(postData.upvotes);
        setDownvotes(postData.downvotes);

        const commentsData = await api.fetchCommentsByPostId(id);
        setComments(commentsData);
      } catch {
        message.error('Failed to fetch the post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleUpvote = async () => {
    if (!token) {
      message.error('Authentication token is missing. Please log in.');
      return;
    }
    await api.upvotePost(id, token);
    setUpvotes((prev) => prev + 1);
  };

  const handleDownvote = async () => {
    if (!token) {
      message.error('Authentication token is missing. Please log in.');
      return;
    }
    await api.downvotePost(id, token);
    setDownvotes((prev) => prev + 1);
  };

  const handlePaymentSuccess = () => {
    setShowFullContent(true);
    setPaymentComponentVisible(false);
  };

  const addComment = (newComment: Comment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  const addReply = (commentId: string, newReply: Comment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === commentId
          ? { ...comment, replies: [...(comment.replies || []), newReply] }
          : comment
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Loading..." size="small" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-8 text-center">
        <Title level={4}>Post not found</Title>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-50 shadow-lg rounded-lg transition-all">
      <Title level={2} className="text-3xl font-semibold text-gray-800">
        {post.title}
      </Title>
      <Text type="secondary" className="block text-lg">
        By: {post.author._id}
      </Text>
      <Divider />
      <div className="mb-4">
        <Text type="secondary" className="text-sm">
          Category: {post.category}
        </Text>
        {post.isPremium && (
          <Tag
            color="gold"
            icon={<CrownOutlined />}
            className="ml-4 font-bold text-sm"
          >
            Premium
          </Tag>
        )}
      </div>

      {post.isPremium && !showFullContent ? (
        <div className="my-6 text-center">
          <Paragraph className="text-lg text-gray-700">
            {post.previewContent ? stripHtmlTags(post.previewContent) : 'This is premium content. Purchase to access.'}
          </Paragraph>
         
          <Button
            type="primary"
            size="large"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg rounded-md hover:scale-105 transition-transform"
            onClick={() => setPaymentComponentVisible(true)}
          >
            Unlock Full Content
          </Button>
        </div>
      ) : (
        <Paragraph className="text-lg text-gray-800">{stripHtmlTags(post.content)}</Paragraph>
      )}

      {isPaymentComponentVisible && (
        <PaymentComponent postId={post._id} userId={post.author._id} onSuccess={handlePaymentSuccess} />
      )}

      <Row gutter={[16, 16]} className="my-6">
        <Col>
          <Tooltip title="Upvote this post">
            <Button
              icon={<LikeOutlined />}
              onClick={handleUpvote}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-200"
            >
              Upvote ({upvotes})
            </Button>
          </Tooltip>
        </Col>
        <Col>
          <Tooltip title="Downvote this post">
            <Button
              icon={<DislikeOutlined />}
              onClick={handleDownvote}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-200"
            >
              Downvote ({downvotes})
            </Button>
          </Tooltip>
        </Col>
      </Row>

      <Divider />
      <CommentsSection
        postId={post._id}
        comments={comments}
        addComment={addComment}
        addReply={addReply}
      />
    </div>
  );
};

export default PostPage;
