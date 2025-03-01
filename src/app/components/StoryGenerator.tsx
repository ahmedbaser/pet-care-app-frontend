'use client'; 




import React, { useState } from 'react';
import { Input, Button, Typography, Card, Spin, message, Tooltip } from 'antd';
import api from '../utils/api';

const { Text } = Typography;

const StoryGenerator: React.FC = () => {
  const [petType, setPetType] = useState('');
  const [petName, setPetName] = useState('');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateStory = async () => {
    if (!petType.trim() || !petName.trim()) {
      message.error('Please provide both pet type and name.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.generatePetStory(petType, petName);
      setStory(response.story);
    } catch (error) {
      console.error('Error generating story:', error);
      message.error('Failed to generate story. Please try again.');
      setStory('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-8 bg-white">
        <h2 className="text-2xl font-semibold mb-6 text-center">AI-Powered Pet Story Generator</h2>
        
        <div className="mb-6 space-y-4">
          <Input
            placeholder="Enter pet type (e.g., dog, cat)"
            value={petType}
            onChange={(e) => setPetType(e.target.value)}
            className="input-field"
            size="large"
            autoFocus
            maxLength={30}
            style={{ width: '100%' }}
          />
          <Input
            placeholder="Enter pet name"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            className="input-field"
            size="large"
            maxLength={30}
            style={{ width: '100%' }}
          />
        </div>

        <div className="flex justify-center mb-6">
          <Tooltip title="Generate your custom pet story">
            <Button
              type="primary"
              onClick={handleGenerateStory}
              loading={loading}
              disabled={!petType.trim() || !petName.trim()}
              size="large"
              className="transition-all  bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 transition-all duration-300 ease-in-out text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg"
            >
              Generate Story
            </Button>
          </Tooltip>
        </div>

        {loading && (
          <div className="flex justify-center mb-4">
            <Spin size="large" />
          </div>
        )}

        {story && (
          <div className="mt-6 p-4 border-t-2 border-gray-200">
            <Text strong className="text-lg mb-2 text-blue-600">Generated Story:</Text>
            <p className="transition-all">{story}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default StoryGenerator;
