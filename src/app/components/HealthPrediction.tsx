import React, { useState } from 'react'
import { PetHealthData } from '../AIModel/PetHealthPrediction ';
import api from '../utils/api';
import { Button, Input, message, Space, Typography } from 'antd';



const Title = Typography;


const HealthPrediction = () => {

   const [petData, setPetDate] = useState<PetHealthData>({
    petName: '',
    species: '',
    breed: '',
    age: 0,
    weight: 0,
    gender: '',
    activityLevel: '',
    diet: '',
    vaccinationStatus: '',
    pastIllnesses: '',
    currentSymptoms: '',
    lastVetVisit: '', 
    medications: '',
    spayedNeutered: '',
    customInputs: {
        bloodPressure: '',
        heartRate: '',
        temperature: ''
      }
    
   }) 


   const [result, setResult] = useState<string | null>(null);
   
   const [customFields, setCustomFields] = useState<string[]>([])


   const handelChange = (field: keyof PetHealthData, value: string | number) => {
      setPetDate({...petData, [field]: value})
   }

   const  handleCustomInputChange = (field: keyof typeof petData.customInputs, value: string | number) => {
      setPetDate({...petData, 
        customInputs: {
        ...petData.customInputs,
        [field]: value
      }});
   }


const addCustomField = () => {
  const newFieldKey = prompt("Enter custom health field name");
  if(newFieldKey && !petData.customInputs[newFieldKey]) {
    setPetDate(prev => ({
      ...prev,
      customInputs: {
        ...prev.customInputs,
        [newFieldKey]: ""
      }
    }));
    setCustomFields([...customFields, newFieldKey]);
  } else {
    message.warning('Invalid or duplicate field name')
  }
};


   const handelSubmit = async () => {
    try {
        const token = localStorage.getItem('token');
        if(!token) {
            message.error('User is not authenticated');
            return;
        }
        const response = await api.PetHealthPrediction(petData, token);
        message.success('Pet health prediction generated successfully');
        setResult(response.data || 'No prediction data returned')
    } catch(error: any) {
        message.error(error.message || 'Failed to generate health prediction');
        setResult(null);
    }
   }

 return (
    <div className='flex items-center justify-center min-h-screen bg-blue-50'>
        <div className='w-full max-w-xl p-8 bg-white rounded-lg shadow-md'>
            <Title level={2} className='text-center text-gray-700 mb-6'>
               Pet Health Prediction
            </Title>

            <div className='mb-6'>
              <Space direction='vertical' className='w-full'>
                <Input placeholder='Name' value={petData.petName} onChange={e => handelChange('petName', e.target.value)}/>
                <Input placeholder='Species' value={petData.species} onChange={e => handelChange('species', e.target.value)}/>
                <Input placeholder='Breed' value={petData.breed} onChange={e => handelChange('breed', e.target.value)}/>
                <Input placeholder='Age' value={petData.age} onChange={e => handelChange('age', e.target.value )}/>
                <Input placeholder='weight' value={petData.weight} onChange={e => handelChange('weight', e.target.value)}/>
                <Input placeholder='gender' value={petData.gender} onChange={e => handelChange('gender', e.target.value)}/>
                <Input placeholder='Activity Level' value={petData.activityLevel} onChange={e => handelChange('activityLevel', e.target.value)}/>
                <Input placeholder='Diet' value={petData.diet} onChange={e => handelChange('diet', e.target.value)}/>
                <Input placeholder='Vaccination Status' value={petData.vaccinationStatus} onChange={e => handelChange('vaccinationStatus', e.target.value)}/>
                <Input placeholder='PastIllnesses' value={petData.pastIllnesses} onChange={e => handelChange('pastIllnesses', e.target.value)}/>
                <Input placeholder='Current Symptoms' value={petData.currentSymptoms} onChange={e => handelChange('currentSymptoms', e.target.value)}/>
                <Input placeholder='Last Vet Visit' value={petData.lastVetVisit} onChange={e => handelChange('lastVetVisit', e.target.value)}/>
                <Input placeholder='Medications' value={petData.medications} onChange={e => handelChange('medications', e.target.value)}/>
                <Input placeholder='Spayed Neutered' value={petData.spayedNeutered} onChange={e => handelChange('spayedNeutered', e.target.value)}/>
                <Input placeholder='Blood Pressure' value={petData.customInputs?.bloodPressure} onChange={e => handleCustomInputChange('bloodPressure', e.target.value)}/>
                <Input placeholder='Heart Rate' value={petData.customInputs?.heartRate} onChange={e => handleCustomInputChange('heartRate', e.target.value)}/>
                <Input placeholder='Temperature' value={petData.customInputs?.temperature} onChange={e => handleCustomInputChange('temperature', e.target.value)}/>
                {customFields.map((field) => (
                  <Input key={field} placeholder={field} value={petData.customInputs?.[field]} onChange={e => handleCustomInputChange(field, e.target.value)}/>
                ))}
                <Button type='dashed' onClick={addCustomField}>+ Add Custom Field</Button>
                <Button type='primary' onClick={handelSubmit}> Predict Health</Button>
              </Space>

              {result && (
                <div className='bg-gray-100 p-4 mt-6 rounded-md shadow-inner'>
                    <h3 className='text-lg font-semibold mb-2'>Predict Health:</h3>
                    <div className='whitespace-pre-wrap text-sm' dangerouslySetInnerHTML={{__html: result.replace(/\n/g, '<br/>'),}}>
                    </div>
                </div>
              )}
            </div>
        </div>
    </div>
  )
}

export default HealthPrediction;