import React, { useState } from 'react';
import CameraPage from './components/CameraPage';
import LandingPage from './components/LandingPage';
import StickerPage from './components/StickerPage';
import './App.css';

function App() {

  const [step, setStep] = useState('start');
  const [selfie, setSelfie] = useState(null);
  const [theme, setTheme] = useState(null);

  const createBoard = () => {
    setStep('camera');
  };
  
  const confirmSelfieAndTheme = (tempSelfie, tempTheme) => {
    setSelfie(tempSelfie);
    setTheme(tempTheme);
    setStep('edit');
  };

  const restart = () => {
    setStep('start');
  }

  return (
    <div className="App">
      <div className='content-pages'>
        {step === 'start' && (
          <LandingPage Create={createBoard} />
        )}

        {step === 'camera' && (
            <CameraPage Confirm={confirmSelfieAndTheme}/>
        )}

        {step === 'edit' && (
          <StickerPage selfie={selfie} theme={theme} Restart={restart}/>
        )}
      </div>
      <div className='mobile-disclaimer'>
        <h1>Please access this<br/>website on a laptop</h1>
      </div>

    </div>
  );
}

export default App;
