import React, { useRef, useState, } from 'react';
import Webcam from 'react-webcam';
import '../styles/CameraPage.css';
import { FaRegCircle } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

const CameraPage = ({ Confirm }) => {

  const [selectedTheme, setSelectedTheme] = useState('/images/themes/theme1.png');
  // const [showScotty, setShowScotty] = useState(false);
  const [selectedSelfie, setSelectedSelfie] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const webcamRef = useRef(null);
  const [screenshot, setScreenshot] = useState(null);

  const [step, setStep] = useState(1); // 1: select type, 2: select theme, 3: camera
  const [mode, setMode] = useState(null); // 'selfie' or 'scotty'

  const updateTheme = (event) => {
    let imgSrc = event.target.src;
    setSelectedTheme(imgSrc);
  }

  const reset = () => {
    let retakeButton = document.querySelector(".retake");
    let confirmButton = document.querySelector(".confirm"); 
    let captureButton = document.querySelector(".capture-button"); 
    retakeButton.classList.add('hidden');
    confirmButton.classList.add('hidden');
    captureButton.classList.remove('hidden');
    setSelectedSelfie('');
  }

  const startCountdown = () => {
    setCountdown(3); // Start countdown from 3 seconds

    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(countdownInterval);
          capture(); // Capture the image when the countdown reaches 0
          return null; // Reset countdown
        }
        return prevCountdown - 1;
      });
    }, 1000); // Decrease countdown every second
  };

  const capture = () => {
    const retakeButton = document.querySelector(".retake");
    const confirmButton = document.querySelector(".confirm");
    const captureButton = document.querySelector(".capture-button");
  
    if (retakeButton && confirmButton && captureButton) {
      retakeButton.classList.remove("hidden");
      confirmButton.classList.remove("hidden");
      captureButton.classList.add("hidden");
    }
  
    if (webcamRef.current) {
      // Clear old selfie before capturing new one
      setSelectedSelfie(null);
  
      const webcamSrc = webcamRef.current.getScreenshot();
      if (webcamSrc) {
        setSelectedSelfie(webcamSrc);
      } else {
        console.warn("Failed to capture screenshot: webcamSrc is null.");
      }
    } else {
      console.warn("webcamRef is not ready yet.");
    }
  };
  
  const handleConfirm = () => {
    Confirm(selectedSelfie, selectedTheme);
  }

  const importImages = (r) => {
    return r.keys().map(r);
  };

  const handleNext = () => {
    if (step === 2 && mode === 'scotty') {
      // Skip camera and go straight to confirm
      setSelectedSelfie(null);
      Confirm(null, selectedTheme);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
    if (step === 2) {
        setSelectedTheme(null); // reset theme when leaving step 2
    }
    if (step === 3) {
      setScreenshot(null); // reset the captured image when leaving step 3
      setSelectedSelfie(null);
    }
  };
  
  const themes = importImages(require.context('../../public/images/themes', false, /\.(png|jpe?g|svg)$/));
  const scotty = importImages(require.context('../../public/images/scotty', false, /\.(png|jpe?g|svg)$/));

  return (
    <div className='camera-page'>
      <div className='header'>
        <h1>Capture Your Vision!</h1>
      </div>

      {step === 1 && (
        <div className="step1">
          <div className="opt-directions">
            Please select an option
          </div>
            <div className="opt-selector">
            <button className={`opt-button ${mode === 'selfie' ? 'blue' : ''}`}
              onClick={() => setMode('selfie')}
            >
              Selfie
            </button>
            <button
              className={`opt-button ${mode === 'scotty' ? 'blue' : ''}`}
              onClick={() => setMode('scotty')}
            >
              Scotty
            </button>
          </div>
          <div className="button-group">
            <button
              className="button next"
              onClick={handleNext}
              disabled={!mode}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className='body'>
          <div className='left-container'>
            <div className="step2">
              <h2>{mode === 'selfie' ? 'Pick a selfie poster theme' : 'Pick a Scotty avatar theme'}</h2>
              <div className="theme-select">
                {(mode === 'selfie' ? themes : scotty).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`theme-${idx}`}
                    onClick={() => setSelectedTheme(img)}
                    className={selectedTheme === img ? 'selected' : ''}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="back-button-container" style={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
            <button className="button prev" onClick={handleBack}>Back</button>
          </div>
          <div className='right-container'>
            <h2>Theme Selection Preview</h2>
            {selectedTheme && selectedTheme !== '/images/themes/theme1.png' && (
              <div className='overlay-container'>
                {selectedSelfie ? (<img className='selfie' src={selectedSelfie} key={selectedSelfie} alt=""></img>
                ) : (
                  <Webcam
                    className='webcam'
                    audio={false} 
                    mirrored={true}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{facingMode: "user"}}
                  />
                )}
                <img className='overlay-theme' src={selectedTheme} key={selectedTheme} alt=""></img>
            </div>
            )}
          </div>
          <div className="next-button-container" style={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
            <button
              className="button next"
              onClick={handleNext}
              disabled={!selectedTheme || selectedTheme === '/images/themes/theme1.png'}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && mode === 'selfie' && (
        <div className="step3 camera-centered">
          <div className='overlay-container'>
            {selectedSelfie ? (
              <img className='selfie' src={selectedSelfie} alt="Selfie" />
            ) : (
              <Webcam
                className='webcam'
                audio={false}
                mirrored={true}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{facingMode: "user"}}
              />
            )}
            <img className='overlay-theme' src={selectedTheme} alt="Theme Overlay" />
            <FaRegCircle className='capture-button' onClick={startCountdown}/>
            {countdown !== null && countdown > 0 && (
              <div className="countdown-animation">{countdown}</div>
            )}
          </div>
          <div className="button-group">
            <button className="button prev bottom-left" onClick={handleBack}>Back</button>
          </div>
          <button className='hidden button retake' onClick={reset}>Retake</button>
          <button className='hidden button confirm' onClick={handleConfirm}>Confirm</button>
        </div>
      )}
    </div>
  );
};

export default CameraPage;