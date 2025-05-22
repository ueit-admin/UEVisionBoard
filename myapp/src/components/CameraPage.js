import React, { useRef, useState, } from 'react';
import Webcam from 'react-webcam';
import '../styles/CameraPage.css';
import { FaRegCircle } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

const CameraPage = ({ Confirm }) => {

  const [selectedTheme, setSelectedTheme] = useState('/images/themes/theme1.png');
  const [showScotty, setShowScotty] = useState(false);
  const [selectedSelfie, setSelectedSelfie] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const webcamRef = useRef(null);


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
    let retakeButton = document.querySelector(".retake");
    let confirmButton = document.querySelector(".confirm"); 
    let captureButton = document.querySelector(".capture-button"); 
    retakeButton.classList.remove('hidden');
    confirmButton.classList.remove('hidden');
    captureButton.classList.add('hidden');
    const webcamSrc = webcamRef.current.getScreenshot();
    setSelectedSelfie(webcamSrc);
    // do smth with Image
    // show confirm button
  }

  const handleConfirm = () => {
    Confirm(selectedSelfie, selectedTheme);
  }

  const importImages = (r) => {
    return r.keys().map(r);
  };
  
  const themes = importImages(require.context('../../public/images/themes', false, /\.(png|jpe?g|svg)$/));
  const scotty = importImages(require.context('../../public/images/scotty', false, /\.(png|jpe?g|svg)$/));

  const [step, setStep] = useState(1); // 1: select type, 2: select theme, 3: camera
  const [mode, setMode] = useState('selfie'); // 'selfie' or 'scotty'


  return (
  <div className='camera-page'>
    <div className='header'>
      <h1>Capture Your Vision!</h1>
    </div>
    <div className='body'>
    
      <div className='left-container'>
        {step === 1 && (
          <div className="step1">
            <h2>Choose your mode</h2><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <button
              className={`opt-button ${mode === 'selfie' ? 'blue' : ''}`}
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
            <button className="button next" onClick={() => setStep(2)}>
              Next
            </button>
            <br /><br /><br /><br /> <br /><br /><br /><br />
            <p className="info-text">
              {mode === 'selfie'
                ? 'Capture a selfie with a fun theme!'
                : 'Choose a Scotty avatar to capture!'}
            </p>
          </div>
        )}
        {step === 2 && (
          <div className="step2">
            <h2>{mode === 'selfie' ? 'Pick a selfie poster theme' : 'Pick a Scotty avatar theme'}</h2>
            <div className="theme-select">
              {(mode === 'selfie' ? themes : scotty).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={mode === 'selfie' ? `theme-${idx}` : `scotty-${idx}`}
                  onClick={() => setSelectedTheme(img)}
                  className={selectedTheme === img ? 'selected' : ''}
                />
              ))}
            </div>
            <button className="button prev" onClick={() => setStep(1)}>Back</button>         
            <button className="button next" onClick={() => setStep(3)} disabled={!selectedTheme}>
              Next
            </button>
          </div>
        )}
        {step === 3 && (
          <div className="step3">
            <div className='overlay-container'>
              {selectedSelfie ? (
                <img className='selfie' src={selectedSelfie} alt="" />
              ) : (
                <Webcam
                  className='webcam'
                  audio={false}
                  mirrored={true}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                />
              )}
              <img className='overlay-theme' src={selectedTheme} alt="" />
              <FaRegCircle className='capture-button' onClick={startCountdown} />
              {countdown !== null && countdown > 0 && (
                <div className="countdown-animation">{countdown}</div>
              )}
            </div>
            <button className='button prev' onClick={() => setStep(2)}>Back</button>
            <button className='hidden button retake' onClick={reset}>Retake</button>
            <button className='hidden button confirm' onClick={handleConfirm}>Confirm</button>
          </div>
        )}
      </div>
       <div className='right-container'> 
       
          {step === 2 && selectedTheme && selectedTheme !== '/images/themes/theme1.png' && (
             <><h2>Theme Selection Preview</h2><img
              src={selectedTheme}
              alt="Selected Theme"
              style={{ maxWidth: "100%", maxHeight: "80%", borderRadius: "1em" }} /></>
  )}
        </div>
    </div>
  </div>
);

};

export default CameraPage;