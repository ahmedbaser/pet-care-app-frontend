'use client';

import React, { useState } from 'react';
import { Form, InputNumber, Button, Typography, message, Spin } from 'antd';
import { generatePetNutritionPDF } from '../utils/api';
import { useSearchParams } from 'next/navigation';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

const { Title } = Typography;

const PetNutritionCalculator: React.FC = () => {
  const [age, setAge] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(false); 
  const token = useSelector((state: RootState) => state.auth.token);
  const searchParams = useSearchParams();
  const source = searchParams.get('source')

  if (!token) {
    console.error('Token is missing');
    return null;
  }

  const handleGeneratePDF = async () => {
    if (age === null || weight === null) {
      message.error('Please fill in both fields');
      return;
    }

    setLoading(true); 
    try {
      await generatePetNutritionPDF(age, weight, token);
      message.success('PDF generated successfully!');
    } catch {
      message.error('Failed to generate PDF');
    } finally {
      setLoading(false); 
    }
  };

  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: source === 'navbar' ? '50%' : '55%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
        }}>
        <Spin size="default" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <Title level={2} className="text-2xl text-center mb-6 text-gray-700">
          Pet Nutrition Calculator
        </Title>
        <Form layout="vertical">
          <Form.Item label="Pet Age (years)" required>
            <InputNumber
              value={age}
              onChange={(value) => setAge(value)}
              min={0}
              placeholder="Enter pet age"
              className="w-full"
            />
          </Form.Item>
          <Form.Item label="Pet Weight (kg)" required>
            <InputNumber
              value={weight}
              onChange={(value) => setWeight(value)}
              min={0}
              placeholder="Enter pet weight"
              className="w-full"
            />
          </Form.Item>
          <Form.Item>
            <Button
              onClick={handleGeneratePDF}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Generate PDF
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default PetNutritionCalculator;











