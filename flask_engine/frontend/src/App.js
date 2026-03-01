import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const FLASK_API_URL = process.env.REACT_APP_FLASK_API_URL || 'http://localhost:5000';
  const [videoFile, setVideoFile] = useState(null);
  const [location, setLocation] = useState('');
  const [report, setReport] = useState('');
  const [summary, setSummary] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Detecting accidents...');

  useEffect(() => {
    let timers = [];

    if (loading) {
      setLoadingMessage('Detecting accidents...');
      timers.push(setTimeout(() => setLoadingMessage('Analyzing severity...'), 20000));
      timers.push(setTimeout(() => setLoadingMessage('Generating detailed report...'), 40000));
    }

    return () => timers.forEach(clearTimeout);
  }, [loading]);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
    setReport('');
    setSummary('');
    setImages([]);
  };

  const handleUpload = async () => {
    if (!videoFile || location.trim() === '') {
      alert("Please select a video file and enter a location.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('location', location);

    try {
      const res = await fetch(`${FLASK_API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        alert("Error: " + data.error);
        setLoading(false);
        return;
      }

      setReport(data.report);
      setSummary(data.summary);
      setImages(data.images);
    } catch (err) {
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <div className="header-text">
              <h1 className="app-title">SafeSight</h1>
              <p className="app-subtitle">AI-Powered Accident Detection & Analysis</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Upload Section */}
        <section className="upload-card">
          <h2 className="section-title">
            <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            UPLOAD CCTV FOOTAGE
          </h2>

          <div className="form-fields">
            {/* Location Input */}
            <div className="input-group">
              <label className="input-label">Location</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <input
                  type="text"
                  placeholder="Enter accident location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="text-input"
                />
              </div>
            </div>

            {/* File Input */}
            <div className="input-group">
              <label className="input-label">Video File</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="file-input-hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="file-input-label">
                  <svg className="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                  <div className="file-text">
                    <p className="file-name">{videoFile ? videoFile.name : 'Click to select video file'}</p>
                    <p className="file-hint">MP4, AVI, MOV supported</p>
                  </div>
                </label>
              </div>
            </div>
            {/* Video Preview */}
            {videoFile && (
              <div className="video-preview">
                <video
                  width="50%"
                  height="auto"
                  left="20mm"
                  controls
                  src={URL.createObjectURL(videoFile)}
                  style={{ marginLeft: "70mm", borderRadius: "10px" }}

                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}


            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={loading}
              className="upload-button"
            >
              {loading ? (
                <>
                  <div className="button-spinner" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Analyze Video</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <section className="loading-card">
            <div className="loading-content">
              <div className="loading-spinner-wrapper">
                <div className="loading-spinner" />
                <svg className="loading-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="loading-text">
                <p className="loading-message">{loadingMessage}</p>
                <p className="loading-hint">This may take a few moments</p>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" />
              </div>
            </div>
          </section>
        )}

        {/* Image Gallery */}
        {!loading && images.length > 0 && (
          <section className="results-card">
            <h2 className="section-title">
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              Detected Frames
            </h2>
            <div className="image-gallery">
              {images.map((img, i) => (
                <div key={i} className="gallery-item">
                  <img
                    src={`${FLASK_API_URL}${img}`}
                    alt={`frame-${i}`}
                    className="gallery-image"
                  />
                  <div className="gallery-overlay">
                    <span className="gallery-label">Frame {i + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interactive Report & Summary Cards */}
        {!loading && (report || summary) && (
          <section className="interactive-container">
            {/* REPORT CARD */}
            {report && (
              <div
                className="flip-card report"
                onClick={(e) => e.currentTarget.classList.toggle("expanded")}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front report-front">
                    <h3>VIEW </h3>
                    <h2>REPORT</h2>
                  </div>
                  <div className="flip-card-back report-back">
                    <h3>Detailed Collision Insights</h3>
                    <p>Click to view the full accident report.</p>
                  </div>
                </div>
                <div className="expanded-content">
                  <pre>{report}</pre>
                </div>
              </div>
            )}

            {/* SUMMARY CARD */}
            {summary && (
              <div
                className="flip-card summary"
                onClick={(e) => e.currentTarget.classList.toggle("expanded")}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front summary-front">
                    <h3>VIEW </h3>
                    <h2>SUMMARY</h2>
                  </div>
                  <div className="flip-card-back summary-back">
                    <h3>Executive Overview</h3>
                    <p>Click to view the full summary of events.</p>
                  </div>
                </div>
                <div className="expanded-content">
                  <pre>{summary}</pre>
                </div>
              </div>
            )}
          </section>
        )}


      </main>
    </div>
  );
}

export default App;

// import React, { useState, useEffect } from 'react';
// import './App.css';

// function App() {
//   const [videoFile, setVideoFile] = useState(null);
//   const [location, setLocation] = useState('');
//   const [report, setReport] = useState('');
//   const [summary, setSummary] = useState('');
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState('Detecting accidents...');

//   useEffect(() => {
//     let timers = [];

//     if (loading) {
//       setLoadingMessage('Detecting accidents...');
//       timers.push(setTimeout(() => setLoadingMessage('Detecting severity...'), 20000));
//       timers.push(setTimeout(() => setLoadingMessage('Generating report...'), 40000));
//     }

//     return () => timers.forEach(clearTimeout);
//   }, [loading]);

//   const handleFileChange = (e) => {
//     setVideoFile(e.target.files[0]);
//     setReport('');
//     setSummary('');
//     setImages([]);
//   };

//   const handleUpload = async () => {
//     if (!videoFile || location.trim() === '') {
//       alert("Please select a video file and enter a location.");
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     formData.append('video', videoFile);
//     formData.append('location', location);

//     try {
//       const res = await fetch('http://localhost:5000/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await res.json();

//       if (data.error) {
//         alert("Error: " + data.error);
//         setLoading(false);
//         return;
//       }

//       setReport(data.report);
//       setSummary(data.summary);
//       setImages(data.images);
//     } catch (err) {
//       alert("Upload failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="App">
//       <h1> SafeSight</h1>

//       <div className="form-container">
//         <input
//           type="text"
//           placeholder="📍 Enter Location"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//         />

//         <input
//           type="file"
//           accept="video/*"
//           onChange={handleFileChange}
//         />

//         <button onClick={handleUpload} disabled={loading}>
//           {loading ? 'Processing...' : 'Upload Video'}
//         </button>
//       </div>

//       {loading && (
//         <div className="loader">
//           <div className="spinner" />
//           <p>{loadingMessage}</p>
//         </div>
//       )}

//       {!loading && images.length > 0 && (
//         <div className="image-gallery">
//           {images.map((img, i) => (
//             <img key={i} src={`http://localhost:5000${img}`} alt={`frame-${i}`} />
//           ))}
//         </div>
//       )}

//       {!loading && report && (
//         <div className="report">
//           <h2>📋 Report</h2>
//           <pre>{report}</pre>
//         </div>
//       )}

//       {!loading && summary && (
//         <div className="summary">
//           <h2>📝 Summary</h2>
//           <pre>{summary}</pre>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;






// import React, { useState, useEffect } from 'react';
// import './App.css';

// function App() {
//   const [videoFile, setVideoFile] = useState(null);
//   const [report, setReport] = useState('');
//   const [summary, setSummary] = useState('');
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState('Detecting accidents...');

//   useEffect(() => {
//   let timers = [];

//   if (loading) {
//     setLoadingMessage('Detecting accidents...');

//     timers.push(setTimeout(() => {
//       setLoadingMessage('Detecting severity...');
//     }, 25000));

//     timers.push(setTimeout(() => {
//       setLoadingMessage('Generating report...');
//     }, 45000));
//   }

//   return () => {
//     // Clear all timers on cleanup
//     timers.forEach(clearTimeout);
//   };
// }, [loading]);


//   const handleFileChange = (e) => {
//     setVideoFile(e.target.files[0]);
//     setReport('');
//     setSummary('');
//     setImages([]);
//   };

//   const handleUpload = async () => {
//     if (!videoFile) {
//       alert("Please select a video file first.");
//       return;
//     }

//     setLoading(true);

//     const formData = new FormData();
//     formData.append('video', videoFile);

//     try {
//       const res = await fetch('http://localhost:5000/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await res.json();

//       if (data.error) {
//         alert("Error: " + data.error);
//         setLoading(false);
//         return;
//       }

//       setReport(data.report);
//       setSummary(data.summary);
//       setImages(data.images);
//     } catch (err) {
//       alert("Upload failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="App" style={{ maxWidth: 800, margin: '20px auto', fontFamily: 'Segoe UI, sans-serif' }}>
//       <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>🚗 Accident Detection System</h1>

//       <div style={{ marginBottom: 20, textAlign: 'center' }}>
//         <input
//           type="file"
//           accept="video/*"
//           onChange={handleFileChange}
//           style={{ marginBottom: 10 }}
//         />
//         <br />
//         <button
//           onClick={handleUpload}
//           disabled={loading}
//           style={{
//             backgroundColor: '#3498db',
//             color: 'white',
//             border: 'none',
//             padding: '10px 20px',
//             borderRadius: 5,
//             cursor: loading ? 'not-allowed' : 'pointer',
//           }}
//         >
//           {loading ? 'Processing...' : 'Upload Video'}
//         </button>
//       </div>

//       {loading && (
//         <div style={{ textAlign: 'center', margin: '20px 0' }}>
//           <div className="spinner" style={{
//             border: '6px solid #f3f3f3',
//             borderTop: '6px solid #3498db',
//             borderRadius: '50%',
//             width: 40,
//             height: 40,
//             margin: 'auto',
//             animation: 'spin 1s linear infinite',
//           }} />
//           <p style={{ marginTop: 10, fontWeight: 'bold' }}>{loadingMessage}</p>
//         </div>
//       )}

//       {!loading && images.length > 0 && (
//         <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
//           {images.map((img, i) => (
//             <img
//               key={i}
//               src={`http://localhost:5000${img}`}
//               alt={`frame-${i}`}
//               style={{ maxWidth: 400, borderRadius: 8, boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
//             />
//           ))}
//         </div>
//       )}

//       {!loading && report && (
//         <div style={{
//           background: '#f9f9f9',
//           padding: 20,
//           borderRadius: 8,
//           marginTop: 30,
//           boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//         }}>
//           <h2 style={{ marginBottom: 10 }}>📋 Report</h2>
//           <pre style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{report}</pre>
//         </div>
//       )}

//       {!loading && summary && (
//         <div style={{
//           background: '#f4f4f4',
//           padding: 20,
//           borderRadius: 8,
//           marginTop: 30,
//           boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//         }}>
//           <h2 style={{ marginBottom: 10 }}>📝 Summary</h2>
//           <pre style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{summary}</pre>
//         </div>
//       )}

//       <style>
//         {`
//           @keyframes spin {
//             0% { transform: rotate(0deg);}
//             100% { transform: rotate(360deg);}
//           }
//         `}
//       </style>
//     </div>
//   );
// }

// export default App;
