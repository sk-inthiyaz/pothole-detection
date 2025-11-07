import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LifeSaverPageNew.css';
import potholeVideo from './assets/potholevid.mp4';

const LifeSaverPage = () => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
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

      {/* Inline CTA to explain potholes */}
      <button
        className="video-trigger-btn"
        onClick={() => setShowVideo(true)}
        aria-haspopup="dialog"
        aria-expanded={showVideo ? 'true' : 'false'}
      >
        ❓ Want to know why potholes are created?
      </button>

      {/* Video Modal */}
      {showVideo && (
        <div
          className="video-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Why potholes are created"
          onClick={(e) => {
            if (e.target.classList.contains('video-modal-overlay')) setShowVideo(false);
          }}
        >
          <div className="video-modal animated-pop">
            <button className="video-close" onClick={() => setShowVideo(false)} aria-label="Close video">✕</button>
            <video className="video-player" src={potholeVideo} controls autoPlay playsInline />
          </div>
        </div>
      )}

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
