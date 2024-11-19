import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ show, onClose }) => {
    const navigate = useNavigate()
  if (!show) return null;
//   const handleVerify = () => {
//     navigate(show);
//   };
  return (
    <div className="overlay">
      <div className="popup">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2 className="popup-title">Verify Your Email</h2>
        <p className="popup-text">
          To continue, please verify your email address by clicking the button below.
        </p>
        {/* <button className="verify-btn" onClick={handleVerify}>Verify Email</button>
         */}
          <a href={show} className="verify-link" target="_blank" rel="noopener noreferrer">
          Verify Email
        </a>
      </div>
    </div>
  );
};

export default AuthModal;

