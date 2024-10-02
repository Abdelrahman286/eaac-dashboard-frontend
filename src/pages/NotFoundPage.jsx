import React from "react";
import "../styles/notFoundPage.css";
import { useNavigate } from "react-router-dom";
const NotFoundPage = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/");
  };
  return (
    <div className="not-found-page">
      <div className="not-found-wrapper">
        <h1>404</h1>
        <p>It seems the page you're looking for doesn't exist.</p>
        <button onClick={handleNavigate}>Go Back to Home</button>
      </div>
    </div>
  );
};

export default NotFoundPage;
