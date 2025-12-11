import React, { useState, useRef, useCallback } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useDropzone } from 'react-dropzone';
import './app.css';

// ⚠️ Pastikan file ini ada di folder /public
const FRAME_URL = "/frame-ldks.png"; 

const App = () => {
  // --- STATE UNTUK TWIBBON ---
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(1.2); 
  const editorRef = useRef(null);
  // --- STATE UNTUK CAPTION ---
  const [copySuccess, setCopySuccess] = useState("Salin Caption");

  // --- LOGIC TWIBBON ---
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
      const canvasUserPhoto = editorRef.current.getImage();
      const finalCanvas = document.createElement('canvas');
      // Set output HD (2160x2160)
      const size = 2160; 
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
        link.download = 'TWIBBON-LDKS-SMK-TELKOM-SDA.png';
        link.href = dataUrl;
        link.click();
      };
    }
  };

  // --- LOGIC COPY CAPTION ---
  const captionText = `💫 I'm ready to find direction and become better with LDKS SMK Telkom Sidoarjo 2025! 💫\n\nHalo teman-teman 👋🏻\nPerkenalkan, saya [Nama kamu] dari [Organisasi Kamu] selaku Peserta LDKS SMK Telkom Sidoarjo siap menjalani rangkaian kegiatan LDKS dengan penuh semangat, disiplin, dan aktif. Saya siap belajar, berproses, dan tumbuh menjadi pribadi yang lebih tangguh dan bertanggung jawab.\n\n⏳Motto Hidup\n[Isi dengan motto kamu]\n\n"From Inspiration to Transformation"\nSee you at LDKS SMK Telkom Sidoarjo 2025 👀`;

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(captionText);
      setCopySuccess("Berhasil Disalin! 🎉");
      setTimeout(() => setCopySuccess("Salin Caption"), 3000); // Reset setelah 3 detik
    } catch (err) {
      setCopySuccess("Gagal Menyalin 😢");
    }
  };


  return (
    <div className="app-container">
      {/* --- BACKGROUND ANIMATION --- */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="main-wrapper">
        
        {/* === KARTU KIRI: GENERATOR TWIBBON === */}
        <div className="card twibbon-card">
          <h1>Twibbon LDKS SMK Telkom Sidoarjo 2025</h1>
          <p className="subtitle">Upload foto terbaikmu dan sesuaikan posisinya di sini.</p>
          
          {!image ? (
            <div {...getRootProps()} className={`dropzone-area ${isDragActive ? 'dropzone-active' : ''}`}>
              <input {...getInputProps()} />
              <span className="icon-upload">☁️</span>
              <p>Klik atau Tarik Foto ke Sini</p>
            </div>
          ) : (
            <div className="editor-container">
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
                DOWNLOAD HASIL
              </button>
              
              <p style={{fontSize: '12px', color: '#999', marginTop: '10px'}}>
                *Geser foto di kotak untuk menyesuaikan posisi
              </p>
            </div>
          )}
        </div>

        {/* === KARTU KANAN: CAPTION TEMPLATE === */}
        <div className="card caption-card">
          <h2>📋 Template Caption</h2>
          <p className="subtitle">Salin caption ini untuk postingan media sosialmu.</p>
          
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
          </div>

          <button 
            className={`btn btn-copy ${copySuccess.includes("Berhasil") ? 'success' : ''}`} 
            onClick={handleCopyCaption}
          >
            {copySuccess.includes("Berhasil") ? '✅ ' : '📋 '} {copySuccess}
          </button>
          <p style={{fontSize: '12px', color: '#999', marginTop: '10px'}}>
            *Jangan lupa isi bagian dalam kurung siku [ ] ya!
          </p>
        </div>

      </div>
    </div>
  );
};

export default App;