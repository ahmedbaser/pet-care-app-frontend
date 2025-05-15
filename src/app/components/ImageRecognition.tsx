import React, { useState } from 'react'
import { Button, Input, message, Modal, Space, Typography } from 'antd';
import Upload, { RcFile } from 'antd/es/upload';
import { PetImageRecognitionSymptom } from '../AIModel/PetImageRecognitionSymptom';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import api from '../utils/api';


const { TextArea } = Input;
const { Title } = Typography;

const ImageRecognition = () => {

const [petData, setPetData] = useState<PetImageRecognitionSymptom>({
     petType: '',
     petAge: '',
     symptomDescription: '',
     customInputs: {},
});

const [customFields, setCustomFields] = useState<string[]>([]) 
const [imageFile, setImageFile] = useState<RcFile | null>(null);
const [isImageConfirmed, setIsImageConfirmed] = useState(false);
const [isPreviewVisible, setIsPreviewVisible] = useState(false);
const [result, setResult] = useState<string | null>(null)




const handleChange = (field: keyof PetImageRecognitionSymptom, value: string | number) => {
    setPetData({...petData, [field]: value})
}

const handleCustomInputChange = (field: keyof typeof petData.customInputs, value: string | number) => {
     setPetData({...petData,
        customInputs: {
            ...petData.customInputs,
            [field]: value, 
        }
     });      
}

const addCustomField = () => {
  const newFieldKey = prompt('Enter custom input field name');
   if(newFieldKey && !petData.customInputs[newFieldKey]) {
    setPetData(prev => ({
        ...prev,
        customInputs: {
            ...prev.customInputs,
            [newFieldKey]: ""
        }
    }));
    setCustomFields([...customFields, newFieldKey])
   } else {
    message.warning('Invalid or duplicated field name')
   }
} 

const handleImageChange = (info: UploadChangeParam) => {
    const file =  info.fileList[0]?.originFileObj as RcFile | undefined;
    console.log('Selected file type:', file?.type);
    if(file && ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setImageFile(file);
        setIsImageConfirmed(false);
    } else {
        message.error('Only JPG, JPEG, PNG files are allowed')
    }
};



const handleSubmit = async () => {
    if(!imageFile) {
     message.error('Please upload an image');
     return
    } 
   if(!isImageConfirmed) {
     message.warning('Please confirm the image using the Preview button before submission');
     return 
    }
    
    const token = localStorage.getItem('token');
    if (!token) return message.error('User is not authenticated');
   
   const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('petType', petData.petType);
    formData.append('petAge', petData.petAge);
    formData.append('symptomDescription', petData.symptomDescription);
    formData.append('customInputs', JSON.stringify(petData.customInputs));

     try {
        const response = await api.analyzeSymptomImage(formData, token);
        setResult(response.analysis);
        message.success('Image analyzed successfully')
       } catch(error) {
        if(error instanceof Error) {
        message.error(error.message)
      } else {
        message.error('Failed to analyze image');
      }
    }
}


return (
    <div className='flex items-center justify-center min-h-screen bg-green-100'>
        <div className='w-full max-w-xl p-8 bg-white rounded-lg shadow-lg'>
        <Title level={2} className='text-center text-gray-700'>Pet Symptom Image Recognition</Title>
        <div className='mb-6'>
         <Space direction='vertical' className='w-full'>   
          <Input placeholder='Pet Type' value={petData.petType} onChange={e => handleChange('petType', e.target.value)}/>
          <Input placeholder='Pet Age' value={petData.petAge} onChange={e => handleChange('petAge', e.target.value)}/>
          <TextArea rows={2} placeholder='Symptom Description' value={petData.symptomDescription} onChange={e => handleChange('symptomDescription', e.target.value)}/> 
          {customFields.map(field => (
            <Input key={field} placeholder={field}
            value={petData.customInputs[field]}
            onChange={e => handleCustomInputChange(field, e.target.value)}
            />
          ))} 
           <Button type='dashed' onClick={addCustomField}>+ Add Custom Field</Button>
           <Upload beforeUpload={() => false} onChange={handleImageChange} accept='.jpg,.jpeg,.png' maxCount={1}>
           <Button icon={<UploadOutlined />}>Click to Upload Image</Button>  
           </Upload>
           {imageFile && (
            <>
            <Button onClick={() => setIsPreviewVisible(true)} className='mt-2'>Preview Image</Button>
            <Modal title='Image Preview' open={isPreviewVisible} onOk={()=> {
                setIsPreviewVisible(false);
                setIsImageConfirmed(true);
                message.success('Image confirmed!');
            }} onCancel={() => setIsPreviewVisible(false)} okText="Confirm">

            <img src={URL.createObjectURL(imageFile)}
             alt='Preview'
             style={{width: '100%', maxHeight: '400px', objectFit: 'contain'}}
            />

            </Modal>
            </>
           )}
           <Button type='primary' onClick={handleSubmit}>Analyze Image</Button>
          </Space>
    
        {result && (
            <div className='bg-gray-100 p-4 mt-6 rounded-md shadow-inner'>
                <h3 className='text-lg font-semibold mb-2'>Analysis Result</h3>
                <div className='whitespace-pre-wrap text-sm' dangerouslySetInnerHTML={{__html: result.replace(/\n/g, '<br/>')}}>
             </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

export default ImageRecognition;















