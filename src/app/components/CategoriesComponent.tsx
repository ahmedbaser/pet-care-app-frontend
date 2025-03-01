'use client';

import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Card, Alert, Spin } from 'antd'; 
import { AppstoreOutlined } from '@ant-design/icons'; 

const CategoriesComponent = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Categories</h1>

      {/* Show loading spinner while fetching data */}
      {loading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <>
        
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          {/* Display categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card
                key={category}
                title={category}
                bordered={false}
                hoverable
                className="shadow-lg"
                bodyStyle={{ padding: '16px' }}
              >
                <AppstoreOutlined className="text-3xl text-blue-500" />
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoriesComponent;

