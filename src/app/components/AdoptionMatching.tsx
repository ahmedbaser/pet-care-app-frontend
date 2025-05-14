import React, { useState } from 'react'
import { Pet, UserInfo } from '../AIModel/PetAdoptionMatch'
import { Button, Input, Space, Typography, message, } from 'antd';
import api from '../utils/api';



const {Title} = Typography;
const { TextArea } = Input;




const AdoptionMatching = () => {
   const [user, setUser] = useState<UserInfo>({
    name: '',
    age: 0,
    lifestyle: '',
    allergies: '',
    home: '',
    experienceWithPets: ''
  });

 const [pets, setPet] = useState<Pet[]>([
    {name: '', breed: '', size: '', temperament: '', needs: ''},
  ]);


  const [result, setResult] = useState<string | null>(null)
  
  const handelUserChange = (field: keyof UserInfo, value: string | number) => {
    setUser({...user, [field]: value});
  }

  const handelPetChange = (index: number, field: keyof Pet, value: string) => {
    const updated = [...pets];
    
    updated[index] = {...updated[index],[field]: value};
    setPet(updated);
  }

  const addPet = () => {
    setPet([...pets, {name: '', breed: '', size: '', temperament: '', needs: '',}])
  };

  const removePet =  (index: number) => {
    const updated = [...pets];
    updated.slice(index, 1);
    setPet(updated);
};

const handleSubmit = async () => {
  try {
    const token = localStorage.getItem('token');
    if(!token) {
      message.error('User is not authenticated');
      return;
    }

    const response = await api.PetAdoptionMatch(user, pets, token);
    console.log('this is AdoptionMatching component data:', response)
    message.success('Adoption match generated successfully');
    setResult(response.data?.suggestion || 'No match data returned');

  } catch(error) {
    if(error instanceof Error) {
        message.error(error.message)
    }  else {
      message.error('Failed to generate adoption match')
    }
    setResult(null);
  }
 
 };
 
  
 return (
    <div className='flex items-center justify-center min-h-screen bg-blue-50'>
      <div className='w-full max-w-xl p-8 bg-white rounded-lg shadow-md'>
        <Title level={2} className='text-center text-gray-700 mb-6'>
          Pet Adoption Matching
        </Title>

      <div className='mb-6'>
         <Title level={4}>User Information</Title>
          <Space direction='vertical' className='w-full'>
           <Input placeholder='Name' value={user.name} onChange={e => handelUserChange('name', e.target.value)}/>
           <Input
              type='number'
              placeholder='Age'
              value={user.age}
              onChange={e => handelUserChange('age', Number(e.target.value))}
           />
           <TextArea
            rows={2}
            placeholder='Lifestyle'
            value={user.lifestyle}
            onChange={e => handelUserChange('lifestyle', e.target.value)}
           />
           <Input 
              placeholder='Allergies' 
              value={user.allergies} 
              onChange={e => handelUserChange('allergies', e.target.value)}/>
           <TextArea
             rows={2}
             placeholder='Home'
             value={user.home}
             onChange={e => handelUserChange('home', e.target.value)}
           /> 
           <TextArea
             rows={2}
             placeholder='Experience with pets'
             value={user.experienceWithPets}
             onChange={e => handelUserChange('experienceWithPets', e.target.value)}
          />  
         </Space>
        </div>

        <div className='mb-6'>
          <Title level={4}>Pet Preference</Title>
          {pets.map((pet, index) => ( 
            <div key={index} className='mb-4 border rounded-md'>
              <Space direction='vertical' className='w-full'>
              <Input 
               placeholder='Pet Name' 
               value={pet.name} 
               onChange={e => handelPetChange(index, 'name', e.target.value)}/>
              <Input
               placeholder='Breed'
               value={pet.breed}
               onChange={e => handelPetChange(index, 'breed', e.target.value)}
              />
              <Input 
               placeholder='Size' 
               value={pet.size} 
               onChange={e => handelPetChange(index, 'size', e.target.value)}/>

              <TextArea
               rows={2}
               placeholder='Temperament'
               value={pet.temperament}
               onChange={e => handelPetChange(index, 'temperament', e.target.value)}
              />
              <TextArea
               rows={2}
               placeholder='Needs'
               value={pet.needs}
               onChange={e => handelPetChange(index, 'needs', e.target.value)}
              />
              {pets.length > 1 && (
                <Button danger onClick={() => removePet(index)}>Remove Pet</Button>
              )}

              </Space> 
            </div>
          ))}
          <Button onClick={addPet}></Button>
          + Add Another Pet
        </div>
       
       <div className='flex justify-between'>
           <Button type='primary' onClick={handleSubmit}>
             Match Adoption
           </Button>
      </div>

     {result && (
      <div className='bg-gray-100 p-4 mt-6 rounded-md shadow-inner'>
          <h3 className='text-lg font-semibold mb-2'>Adoption Match Result:</h3>
          <div className='whitespace-pre-wrap text-sm'
           dangerouslySetInnerHTML={{__html: result.replace(/\n/g, '<br/>'),}}>
       </div>
      </div>
     )}
  </div>
</div>
  )
}

export default AdoptionMatching

