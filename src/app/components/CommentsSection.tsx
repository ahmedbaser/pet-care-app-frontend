'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { Button, Input, List, Avatar, Card, Popconfirm, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { createComment, deleteComment, editComment, replyComment } from '../redux/slices/actionsSlice';

const { TextArea } = Input;

export interface Comment {
  _id: string;
  content: string;
  userName: string;  
  replies?: Comment[];
}

interface CommentsSectionProps {
  postId: string;
  comments: Comment[];
  addComment: (newComment: Comment) => void;
  addReply: (commentId: string, newReply: Comment) => void;

}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId, comments: initialComments,}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  const updateLocalComments = (updatedComment: Comment | null, action: 'add' | 'edit' | 'delete' | 'reply', commentId?: string) => {
    setComments((prevComments) => {
      switch (action) {
        case 'add':
          return [...prevComments, updatedComment as Comment];
        case 'edit':
          return prevComments.map((c) => (c._id === commentId ? { ...c, content: editingText } : c));
        case 'delete':
          return prevComments.filter((c) => c._id !== commentId);
        case 'reply':
          return prevComments.map((c) =>
            c._id === commentId ? { ...c, replies: [...(c.replies || []), updatedComment as Comment] } : c
          );
        default:
          return prevComments;
      }
    });
  };

  
  
  const handleCommentSubmit = () => {
    if (!comment) return;
    setSubmitting(true);
  
    dispatch(createComment({ postId, comment }))
      .unwrap()
      .then((response) => {
        console.log("Full response:", response); 
        
        const newComment: Comment = {
          _id: response._id,
          content: response.content,
          userName: response.author?.name || 'Unknown', 
          replies: response.replies || []
        };
  
        updateLocalComments(newComment, 'add');
        setComment('');
        message.success('Comment added successfully!');
      })
      .catch((error) => {
        console.error("Error adding comment:", error); 
        message.error('Failed to add comment.');
      })
      .finally(() => setSubmitting(false));
  };
  
  
  const handleEditSubmit = () => {
    if (!editingText.trim() || !editingCommentId) return;
    dispatch(editComment({ commentId: editingCommentId, updatedComment: editingText }))
      .unwrap()
      .then(() => {
        updateLocalComments(null, 'edit', editingCommentId);
        setEditingCommentId(null);
        setEditingText('');
        message.success('Comment updated successfully!');
      })
      .catch(() => {
        message.error('Failed to update comment.');
      });
  };

  const handleDelete = (commentId: string) => {
    dispatch(deleteComment(commentId))
      .unwrap()
      .then(() => {
        updateLocalComments(null, 'delete', commentId);
        message.success('Comment deleted successfully!');
      })
      .catch(() => {
        message.error('Failed to delete comment.');
      });
  };


  
  


  const handleReplySubmit = (commentId: string) => {
    if (!replyText.trim()) return;
  
    dispatch(replyComment({ commentId, reply: replyText }))
      .unwrap()
      .then((response) => {
        const newReply: Comment = {
          _id: response.reply._id, 
          content: replyText,
          userName: response.reply.userName, 
          replies: []
        };
  
        updateLocalComments(newReply, 'reply', commentId);
        setReplyingCommentId(null);
        setReplyText('');
        message.success('Reply added successfully!');
      })
      .catch(() => {
        message.error('Failed to add reply.');
      });
  };
  

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      <div className="mb-4">
        <TextArea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
          className="mb-2"
        />
        <Button
          type="primary"
          onClick={handleCommentSubmit}
          loading={submitting}
          disabled={!comment.trim()}
        >
          Submit Comment
        </Button>
      </div>

      <List
        className="mt-4"
        dataSource={comments}
        header={`${comments.length} comment(s)`}
        itemLayout="horizontal"
        renderItem={(comment) => {
          const commentId = comment._id;
          return (
            <Card key={commentId} className="mb-2">
              <List.Item
                actions={[
                  editingCommentId === commentId ? (
                    <Button
                      key="save"
                      type="primary"
                      onClick={handleEditSubmit}
                      disabled={!editingText.trim()}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button type="link" onClick={() => setEditingCommentId(commentId)}>
                      Edit
                    </Button>
                  ),
                  <Popconfirm
                    key="delete"
                    title="Are you sure you want to delete this comment?"
                    onConfirm={() => handleDelete(commentId)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="link" danger>
                      Delete
                    </Button>
                  </Popconfirm>,
                  <Button 
                    key="reply"
                    type="link" onClick={() => setReplyingCommentId(commentId)}>
                    Reply
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    editingCommentId === commentId ? (
                      <Input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        placeholder="Edit comment"
                      />
                    ) : (
                      <div>
                        <strong>{comment.userName}</strong>: {comment.content}
                      </div>
                    )
                  }
                />
              </List.Item>

              {/* Reply Input Field */}
              {replyingCommentId === commentId && (
                <div style={{ marginLeft: 40, marginTop: 8 }}>
                  <Input.TextArea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                  />
                  <Button
                    type="primary"
                    onClick={() => handleReplySubmit(commentId)}
                    disabled={!replyText.trim()}
                    style={{ marginTop: 4 }}
                  >
                    Submit Reply
                  </Button>
                </div>
              )}

              {/* Display Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <List
                  className="ml-10 mt-2"
                  dataSource={comment.replies}
                  renderItem={(reply: Comment) => (
                    <List.Item key={reply._id}>
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={
                          <div>
                            <strong>{reply.userName}</strong>: {reply.content}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          );
        }}
      />
    </div>
  );
};

export default CommentsSection;














