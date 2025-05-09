import React, { useState } from 'react'
import { PetCareRecommendationData } from '../AIModel/PetCareRecommendation '
import { message } from 'antd'

const PetCareRecommendation = () => {
    
   const[petData, setPetDate] = useState<PetCareRecommendationData>({
      petType: '',
      petHealthConcerns: '',
      petDietPreferences: '',
      activityLevel: '',
      weight: '',
      location: '',
      customInputs: {},
 })
  
  const [customFields, setCustomFields] = useState<string[]>([])

  const handleChange = (field: keyof PetCareRecommendationData, value: string | number) => {
      setPetDate({...petData, [field]: value})
  }


  const handleCustomInputChange = (field: keyof PetCareRecommendationData, value: string | number) => {
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
            message.error('User is not authenticate')
        }
    }
  }


 



// "petType": "Golden Retriever",
//   "petAge": 5,
//   "petHealthConcerns": "mild arthritis",
//   "petDietPreferences": "grain-free kibble",
//   "activityLevel": "high",
//   "weight": 27,
//   "location": "Arizona, USA"

  return (
   
  )
}

export default PetCareRecommendation