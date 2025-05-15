import React, { useState } from 'react'
import { PetCareRecommendationData } from '../AIModel/PetCareRecommendation '
import { Button, Input, message, Select, Space, Typography } from 'antd'
import api from '../utils/api'




const {Title} = Typography;
const { TextArea } = Input;

const activityLevelOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'High', value: 'high' },
];


const PetCareRecommendation = () => {
    
   const[petData, setPetDate] = useState<PetCareRecommendationData>({
      petType: '',
      petAge: 0,
      petHealthConcerns: '',
      petDietPreferences: '',
      activityLevel: '',
      weight: '',
      location: '',
      customInputs: {},
 })

  //  PetImageRecognition 
  const [customFields, setCustomFields] = useState<string[]>([])
  const [result, setResult] = useState<string | null>(null);

  const handleChange = (field: keyof PetCareRecommendationData, value: string | number) => {
      setPetDate({...petData, [field]: value})
  }


  const handleCustomInputChange = (field: keyof typeof petData.customInputs, value: string | number) => {
    setPetDate({...petData,
        customInputs: {
            ...petData.customInputs,
            [field]: value
        }
    });
  }
  const  addCustomField = () => {
    const newFieldKey = prompt("Enter custom health field name");
    if(newFieldKey && !petData.customInputs[newFieldKey]) {
        setPetDate(prev => ({
            ...prev,
            customInputs: {
            ...prev.customInputs,
            [newFieldKey]: ""
           } 
        }));
       setCustomFields([...customFields, newFieldKey]) 
    } else {
        message.warning('Invalid or duplicate field name')
    }
  };

  const handleSubmit = async () => {
    try {
        const token = localStorage.getItem('token');
        if(!token) {
            message.error('User is not authenticated');
            return;
        }
       const response = await api.RecommendationPetCare(petData, token);
       message.success('Pet care recommendation generate successfully');
       setResult(response.suggestion || 'No pet care recommendation returned') 
    } catch (error) {
      if(error instanceof Error) {
        message.error(error.message)
      } else {
        message.error('Failed to generate pet care recommendation')
     }
    }
  }


  return (

    <div className='flex items-center justify-center min-h-screen bg-green-100'>
      <div className='w-full max-w-xl p-8 bg-white rounded-lg shadow-md'>
        <Title level={2} className='text-center text-gray-700 mb-6'>
            Pet Care Recommendation
        </Title>
        <div className='mb-6'>
        <Space direction='vertical' className='w-full'>
          <Input placeholder='Pet Type' value={petData.petType} onChange={e => handleChange('petType', e.target.value)}/>
          <Input placeholder='Pet Age' value={petData.petAge} onChange={e => handleChange('petAge', e.target.value)}/>
          <Input placeholder='Diet Preferences' value={petData.petDietPreferences} onChange={e => handleChange('petDietPreferences', e.target.value)}/>
          <TextArea rows={2} placeholder='Health Concerns' value={petData.petHealthConcerns} onChange={e => handleChange('petHealthConcerns', e.target.value)}/>
          <Select className='w-full' placeholder='Activity Level' value={petData.activityLevel} onChange={(value) => handleChange('activityLevel', value)} options={activityLevelOptions}/>
          <Input placeholder='Weight' value={petData.weight} onChange={e => handleChange('weight', e.target.value)}/>
          <Input placeholder='Location' value={petData.location} onChange={e => handleChange('location', e.target.value)}/>
          {customFields.map((field) => (
            <Input key={field} placeholder={field} value={petData.customInputs?.[field]} onChange={e => handleCustomInputChange(field, e.target.value)}/>
          ))}
          <Button type="dashed" onClick={addCustomField}>+Add Custom Field</Button>
          <Button type="primary" onClick={handleSubmit}>Pet Care</Button>
        </Space>
        {result && (
          <div className='bg-gray-100 p-4 mt-6 rounded-md shadow-inner'>
            <h3 className='text-lg font-semibold mb-2'>Pet Care</h3>
            <div className='whitespace-pre-wrap text-sm' dangerouslySetInnerHTML={{__html: result.replace(/\n/g, '<br/>'),}}>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>


  )
}

export default PetCareRecommendation