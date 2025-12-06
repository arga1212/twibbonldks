import React, { useState, useRef, useCallback } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useDropzone } from 'react-dropzone';
import './app.css';

// ⚠️ Pastikan file ini ada di folder /public
const FRAME_URL = "/frame-ldks.png"; 

const App = () => {
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(1.2); 
  const editorRef = useRef(null);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setImage(acceptedFiles[0]);
      setScale(1.2);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleDownload = async () => {
    if (editorRef.current) {
      const canvasUserPhoto = editorRef.current.getImageScaledToCanvas();
      const finalCanvas = document.createElement('canvas');
      const size = 1080; 
      finalCanvas.width = size;
      finalCanvas.height = size;
      const ctx = finalCanvas.getContext('2d');

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(canvasUserPhoto, 0, 0, size, size);

      const frameImg = new Image();
      frameImg.src = FRAME_URL;
      frameImg.crossOrigin = "anonymous"; 
      frameImg.onload = () => {
        ctx.drawImage(frameImg, 0, 0, size, size);
        const dataUrl = finalCanvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = 'TWIBBON-LDKS-2025.png';
        link.href = dataUrl;
        link.click();
      };
    }
  };

  return (
    <div className="container">
      <h1>🇮🇩 Twibbon LDKS 2025</h1>
      <p className="subtitle">hai hai
      </p>
      
      {!image ? (
        <div {...getRootProps()} className={`dropzone-area ${isDragActive ? 'dropzone-active' : ''}`}>
          <input {...getInputProps()} />
          <span className="icon-upload">☁️</span>
          <p>Klik atau Tarik Foto ke Sini</p>
        </div>
      ) : (
        <div className="editor-container">
          {/* AREA EDITOR FOTO */}
          <div className="twibbon-wrapper">
            <AvatarEditor
              ref={editorRef}
              image={image}
              width={320}
              height={320}
              border={0}
              scale={scale}
              rotate={0}
              style={{ background: '#eee', cursor: 'grab' }}
            />
            <img src={FRAME_URL} alt="Frame" className="frame-overlay" />
          </div>

          {/* AREA KONTROL (Disini Slidernya) */}
          <div className="controls">
            <div className="slider-group">
                <span className="slider-label">🔍 Zoom:</span>
                <input
                  type="range"
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  min="1"
                  max="3"
                  step="0.01"
                  value={scale}
                  style={{width: '100%'}} 
                />
            </div>
            
            <button className="btn btn-ganti" onClick={() => setImage(null)}>
              🔄 Ganti Foto
            </button>
          </div>
          
          <button className="btn btn-download" onClick={handleDownload}>
            🚀 DOWNLOAD HASIL
          </button>
          
          <p style={{fontSize: '12px', color: '#999', marginTop: '10px'}}>
            *Geser/Drag foto di dalam kotak untuk pas-in posisi
          </p>
        </div>
      )}
    </div>
  );
};

export default App;