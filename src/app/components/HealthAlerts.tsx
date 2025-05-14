import React, { useState } from 'react'
import { PetHealthAlertsData } from '../AIModel/PetHealthAlerts'
import { Button, Input, message, Space, Typography } from 'antd'
import api from '../utils/api'



const {Title} = Typography;
const {TextArea} = Input;


const HealthAlerts = () => {
  const [petData, setPetData] = useState<PetHealthAlertsData>({
          petType: '',
          petAge: '',
          symptoms: '',
          duration: '',
          recentBehavior: '',
          customInputs: {},
    })


   const [customField, setCustomField] = useState<string[]>([])
   const [result, setResult] = useState<string | null>(null)

    const handleChange = (field: keyof PetHealthAlertsData, value: string | number) => {
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

    const addCustomField = () => {
        const newFieldKey = prompt('Enter custom health alert field name');
        if(newFieldKey  && !petData.customInputs[newFieldKey]) {
          setPetData(prev => ({
            ...prev,
            customInputs: {
                ...prev.customInputs,
                [newFieldKey]: ""
            }
          }));
          setCustomField([...customField, newFieldKey])
        } else {
            message.warning('Invalid or duplicate field name')
        }
    }

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            if(!token) {
                message.error('User is not authenticated');
                return
            }
            const response = await api.PetHealthAlerts(petData, token);
            message.success('Pet health alert generated successfully');
            setResult(response.suggestion || 'No alert date returned') 
        } catch(error) {
          if(error instanceof Error) {
            message.error(error.message)
          } else {
            message.error('Failed to generate health alert')
          }
        }
    } 

return (
     <div className='flex items-center justify-center min-h-screen bg-blue-100'>
        <div className='w-full max-w-xl p-8 bg-white rounded-lg shadow-md'>
         <Title level={2} className="text-center text-gray-700 mb-6">
            Pet Health Alerts
         </Title>
         
       <div className='mb-6'>
          <Space direction='vertical' className='w-full'>
            <Input placeholder='Pet Type' value={petData.petType} onChange={e => handleChange('petType', e.target.value)}/>
            <Input placeholder='Pet Age' value={petData.petAge} onChange={e => handleChange('petAge', e.target.value)}/>
            <TextArea rows={2} placeholder='Symptoms' value={petData.symptoms} onChange={e => handleChange('symptoms', e.target.value)}/>
            <Input placeholder='Duration' value={petData.duration} onChange={e => handleChange('duration', e.target.value)}/>   
            <TextArea rows={2} placeholder='Recent Behavior' value={petData.recentBehavior} onChange={e => handleChange('recentBehavior', e.target.value)}/> 
           {customField.map((field) => (
            <Input key={field} placeholder={field} value={petData.customInputs?.[field]} onChange={e => handleCustomInputsChange(field, e.target.value)}/>
           ))}

           <Button type='dashed' onClick={addCustomField}>+ Add Custom Field</Button>
           <Button type='primary' onClick={handleSubmit}>Health Alert</Button>
          </Space>  

          {result && (
            <div className='bg-gray-100 p-4 mt-6 rounded-sm shadow-inner'>
                <h3 className='text-lg font-semibold mb-2'>Health Alert</h3>
                <div className='whitespace-pre-wrap text-sm' dangerouslySetInnerHTML={{__html: result.replace(/\n/g, '<br/>'),}}>
              </div>
            </div>
          )}
         </div>
        </div>
       </div>
     )
}

export default HealthAlerts;