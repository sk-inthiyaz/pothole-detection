import React, { useState } from 'react';
import axios from 'axios';
import './PotholePage.css';

const PotholeImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setAlertMessage('No file found');
      setAlertType('error');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('https://pothole-detection-ai-4562ae5b30dc.herokuapp.com/predict', formData);
      
      if (response.data.is_pothole) {
        setAlertMessage(`Pothole Detected! Confidence: ${(response.data.confidence * 100).toFixed(2)}%`);
        setAlertType('success');
      } else {
        setAlertMessage(`No Pothole Detected. Confidence: ${(response.data.confidence * 100).toFixed(2)}%`);
        setAlertType('info');
      }
    } catch (error) {
      setAlertMessage('Error uploading the file.');
      setAlertType('error');
      console.error('Upload error:', error);
    }
  };

  return (
    <div>
      {alertMessage && (
        <div className={`alert ${alertType}`}>
          {alertMessage}
        </div>
      )}
      <div className="upload-container">
        <form onSubmit={handleSubmit}>
          <input className="upload-input" type="file" accept="image/*" onChange={handleFileChange} />
          <button className="upload-button" type="submit">Upload Image</button>
        </form>
      </div>
    </div>
  );
};

export default PotholeImageUpload;
