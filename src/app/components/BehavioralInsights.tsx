import React, { useState } from 'react'
import { BehavioralInsightsData } from '../AIModel/PetBehavioralInsights'
import { Button, Input, message, Select, Space, Typography } from 'antd'
import api from '../utils/api'



const Title = Typography;
const {TextArea} = Input;


const activityLevelOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'High', value: 'high' },
];

const BehavioralInsights = () => {

    const [petData, setPetData] = useState<BehavioralInsightsData>({
        petType: '', 
        petAge: 0,
        behaviorIssue: '', 
        trainingHistory: '',
        activityLevel: '', 
        customInputs: {}
    })


    const [customField, setCustomField] = useState<string[]>([])
    const [result, setResult] = useState<string | null>(null)

    const handleChange = (field: keyof BehavioralInsightsData, value: string | number) => {
            setPetData({...petData, [field]: value})
    }

    const handleCustomInputsChange = (field: keyof typeof petData.customInputs, value: string | number) => {
       setPetData({...petData,
        customInputs: {
            ...petData.customInputs,
            [field]: value
        }
       })
    }

    const addCustomField = async () => {
      const  newFieldKey = prompt('Enter the custom behavioral insight field');
      if(newFieldKey && !petData.customInputs[newFieldKey]){
        setPetData(prev => ({
            ...prev,
            customInputs:{
                ...prev.customInputs,
                [newFieldKey]: ""
            }
        }));
        setCustomField([...customField, newFieldKey])
      } else {
        message.warning('Invalid or duplicate field name');
      }
    }



    const handleSubmit = async () => {
      try {
        const token = localStorage.getItem('token');
        if(!token) {
          message.error('User is not authenticate');
          return;
        }
        const response = await api.PetBehavioralInsights(petData, token);
        setResult(response.suggestion || 'No behavioral insight returned')
      } catch (error: any) {
        message.error(error.message || 'Failed to generate behavioral insights')
      }
    }

    // userId, petType, petAge, behaviorIssue, trainingHistory, activityLevel, customInputs


  return (
    <div className='flex items-center justify-center min-h-screen bg-blue-100'>
     <div className='w-full max-w-xl p-8 bg-white rounded-lg shadow-md'>
       <Title level={2} className='text-center text-gray-700 mb-6'>
          Behavioral Insight & Tips
       </Title>
      <div className='mb-6'>
       <Space direction='vertical' className='w-full'>
           <Input placeholder='Pet Type' value={petData.petType} onChange={e => handleChange('petType', e.target.value)}/>
           <Input placeholder='Pet Age' value={petData.petAge} onChange={e => handleChange('petAge', e.target.value)}/>
           <TextArea rows={2} placeholder='Behavior Issue' value={petData.behaviorIssue} onChange={e => handleChange('behaviorIssue', e.target.value)}/>
           <TextArea rows={2} placeholder='Training History' value={petData.trainingHistory} onChange={e => handleChange('trainingHistory', e.target.value)}/>
           <Select className='w-full' placeholder="Activity Level" value={petData.activityLevel} onChange={(value) => handleChange('activityLevel', value)} 
            options={activityLevelOptions}/> 
            {customField.map((field) => (
             <Input key={field} placeholder={field} value={petData.customInputs?.[field]} onChange={e => handleCustomInputsChange(field, e.target.value)}/>
            ))}
            <Button type='dashed' onClick={addCustomField}>+ Add Custom Field</Button>
            <Button type='primary' onClick={handleSubmit}>Behavioral Insight</Button>
       </Space>

       {result && (
        <div className='bg-gray-100 p-4 mt-6 rounded-sm shadow-inner'>
            <h3>Behavioral Insight</h3>
            <div className='whitespace-pre-wrap text-sm' dangerouslySetInnerHTML={{__html: result.replace(/\n/g, '<br/>')}}>
            </div>
        </div>
       )}
      </div>
    </div>
    </div>
  )
}

export default BehavioralInsights;



