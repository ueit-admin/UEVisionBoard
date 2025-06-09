import React from 'react';
import '../styles/LandingPage.css';
import { IoColorPaletteOutline } from "react-icons/io5";
import { IoCameraOutline } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoPrintOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { TbArrowBadgeRight } from "react-icons/tb";

const LandingPage = ({ Create }) => {

  return (
    <div className='landing-page'>
      <img className='background-image' src="images/background.jpg" alt='UCR Background'></img>
      <div className='main'>
        <div className='card welcome'>
          <img className='ucr-ray' src="images/ray.png"></img>
          <h1>Welcome to the UCR Undergraduate Education Vision Space!</h1>
          <div className='instructions'>
            <div className='item'>
              <IoColorPaletteOutline className='icon'/>
              <h3>Choose<br/>A<br/>Theme</h3>
            </div>
            <TbArrowBadgeRight className='arrow'/>
            <div className='item'>
              <IoCameraOutline className='icon'/>
              <h3>Take<br/>A<br/>Selfie</h3>
            </div>
            <TbArrowBadgeRight className='arrow'/>
            <div className='item'>
              <RiEmojiStickerLine className='icon'/>
              <h3>Customize<br/>With<br/>Stickers</h3>
            </div>
            <TbArrowBadgeRight className='arrow'/>
            <div className='item'>
              <IoPrintOutline className='icon'/>
              <h3>Print<br/>Your<br/>Poster</h3>
            </div>
          </div>
        </div>
        <button className='card main-button' onClick={Create}>Create Your Vision</button>
      </div>
    </div>
  );
}

export default LandingPage;