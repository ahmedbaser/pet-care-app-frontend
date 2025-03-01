'use client';

import React, { useState } from 'react';
import { Input, Button, Typography, Card, Spin } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import api from '@/app/utils/api';

const { Text } = Typography;

const Chatbot: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const data = await api.sendMessageToChatbot(input);
      setResponse(data.response.content);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Failed to fetch response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-2xl shadow-lg rounded-lg p-6 bg-white">
        <div className="flex items-center mb-4">
          <RobotOutlined className="text-2xl text-blue-500 mr-2" />
          <h2 className="text-2xl font-bold">Pet Care Chatbot</h2>
        </div>
        <div className="mb-4">
          <div className="flex items-center p-3 bg-gray-200 rounded-lg">
            <UserOutlined className="text-lg text-gray-700 mr-2" />
            <Text className="text-gray-800">{input || 'Ask me anything about pet care...'}</Text>
          </div>
        </div>
        <Input.TextArea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about pet care..."
          className="mb-4 border-gray-300 shadow-sm"
        />
    <div className='flex justify-center mb-4'>
    <Button 
            type="primary" 
            icon={<SendOutlined />} 
            onClick={handleSendMessage} 
            loading={loading} 
            disabled={!input.trim()}
            className="transition-all  bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 transition-all duration-300 ease-in-out text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg">
            Send
       </Button>
    </div>
   

        {loading && (
          <div className="mt-4 flex justify-center items-center h-32">
            <Spin size="small" />
          </div>
        )}
        {response && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-2">
              <RobotOutlined className="text-lg text-blue-500 mr-2" />
              <Text strong className="text-lg text-gray-700">AI Response:</Text>
            </div>
            <div className="text-gray-600 whitespace-pre-line bg-white p-3 rounded-md shadow-inner">
              {response}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Chatbot;