import "./PotholePageNew.css";
import React, { useState } from "react";
import axios from "axios";
import { getBackendUrl, getAiServiceUrl } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const PotholeImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState("");
  const [confidenceRaw, setConfidenceRaw] = useState(0); // Store raw confidence value
  const [time, setTime] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [predictionClass, setPredictionClass] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // complaint submit state
  const navigate = useNavigate();
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
      setAlert({ message: "Please select a file to upload.", type: "error" });
      return;
    }

  const formData = new FormData();
    formData.append("file", selectedFile);
  const aiServiceUrl = getAiServiceUrl();
  console.log('[Pothole Detect] Using AI service:', aiServiceUrl);
    try {
      // show loading on button
      const submitBtn = event.currentTarget.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');
      }
      const startTime = Date.now();
      const response = await axios.post(
        `${aiServiceUrl}/predict`,
        formData
      );
      
      // Handle response from Flask AI API
      const { is_pothole, confidence, prediction_time } = response.data;
      const endTime = Date.now();
      const predictionTime = prediction_time || ((endTime - startTime) / 1000).toFixed(2);
      const confidencePercent = (confidence * 100).toFixed(2);
      
      // Store raw confidence value for later use
      setConfidenceRaw(confidence);

      if (is_pothole) {
        setPrediction("Pothole Detected");
        setConfidence(`Confidence: ${confidencePercent}%`);
        setPredictionClass("prediction-yes");
        setRecommendation("Immediate Repair Needed");
      } else {
        setPrediction("No Pothole Detected");
        setConfidence(`Confidence: ${confidencePercent}%`);
        setPredictionClass("prediction-no");
        setRecommendation("No Immediate Action Needed");
      }

      setTime(`Detection Completed in ${predictionTime}s`);
      setAlert({ message: "File uploaded successfully!", type: "success" });
    } catch (error) {
      console.error("Error uploading the file:", error);
      setPrediction("Error processing the image.");
      setConfidence("");
      setTime("");
      setRecommendation("");
      setPredictionClass("prediction-error");
      setAlert({ message: "Error uploading the file.", type: "error" });
    }

    setTimeout(() => {
      setAlert({ message: "", type: "" });
    }, 3000);
  };

  return (
    <div className="maincontainer">
      <div className="upload-container">
        <form onSubmit={handleSubmit}>
          <input
            className="upload-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button className="upload-button" type="submit" aria-busy="false">
            <span className="btn-label">Upload Image</span>
            <span className="btn-spinner" aria-hidden="true"></span>
          </button>
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
          <div className={`alert ${alert.type}`}>{alert.message}</div>
        )}

        {/* Complaint Form Appears only if pothole is detected */}
        {prediction === "Pothole Detected" && (
          <div className="modal-overlay">
            <div className="modal animated-pop">
              <h3>🚧 Report Pothole Location</h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const location = e.target.location.value;
                  const description = e.target.description.value;
                  setIsSubmitting(true);

                  try {
                    const token = localStorage.getItem('authToken');
                    const backendUrl = getBackendUrl();
                    console.log('[Complaint] Using backend:', backendUrl);
                    console.log('[Complaint] Image data length:', preview ? preview.length : 0);
                    console.log('[Complaint] Confidence:', confidenceRaw);
                    
                    // Include image data and confidence in complaint
                    const complaintData = {
                      location,
                      description,
                      imageData: preview, // Base64 image from preview
                      confidence: confidenceRaw // Use raw confidence value (0-1)
                    };
                    
                    const response = await axios.post(
                      `${backendUrl}/api/complaints`,
                      complaintData,
                      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
                    );
                    setAlert({ message: response.data.message, type: "success" });
                    navigate("/lifesaver");
                  } catch (error) {
                    setAlert({
                      message: "Error submitting complaint. Please try again.",
                      type: "error",
                    });
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                <input
                  type="text"
                  name="location"
                  placeholder="Enter location"
                  className="complaint-input"
                  required
                  disabled={isSubmitting}
                />
                <textarea
                  name="description"
                  placeholder="Enter description"
                  className="complaint-input"
                  required
                  disabled={isSubmitting}
                ></textarea>
                <button className={`complaint-submit ${isSubmitting ? 'btn-loading' : ''}`} type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                  {isSubmitting ? (
                    <span className="loading-inline"><span className="mini-spinner" aria-hidden="true"></span> Submitting...</span>
                  ) : (
                    'Submit Complaint'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        <footer className="footer">
          <marquee behavior="scroll" direction="left">
            Drive with caution: Watch out for potholes, follow speed limits, and
            stay safe!
          </marquee>
        </footer>
      </div>
    </div>
  );
};

export default PotholeImageUpload;
