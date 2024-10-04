import React from 'react';
import '../styles/LandingPage.css';
import { IoColorPaletteOutline } from "react-icons/io5";
import { IoCameraOutline } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoPrintOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";

const LandingPage = ({ Create }) => {

  return (
    <div className='landing-page'>
      <img className='background-image' src="images/background.jpg" alt='UCR Background'></img>
      <div className='main'>
        <h1 className='card'>Welcome to the UCR Undergraduate Education Vision Space!</h1>
        <div className='instructions'>
          <div className='card item' onClick={Create}>
            <IoColorPaletteOutline className='icon'/>
            <h2>Choose<br/>A<br/>Theme</h2>
          </div>
          <IoIosArrowForward className='card arrow'/>
          <div className='card item' onClick={Create}>
            <IoCameraOutline className='icon'/>
            <h2>Take<br/>A<br/>Selfie</h2>
          </div>
          <IoIosArrowForward className='card arrow'/>
          <div className='card item' onClick={Create}>
            <RiEmojiStickerLine className='icon'/>
            <h2>Customize<br/>With<br/>Stickers</h2>
          </div>
          <IoIosArrowForward className='card arrow'/>
          <div className='card item' onClick={Create}>
            <IoPrintOutline className='icon'/>
            <h2>Print<br/>Your<br/>Poster</h2>
          </div>
        </div>
        <button className='card' onClick={Create}>Create Your Vision</button>
      </div>
    </div>
  );
}

export default LandingPage;
