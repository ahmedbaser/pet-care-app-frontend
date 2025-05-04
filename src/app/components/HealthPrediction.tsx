import React, { useState } from 'react'
import { PetHealthData } from '../AIModel/PetHealthPrediction '
import api from '../utils/api';
import { Button, Input, message, Space, Typography } from 'antd';



const Title = Typography;


const HealthPrediction = () => {

   const [petDate, setPetDate] = useState<PetHealthData>({
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

   const handelChange = (field: keyof PetHealthData, value: string | number) => {
      setPetDate({...petDate, [field]: value})
   }

   const  handleCustomInputChange = (field: keyof typeof petDate.customInputs, value: string) => {
      setPetDate({...petDate, 
        customInputs: {
        ...petDate.customInputs,
        [field]: value
      }});
   }

   const handelSubmit = async () => {
    try {
        const token = localStorage.getItem('token');
        if(!token) {
            message.error('User is not authenticated');
            return;
        }
        const response = api.PetHealthPrediction(petDate, token);
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
                <Input placeholder='Name' value={petDate.petName} onChange={e => handelChange('petName', e.target.value)}/>
                <Input placeholder='Species' value={petDate.species} onChange={e => handelChange('species', e.target.value)}/>
                <Input placeholder='Breed' value={petDate.breed} onChange={e => handelChange('breed', e.target.value)}/>
                <Input placeholder='Age' value={petDate.age} onChange={e => handelChange('age', e.target.value )}/>
                <Input placeholder='weight' value={petDate.weight} onChange={e => handelChange('weight', e.target.value)}/>
                <Input placeholder='gender' value={petDate.gender} onChange={e => handelChange('gender', e.target.value)}/>
                <Input placeholder='Activity Level' value={petDate.activityLevel} onChange={e => handelChange('activityLevel', e.target.value)}/>
                <Input placeholder='Diet' value={petDate.diet} onChange={e => handelChange('diet', e.target.value)}/>
                <Input placeholder='Vaccination Status' value={petDate.vaccinationStatus} onChange={e => handelChange('vaccinationStatus', e.target.value)}/>
                <Input placeholder='PastIllnesses' value={petDate.pastIllnesses} onChange={e => handelChange('pastIllnesses', e.target.value)}/>
                <Input placeholder='Current Symptoms' value={petDate.currentSymptoms} onChange={e => handelChange('currentSymptoms', e.target.value)}/>
                <Input placeholder='Last Vet Visit' value={petDate.lastVetVisit} onChange={e => handelChange('lastVetVisit', e.target.value)}/>
                <Input placeholder='Medications' value={petDate.medications} onChange={e => handelChange('medications', e.target.value)}/>
                <Input placeholder='Spayed Neutered' value={petDate.spayedNeutered} onChange={e => handelChange('spayedNeutered', e.target.value)}/>
                <Input placeholder='Blood Pressure' value={petDate.customInputs?.bloodPressure} onChange={e => handleCustomInputChange('bloodPressure', e.target.value)}/>
                <Input placeholder='Heart Rate' value={petDate.customInputs?.heartRate} onChange={e => handleCustomInputChange('heartRate', e.target.value)}/>
                <Input placeholder='Temperature' value={petDate.customInputs?.temperature} onChange={e => handleCustomInputChange('temperature', e.target.value)}/>
                 
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

export default HealthPrediction