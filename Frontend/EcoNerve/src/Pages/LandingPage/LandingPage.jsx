import React, { useState } from "react";
import "./LandingPage.css"; // Link the CSS file

function LandingPage() {
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="landing-container">
      <div className="overlay">
        <h1 className="title">Landing Page       </h1>
        <p className="subtitle"></p>
        <div className="upload-section">
          {uploadedImage ? (
            <img src={uploadedImage} alt="Uploaded" className="preview-img" />
          ) : (
            <label className="upload-label">
              upload an image<input type="file" onChange={handleImageUpload} hidden />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

export { LandingPage };
