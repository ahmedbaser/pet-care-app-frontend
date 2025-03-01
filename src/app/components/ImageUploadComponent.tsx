import React, { useState } from 'react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import api from '../utils/api';



interface ImageUploadComponentProps {
  onUploadSuccess: (imageUrl: string) => void;
}


const ImageUploadComponent: React.FC<ImageUploadComponentProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);



  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file); 
  
      const response = await api.uploadImage(formData);
      console.log('this is frontend cloudinary section:', response);
      if (response.success) {
        onUploadSuccess(response.imageUrl); 
        message.success('Image uploaded successfully');
      } else {
        message.error('Failed to upload image');
      }
    } catch {
      message.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };
  


  return (
    <Upload
      accept="image/*"
      showUploadList={false}
      customRequest={({ file }) => handleUpload(file as File)} 
    >
      <Button icon={<UploadOutlined />} loading={uploading}>
        Upload Image
      </Button>
    </Upload>
 

  );
};

export default ImageUploadComponent;
















