import React, { useState, useRef, useCallback } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useDropzone } from 'react-dropzone';
import './app.css';

// ⚠️ Pastikan file frame ada di folder public
const FRAME_URL = "/frame-ldks.png"; 

const App = () => {
  // --- STATE ---
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(1.2); 
  const [rotate, setRotate] = useState(0); 
  const [copySuccess, setCopySuccess] = useState("Salin Caption");
  
  const editorRef = useRef(null);
  const lastPinchDist = useRef(null); 

  // --- LOGIC DROPZONE ---
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setImage(acceptedFiles[0]);
      setScale(1.2);
      setRotate(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    noClick: !!image 
  });

  // --- LOGIC ZOOM (MOUSE SCROLL) ---
  const handleWheel = (e) => {
    if (image) {
      e.preventDefault(); 
      const zoomSensitivity = 0.05;
      const delta = e.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
      const newScale = Math.min(Math.max(scale + delta, 1), 5);
      setScale(newScale);
    }
  };

  // --- LOGIC ZOOM (PINCH / CUBIT DI HP) ---
  const getDistance = (touch1, touch2) => {
    return Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = getDistance(e.touches[0], e.touches[1]);
      lastPinchDist.current = dist;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && lastPinchDist.current) {
      const dist = getDistance(e.touches[0], e.touches[1]);
      const zoomFactor = dist / lastPinchDist.current;
      const newScale = Math.min(Math.max(scale * (zoomFactor), 1), 5);
      setScale(newScale);
      lastPinchDist.current = dist; 
    }
  };

  const handleTouchEnd = () => {
    lastPinchDist.current = null;
  };

  // --- DOWNLOAD LOGIC ---
  const handleDownload = async () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const ctx = canvas.getContext('2d');

      const frameImg = new Image();
      frameImg.src = FRAME_URL;
      frameImg.crossOrigin = "anonymous"; 
      
      frameImg.onload = () => {
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = 'TWIBBON-LDKS-2025.png';
        link.href = dataUrl;
        link.click();
      };
    }
  };

  // --- CAPTION LOGIC BARU ---
  const captionText = `💫 I'm ready to find direction and become better with LDKS SMK Telkom Sidoarjo 2025! 💫\n\nHalo teman-teman 👋🏻\nPerkenalkan, saya [Nama kamu] dari [Organisasi Kamu] selaku Peserta LDKS SMK Telkom Sidoarjo siap menjalani rangkaian kegiatan LDKS dengan penuh semangat, disiplin, dan aktif. Saya siap belajar, berproses, dan tumbuh menjadi pribadi yang lebih tangguh dan bertanggung jawab.\n\n⏳Motto Hidup\n[Isi dengan motto kamu]\n\n"From Inspiration to Transformation"\nSee you at LDKS SMK Telkom Sidoarjo 2025 👀\n\n@smktelkomsda @osis.smktelkomsda @mpk.smktelkomsda\n#LDKS2025 #LDKSKOMDA2025 #Leadership`;

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(captionText);
      setCopySuccess("Berhasil Disalin!");
      setTimeout(() => setCopySuccess("Salin Caption"), 3000);
    } catch (err) {
      setCopySuccess("Gagal Menyalin");
    }
  };

  return (
    <div className="app-container">
      <div className="main-wrapper">
        
        {/* KARTU EDITOR */}
        <div className="card twibbon-card">
          <h1>Twibbon LDKS SMK Telkom Sidoarjo 2025</h1>
          <p className="subtitle">Cubit (Pinch) untuk Zoom, Geser untuk atur posisi.</p>
          
          {!image ? (
            <div {...getRootProps()} className={`dropzone-area ${isDragActive ? 'dropzone-active' : ''}`}>
              <input {...getInputProps()} />
              <span className="icon-upload">☁️</span>
              <p>Klik atau Tarik Foto ke Sini</p>
            </div>
          ) : (
            <div className="editor-container">
              {/* AREA INTERAKSI */}
              <div 
                className="twibbon-wrapper" 
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <AvatarEditor
                  ref={editorRef}
                  image={image}
                  width={1080}
                  height={1080}
                  border={0}
                  scale={scale}
                  rotate={rotate}
                  style={{ background: '#fff', cursor: 'move' }}
                />
                <img src={FRAME_URL} alt="Frame" className="frame-overlay" />
              </div>

              {/* SLIDER CONTROLS */}
              <div className="controls">
                <div className="slider-group">
                    <span className="slider-label">🔍 Zoom</span>
                    <input
                      type="range"
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      min="1" max="5" step="0.05" value={scale}
                    />
                </div>
                <div className="slider-group">
                    <span className="slider-label">🔄 Putar</span>
                    <input
                      type="range"
                      onChange={(e) => setRotate(parseFloat(e.target.value))}
                      min="-180" max="180" step="1" value={rotate}
                    />
                </div>
                <button className="btn btn-ganti" onClick={() => setImage(null)}>
                  📂 Ganti Foto Lain
                </button>
              </div>
              
              <button className="btn btn-download" onClick={handleDownload}>
                DOWNLOAD DISNI
              </button>
            </div>
          )}
        </div>

        {/* KARTU CAPTION (UPDATE BARU) */}
        <div className="card caption-card">
          <h2>📋 Caption</h2>
          <div className="caption-box">
            <p>💫 I'm ready to find direction and become better with LDKS SMK Telkom Sidoarjo 2025! 💫</p>
            <br/>
            
            <p>Halo teman-teman 👋🏻<br/>
            Perkenalkan, saya <b>[Nama kamu]</b> dari <b>[Organisasi Kamu]</b> selaku Peserta LDKS SMK Telkom Sidoarjo siap menjalani rangkaian kegiatan LDKS dengan penuh semangat, disiplin, dan aktif. Saya siap belajar, berproses, dan tumbuh menjadi pribadi yang lebih tangguh dan bertanggung jawab.</p>
            <br/>
            
            <p>⏳Motto Hidup<br/>
            <b>[Isi dengan motto kamu]</b></p>
            <br/>
            
            <blockquote className="quote">"From Inspiration to Transformation"</blockquote>
            
            <p>See you at LDKS SMK Telkom Sidoarjo 2025 👀</p>
            <br/>
            
            {/* Bagian Tag & Hashtag */}
            <p style={{color: '#c8102e', fontWeight: 'bold', fontSize: '0.85rem'}}>
                @smktelkomsda @osis.smktelkomsda @mpk.smktelkomsda<br/>
                #LDKS2025 #LDKSKOMDA2025 #Leadership
            </p>
          </div>
          
          <button 
            className={`btn btn-copy ${copySuccess.includes("Berhasil") ? 'success' : ''}`} 
            onClick={handleCopyCaption}
          >
            {copySuccess}
          </button>
        </div>

      </div>
    </div>
  );
};

export default App;