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

  return (
    <div className='camera-page'>
      <div className='header'>
        <h1>Capture Your Vision!</h1>
      </div>
      <div className='body'>
        <div className='left-container'>
          <div className='opt-selector'>
            <button className={`opt-button opt-selfie ${showScotty ? '' : 'blue'}`} onClick={() => {setShowScotty(false)}}>Selfie</button>
            <button className={`opt-button opt-scotty ${showScotty ? 'blue' : ''}`} onClick={() => {setShowScotty(true)}}>Scotty</button>
          </div>
          <div className='theme-select'>   
            {!showScotty && (
              themes.map((theme, index) => (
                <img key={index} src={theme} alt={`theme-${index}`} onClick={updateTheme}/>
              ))
            )}
            {showScotty && (
              scotty.map((theme, index) => (
                <img key={index} src={theme} alt={`scotty-${index}`} onClick={updateTheme}/>
              ))
            )}
          </div>
        </div>
        <div className='photos-instructions'>
          <div className='selfie-scotty'>
            <IoIosArrowBack className='arrow'/>
            <h2>
              Choose to take a selfie<br />or use a Scotty avatar
            </h2>
          </div>
          <div className='choose-theme'>
            <IoIosArrowBack className='arrow'/>
            <h2>
              Pick a poster theme
            </h2>
          </div>
          <div className='take-picture'>
            <h2>
              Frame yourself and<br />capture your vision
            </h2>
            <IoIosArrowForward className='arrow'/>
          </div>
        </div>
        <div className='right-container'>
          <div className='overlay-container'>
            {selectedSelfie ? (
              <img className='selfie' src={selectedSelfie} key={selectedSelfie} alt=""></img>
            ) : (
              <Webcam
                className='webcam'
                audio={false} 
                mirrored={true}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  // height: parentHeight,
                  // width: (parentHeight * 11) / 17
                  // aspectRatio: 11/17,
                  facingMode: "user"
                }}
              />
            )}
            <img className='overlay-theme' src={selectedTheme} key={selectedTheme} alt=""></img>
            <FaRegCircle className='capture-button' onClick={startCountdown}/>
            {countdown !== null && countdown > 0 && (<div className="countdown-animation">{countdown}</div>)}
          </div>
          <button className='hidden button retake' onClick={reset}>Retake</button>
          <button className='hidden button confirm' onClick={handleConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );

};

export default CameraPage;