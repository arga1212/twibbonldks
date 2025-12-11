import React, { useState, useRef, useCallback } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useDropzone } from 'react-dropzone';
import './app.css';

// ⚠️ Pastikan file frame kamu resolusinya BAGUS (minimal 1000x1000px)
const FRAME_URL = "/frame-ldks.png"; 

const App = () => {
  // --- STATE ---
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(1.2); 
  const [rotate, setRotate] = useState(0); // Tambah fitur putar biar flexible
  const [copySuccess, setCopySuccess] = useState("Salin Caption");
  const editorRef = useRef(null);

  // --- LOGIC TWIBBON ---
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
    noClick: !!image // Biar kalau udah ada gambar, klik area editor ga buka file picker lagi (biar fokus geser)
  });

  // --- FITUR ZOOM PAKAI SCROLL MOUSE ---
  const handleWheel = (e) => {
    if (image) {
      // Mencegah halaman ikut scroll saat nge-zoom foto
      e.preventDefault(); 
      const zoomSensitivity = 0.05; // Atur kecepatan zoom
      const delta = e.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
      const newScale = Math.min(Math.max(scale + delta, 1), 5); // Batas zoom 1x - 5x
      setScale(newScale);
    }
  };

  const handleDownload = async () => {
    if (editorRef.current) {
      // TRICK RAHASIA: Kita ambil canvas yang SUDAH jadi (1080x1080) dari editor
      // Ini menjamin preview di layar = hasil download 100% SAMA.
      const canvas = editorRef.current.getImageScaledToCanvas();
      const ctx = canvas.getContext('2d');

      // Gambar Frame di atasnya
      const frameImg = new Image();
      frameImg.src = FRAME_URL;
      frameImg.crossOrigin = "anonymous"; 
      
      frameImg.onload = () => {
        // Gambar frame seukuran canvas (1080x1080)
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
        
        // Download
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = 'TWIBBON-LDKS-2025.png';
        link.href = dataUrl;
        link.click();
      };
    }
  };

  // --- LOGIC CAPTION (SAMA KAYAK SEBELUMNYA) ---
  const captionText = `💫 I'm ready to find direction and become better with LDKS SMK Telkom Sidoarjo 2025! 💫\n\nHalo teman-teman 👋🏻\nPerkenalkan, saya [Nama kamu] dari [Organisasi Kamu] selaku Peserta LDKS SMK Telkom Sidoarjo siap menjalani rangkaian kegiatan LDKS dengan penuh semangat, disiplin, dan aktif. Saya siap belajar, berproses, dan tumbuh menjadi pribadi yang lebih tangguh dan bertanggung jawab.\n\n⏳Motto Hidup\n[Isi dengan motto kamu]\n\n"From Inspiration to Transformation"\nSee you at LDKS SMK Telkom Sidoarjo 2025 👀`;

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
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <div className="main-wrapper">
        
        {/* === KARTU GENERATOR === */}
        <div className="card twibbon-card">
          <h1>Twibbon LDKS SMK Telkom Sidoarjo 2025</h1>
          <p className="subtitle">Geser, Zoom (Scroll), dan Putar fotomu agar pas!</p>
          
          {!image ? (
            <div {...getRootProps()} className={`dropzone-area ${isDragActive ? 'dropzone-active' : ''}`}>
              <input {...getInputProps()} />
              <span className="icon-upload">☁️</span>
              <p>Klik atau Tarik Foto ke Sini</p>
            </div>
          ) : (
            <div className="editor-container">
              {/* WRAPPER EDITOR */}
              {/* Kita pasang onWheel disini biar bisa scroll-zoom */}
              <div 
                className="twibbon-wrapper" 
                onWheel={handleWheel}
              >
                <AvatarEditor
                  ref={editorRef}
                  image={image}
                  // KITA SET RESOLUSI TINGGI LANGSUNG DISINI
                  width={1080}
                  height={1080}
                  border={0}
                  scale={scale}
                  rotate={rotate}
                  style={{ background: '#fff', cursor: 'move' }}
                />
                <img src={FRAME_URL} alt="Frame" className="frame-overlay" />
              </div>

              {/* KONTROLS */}
              <div className="controls">
                
                {/* Control Zoom */}
                <div className="slider-group">
                    <span className="slider-label">🔍 Zoom</span>
                    <input
                      type="range"
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      min="1"
                      max="5"
                      step="0.05"
                      value={scale}
                    />
                </div>

                {/* Control Putar (Rotasi) - FITUR BARU */}
                <div className="slider-group">
                    <span className="slider-label">🔄 Putar</span>
                    <input
                      type="range"
                      onChange={(e) => setRotate(parseFloat(e.target.value))}
                      min="-180"
                      max="180"
                      step="1"
                      value={rotate}
                    />
                </div>
                
                <button className="btn btn-ganti" onClick={() => setImage(null)}>
                  📂 Ganti Foto Lain
                </button>
              </div>
              
              <button className="btn btn-download" onClick={handleDownload}>
                DOWNLOAD HASIL
              </button>
            </div>
          )}
        </div>

        {/* === KARTU CAPTION === */}
        <div className="card caption-card">
          <h2>📋 Caption Siap Pakai</h2>
          <div className="caption-box">
            <p>💫 I'm ready to find direction and become better with LDKS SMK Telkom Sidoarjo 2025! 💫</p>
            <br/>
            <p>Halo teman-teman 👋🏻<br/>
            Perkenalkan, saya <b>[Nama kamu]</b> dari <b>[Organisasi Kamu]</b> selaku Peserta LDKS SMK Telkom Sidoarjo siap menjalani rangkaian kegiatan LDKS dengan penuh semangat, disiplin, dan aktif.</p>
            <br/>
            <blockquote className="quote">"From Inspiration to Transformation"</blockquote>
            <p>See you at LDKS SMK Telkom Sidoarjo 2025 👀</p>
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