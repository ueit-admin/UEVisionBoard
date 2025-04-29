import React, { useRef, useState } from 'react';
import '../styles/StickerPage.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { IoIosCloseCircleOutline } from "react-icons/io";
import Draggable from 'react-draggable';
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { Rnd } from "react-rnd";

const StickerPage = ({ selfie, theme, Restart }) => {

    const sectionRef = useRef();
    const [showPopup, setShowPopup] = useState(false);
    const [stickers, setStickers] = useState([]);
    const [textBoxes, setTextBoxes] = useState([]);

    const addTextBox = () => {
        setTextBoxes((prev) => [
            ...prev,
            { 
                id: Date.now(),
                x: 100,
                y: 100,
                width: 200,
                height: 100,
                text: "Add text"
            }
        ]);
    };    

    const importImages = (r) => {
        return r.keys().map(r);
    };

    const stickerSources = importImages(require.context('../../public/images/stickers', false, /\.(png|jpe?g|svg)$/));

    const handleDrop = (event) => {
        event.preventDefault();
        const stickerSrc = event.dataTransfer.getData('stickerSrc');
        const canvasRect = event.currentTarget.getBoundingClientRect();
        
        // Calculate position relative to the canvas
        const x = event.clientX - canvasRect.left;
        const y = event.clientY - canvasRect.top;
        
        const img = new Image();
        img.src = stickerSrc;
        img.onload = () => {
            // Add the new sticker to the array, adjusting by half the width and height
            setStickers((prevStickers) => [
                ...prevStickers,
                { src: stickerSrc, x: x - 50, y: y - 50 }
            ]);
        };
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const clear = () => {
        setStickers([]);
        setTextBoxes([]);
    }
  
    const handleClose = () => {
        setShowPopup(false);
    };

    const screenshotAndPrint = async () => {
        const screenshotElement = sectionRef.current;
        const canvas = await html2canvas(screenshotElement);
        const image = canvas.toDataURL('image/png');
    
        // Create a PDF and add the image to it
        const tempPdf = new jsPDF({orientation: 'portrait', unit: 'in', format: 'tabloid'});
        const pdfWidth = tempPdf.internal.pageSize.getWidth();
        const pdfHeight = tempPdf.internal.pageSize.getHeight();
        tempPdf.addImage(image, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
        const blob = await tempPdf.output('blob');
        const pdfUrl = URL.createObjectURL(blob);
    
        // Detect if the browser is Chrome
        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    
        if (isChrome) {
            // Chrome-specific behavior: Open PDF in a new window
            const newWindow = window.open(pdfUrl);
            newWindow.onload = () => {
                newWindow.focus();
                newWindow.print();
    
                // Cleanup: revoke the object URL
                URL.revokeObjectURL(pdfUrl);
            };
        } else {
            // Create an invisible iframe
            let iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.top = '-10000px'; // Move it far out of view
            iframe.src = pdfUrl;
        
            // Append the iframe to the body
            document.body.appendChild(iframe);
        
            // Give the iframe time to load (important for Chrome)
            iframe.onload = () => {
                // Trigger print dialog manually on Chrome
                setTimeout(() => {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
        
                    // Clean up: remove the iframe and revoke the object URL
                    document.body.removeChild(iframe);
                    URL.revokeObjectURL(pdfUrl);
                }, 500); // Delay for Chrome to render the content before printing
            };
        }

        setTimeout(() => {setShowPopup(true)}, 1000);

    };

    return (
        <>
            <div className='sticker-page'>
                <div className='header'>
                    <h1>Customize With Stickers!</h1>
                </div>
                <div className='body'>
                    <div className='left-container'>
                        <div className='sticker-select'>
                        <button  className="text-blue" onClick={addTextBox}>Add Text</button>

                            {stickerSources.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`sticker-${index}`}
                                    draggable
                                    onDragStart={(event) => event.dataTransfer.setData('stickerSrc', src)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className='sticker-instructions'>
                        <div className='drag-sticker'>
                            <IoIosArrowBack className='arrow'/>
                            <h2>
                                Drag your favorite<br/>stickers to your poster
                            </h2>
                        </div>
                        <div className='rearrange-sticker'>
                            <h2>
                                Rearrange the stickers<br/>to your liking
                            </h2>
                            <IoIosArrowForward className='arrow'/>
                        </div>
                        <div className='print-vision'>
                            <h2>
                                Print your vision board!
                            </h2>
                            <IoIosArrowForward className='arrow'/>
                        </div>
                        </div>
                    <div className='right-container'>
                        <div className='overlay-container' ref={sectionRef}>
                            {selfie ? (
                                <img className='final-selfie' src={selfie} alt=""></img>
                            ) : (() => {})}
                            {theme ? (
                                <img className='final-theme' src={theme} alt=""></img>
                            ) : (() => {})}
                            <div className='sticker-canvas' onDrop={handleDrop} onDragOver={handleDragOver}>
                                {stickers.map((sticker, index) => (
                                    <Draggable onMouseDown={(e) => {e.preventDefault()}}>
                                        <img key={index} src={sticker.src} alt={`sticker-${index}`}style={{left: sticker.x,top: sticker.y,}} />
                                    </Draggable>
                                ))}
                                {textBoxes.map((box) => (
                                    <Rnd
                                        key={box.id}
                                        default={{ x: box.x, y: box.y, width: box.width, height: box.height }}
                                        bounds="parent"
                                        onDragStop={(e, d) => {
                                            setTextBoxes((prev) => prev.map((b) => b.id === box.id ? {...b, x: d.x, y: d.y} : b));
                                        }}
                                        onResizeStop={(e, direction, ref, delta, position) => {
                                            setTextBoxes((prev) => prev.map((b) => b.id === box.id ? {...b, width: ref.offsetWidth, height: ref.offsetHeight, x: position.x, y: position.y} : b));
                                        }}
                                    >
                                        <textarea
                                            className='textbox-blue'
                                            value={box.text}
                                            onChange={(e) =>
                                                setTextBoxes((prev) => prev.map((b) => b.id === box.id ? {...b, text: e.target.value} : b))
                                            }
                                        />
                                    </Rnd>
                                ))}
                            </div>
                        </div>
                        <button className='button clear' onClick={clear}>Clear</button>
                        <button className='button print' onClick={screenshotAndPrint}>Print</button>
                    </div>
                </div>
                {showPopup && (
                    <div className="popup">
                        <div className='opacity'/>
                        <div className='form'>
                            <IoIosCloseCircleOutline className='close' onClick={handleClose}/>
                            <button className='restart' onClick={Restart}>Restart</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default StickerPage;