'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchPremiumContent } from '../redux/slices/actionsSlice';
import { RootState, useAppDispatch } from '../redux/store';
import { Card, Typography, Spin, Alert, Tag } from 'antd';
import { CrownOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;



const PremiumContentComponent = () => {
  const dispatch = useAppDispatch();
  const premiumContent = useSelector((state: RootState) => state.action.premiumContent);
  const error = useSelector((state: RootState) => state.action.error);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchPremiumContent());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

 if (loading) {
        return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '55%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
          }}>
            <Spin size="default" /> 
          </div>
        );
      }

  const contentData = premiumContent?.data;

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <Title level={4} className="font-semibold text-center mb-6">
        Premium Content
      </Title>
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="mb-6"
        />
      )}
      {Array.isArray(contentData) && contentData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentData.map((content) => (
            <Card
              key={content._id}
              title={<Title level={4} className="text-lg">{content.title}</Title>}
              className="shadow-md hover:shadow-lg transition-shadow duration-200"
              bodyStyle={{ padding: '16px' }}
            >
              <Paragraph>{content.content}</Paragraph>
              <Paragraph>{content.description}</Paragraph>
              <Paragraph>
                Access Level:
                {content.isPremium ? (
                  <Tag
                    color="gold"
                    icon={<CrownOutlined />}
                    className="ml-2 font-bold text-sm"
                  >
                    Premium
                  </Tag>
                ) : (
                  <span className="ml-2 font-bold text-sm">Free</span>
                )}

              </Paragraph>
            </Card>
          ))}
        </div>
      ) : (
        <Paragraph className="text-center text-gray-600">
          No premium content available
        </Paragraph>
      )}

    </div>
  );
};

export default PremiumContentComponent;
