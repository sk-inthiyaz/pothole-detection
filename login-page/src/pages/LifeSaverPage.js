import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LifeSaverPageNew.css';

const LifeSaverPage = () => {
  const navigate = useNavigate();
  return (
    <div className="lifesaver-container">
      <h1 className="lifesaver-heading">🎉 You Saved a Life!</h1>
      <p className="lifesaver-text">
        By reporting the pothole, you might have just prevented an accident. 🙌<br />
        Roads are safer because of heroes like you.
      </p>
      <div className="newspaper-section">
        <h3>📰 Featured in the Local News</h3>
        <p><em>“Local citizen takes a step to stop road hazards” - The Daily Times</em></p>
        <p><em>“Pothole report helps civic authorities fix deadly crack” - City Mirror</em></p>
      </div>

      {/* Floating button to report another pothole */}
      <button
        className="floating-report-btn"
        onClick={() => navigate('/pothole')}
        aria-label="Report another pothole"
        title="See another pothole? Report it"
      >
        ➕ Report another pothole
      </button>
    </div>
  );
};

export default LifeSaverPage;
