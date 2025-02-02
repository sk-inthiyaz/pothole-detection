import './PotholePage.css';
import React, { useState } from 'react';
import axios from 'axios';

const PotholeImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [confidence, setConfidence] = useState('');
  const [time, setTime] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [predictionClass, setPredictionClass] = useState(''); // New state

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setAlert({ message: 'Please select a file to upload.', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
  
    try {
      const startTime = Date.now();
      const response = await axios.post('http://localhost:5000/upload', formData);
      const { pothole_detected, confidence_level, recommendation } = response.data;
      const endTime = Date.now();
      const predictionTime = ((endTime - startTime) / 1000).toFixed(2); // in seconds
  
      if (pothole_detected === "Yes") {
        setPrediction("Pothole Detected");
        setConfidence(`Confidence: ${confidence_level}`);
        setPredictionClass('prediction-yes'); // Set class for pothole detected
      } else if (pothole_detected === "No") {
        setPrediction("No Pothole Detected");
        setConfidence(`Confidence: ${confidence_level}`);
        setPredictionClass('prediction-no'); // Set class for no pothole
      } else {
        setPrediction("Prediction unavailable");
        setConfidence('');
        setPredictionClass('');
      }
      setTime(`Detection Completed in ${predictionTime} seconds`);
      setRecommendation(recommendation);
      setAlert({ message: 'File uploaded successfully!', type: 'success' });

    } catch (error) {
      console.error('Error uploading the file:', error);
      setPrediction("Error processing the image.");
      setConfidence('');
      setTime('');
      setRecommendation('');
      setPredictionClass('prediction-error'); // Set class for error
      setAlert({ message: 'Error uploading the file.', type: 'error' });
    }

    setTimeout(() => {
      setAlert({ message: '', type: '' });
    }, 3000);
  };

  return (
    <div className='maincontainer'>
      <div className="upload-container">
      <form onSubmit={handleSubmit}>
        <input className="upload-input" type="file" accept="image/*" onChange={handleFileChange} />
        <button className="upload-button" type="submit">Upload Image</button>
      </form>
      {preview && (
        <div className="preview-container">
          <h3>Preview:</h3>
          <img src={preview} alt="Pothole Preview" />
        </div>
      )}
      {prediction && (
        <div className={`prediction-container ${predictionClass}`}>
          <h3>Prediction:</h3>
          <p>{prediction}</p>
          {confidence && <p>{confidence}</p>}
          {time && <p>{time}</p>}
          {recommendation && <p>{recommendation}</p>}
        </div>
      )}
      {alert.message && (
        <div className={`alert ${alert.type}`}>
          {alert.message}
        </div>
      )}
      <footer className="footer">
        <marquee behavior="scroll" direction="left">
          Drive with caution: Watch out for potholes, follow speed limits, and stay safe!
        </marquee>
      </footer>
    </div>
    </div>
  );
};

export default PotholeImageUpload;
