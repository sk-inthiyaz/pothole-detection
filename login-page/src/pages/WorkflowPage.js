import React from 'react';
import './WorkflowPageNew.css';

const WorkflowPage = () => {
  return (
    <div className='WorkflowBody'>
      <div className="container">
        <h1 className="title">Pothole Detection Workflow</h1>
        <div className="steps">
          <div className="step">
            <h2>Step 1: Image Upload</h2>
            <p className="description">
              Users upload an image of the road to the website for analysis. Simply drag & drop
              or click to select an image from your device.
            </p>
          </div>
          <div className="step">
            <h2>Step 2: Image Processing</h2>
            <p className="description">
              The image is processed and analyzed using a Convolutional Neural Network (CNN) powered
              by PyTorch, trained on thousands of road images.
            </p>
          </div>
          <div className="step">
            <h2>Step 3: Pothole Detection</h2>
            <p className="description">
              The system detects if a pothole is present in the uploaded image based on the model's
              prediction, with a confidence score indicating reliability.
            </p>
          </div>
          <div className="step">
            <h2>Step 4: Accuracy Display</h2>
            <p className="description">
              The accuracy of the pothole detection is displayed to the user, indicating the confidence
              of the model's prediction along with recommendations for next steps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowPage;
