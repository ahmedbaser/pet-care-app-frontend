import React, { useState } from 'react';
import { Typography, Input, Select, message, Space, Button } from 'antd';
import api from '../utils/api';

const Title = Typography;
const { TextArea } = Input;
const { Option, OptGroup } = Select;

type Activity = {
  date: string;
  activityType: string;
  details: string;
};

// Grouped predefined options
const categorizedActivityOptions: Record<string, string[]> = {
  Basic: ['Walk', 'Meal', 'Play', 'Sleep'],
  Health: ['Vet Visit', 'Medication', 'Grooming', 'Vaccination'],
  Essentials: ['Toilet', 'Hydration'],
  Behavior: ['Training', 'Socialization'],
  Travel: ['Travel', 'Outdoor Exploration'],
  Misc: ['Check-In', 'Emergency'],
}


const ActivityAnalytics = () => {
  const [activities, setActivities] = useState<Activity[]>([
    { date: '', activityType: '', details: '' },
  ]);


  const [customOptions, setCustomOptions] = useState<string[]>([]);
  const [insights, setInsights] = useState<string | null>(null);

 
  const getAllOptions = (): string[] => {
    const predefined = Object.values(categorizedActivityOptions).flat();
    return [...new Set([...predefined, ...customOptions])];
  }
 
  const handleChange = (index: number, field: keyof Activity, value: string) => {
    const updated = [...activities];
    updated[index][field] = value;
    setActivities(updated);
  };

  const addActivity = () => {
    setActivities([...activities, { date: '', activityType: '', details: '' }]);
  };

  const removeActivity = (index: number) => {
    const updated = [...activities];
    updated.splice(index, 1);
    setActivities(updated);
  };

  const handleActivityTypeChange = (index: number, value: string | string[]) => {
    const selectedValue = Array.isArray(value) ? value[0] : value;
      if(!getAllOptions().includes(selectedValue)) {
        setCustomOptions([...customOptions, selectedValue]);
      }
      handleChange(index, 'activityType', selectedValue)
  }
    
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('this is the token of petAnalytic:', token)
      if(!token) {
        message.error('User not authenticated');
        return;
      }
      const response = await api.PetActivityAnalytics(activities, token);
      message.success('Analytics generated successfully!');
      setInsights(response.data.insights);
    } catch (error: any) {
      message.error(error.message || 'Failed to generate analytics');
      setInsights(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <Title className="text-2xl text-center mb-6 text-gray-700">
          Pet Activity Analytic
        </Title>

        {activities.map((activity, index) => (
          <div key={index} className="mb-6 border-b pb-4">
            <Space direction="vertical" className="w-full">
              <Input
                type="date"
                value={activity.date}
                onChange={(e) => handleChange(index, 'date', e.target.value)}
                placeholder="Date"
              />

             <Select mode='tags'
              value={activity.activityType}
              onChange={(value) => handleActivityTypeChange(index, value)}
              placeholder="Select or type activity type"
              className='w-full'
             >
             
             {/* Render predefined categories */}
             {Object.entries(categorizedActivityOptions).map(([category, options]) => (
                  <OptGroup key={category} label={category}>
                    {options.map((opt) => (
                      <Option key={opt} value={opt}>
                        {opt}
                      </Option>
                    ))}
                  </OptGroup>
                ))}

               {/* Render user-created custom options */}
               {customOptions.length > 0 && (
                  <OptGroup key="Custom" label="Custom">
                     {customOptions.map((opt) => (
                      <Option key={opt} value={opt}>
                        {opt}
                      </Option>
                     ))}
                </OptGroup>
               )} 
            
            </Select>

              <TextArea
                rows={3}
                value={activity.details}
                onChange={(e) => handleChange(index, 'details', e.target.value)}
                placeholder="Activity details"
              />

              {activities.length > 1 && (
                <Button danger onClick={() => removeActivity(index)}>
                  Remove
                </Button>
              )}
            </Space>
          </div>
        ))}

        <div className="flex gap-4 mb-6">
          <Button type="dashed" onClick={addActivity}>
            + Add Another Activity
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            Submit Activities
          </Button>
        </div>

        {insights && (
          <div className="bg-gray-100 p-4 rounded-md shadow-inner">
            <h3 className="text-lg font-semibold mb-2">Generated Insights:</h3>
            <div
              className="whitespace-pre-wrap text-sm"
              dangerouslySetInnerHTML={{
                __html: insights.replace(/\n/g, '<br />'),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityAnalytics;
