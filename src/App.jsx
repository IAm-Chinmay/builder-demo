import React, { Suspense, lazy, useState, useEffect } from "react";

// Lazy load the ModelViewer for better initial page load
const ModelViewer = lazy(() => import("./ModelViewer"));

function App() {
  const [isModelViewerVisible, setIsModelViewerVisible] = useState(false);
  const [modelUrl, setModelUrl] = useState(
    // Fixed GitHub CDN URL - remove 'public/' from the path
    "https://cdn.jsdelivr.net/gh/IAm-Chinmay/builder-demo@main/2BHK.glb"
  );

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsModelViewerVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const target = document.getElementById("model-container");
    if (target) {
      observer.observe(target);
    }

    return () => observer.disconnect();
  }, []);

  // Preload the model file
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = modelUrl;
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [modelUrl]);

  const LoadingFallback = () => (
    <div
      style={{
        width: "100%",
        height: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
        border: "1px solid #e9ecef",
        borderRadius: "12px",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "3px solid #e9ecef",
          borderTop: "3px solid #007bff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <div style={{ color: "#6c757d", fontSize: "16px" }}>
        Initializing 3D Viewer...
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      {/* Header */}
      <header
        style={{
          textAlign: "center",
          marginBottom: "40px",
          padding: "20px 0",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            background: "linear-gradient(135deg, #007bff, #0056b3)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "8px",
          }}
        >
          Building Design AR Viewer
        </h1>
        <p
          style={{
            color: "#6c757d",
            fontSize: "1.1rem",
            margin: "0",
          }}
        >
          Explore your 3D building model with interactive controls and AR
          support
        </p>
      </header>

      {/* Model Selector */}
      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "12px",
          border: "1px solid #e9ecef",
        }}
      >
        <h3
          style={{
            margin: "0 0 15px 0",
            color: "#343a40",
            fontSize: "1.2rem",
          }}
        >
          Model Options
        </h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() =>
              setModelUrl(
                "https://cdn.jsdelivr.net/gh/IAm-Chinmay/builder-demo@main/2BHK.glb"
              )
            }
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: modelUrl.includes("2BHK.glb")
                ? "2px solid #007bff"
                : "1px solid #dee2e6",
              backgroundColor: modelUrl.includes("2BHK.glb")
                ? "#e7f3ff"
                : "white",
              color: modelUrl.includes("2BHK.glb") ? "#007bff" : "#495057",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
          >
            2BHK Model
          </button>

          {/* Test with a known working model */}
          <button
            onClick={() =>
              setModelUrl(
                "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
              )
            }
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: modelUrl.includes("Astronaut.glb")
                ? "2px solid #007bff"
                : "1px solid #dee2e6",
              backgroundColor: modelUrl.includes("Astronaut.glb")
                ? "#e7f3ff"
                : "white",
              color: modelUrl.includes("Astronaut.glb") ? "#007bff" : "#495057",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
          >
            Test Model (Astronaut)
          </button>
        </div>
      </div>

      {/* Model Container */}
      <div
        id="model-container"
        style={{
          marginBottom: "30px",
          position: "relative",
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {isModelViewerVisible ? (
            <ModelViewer modelUrl={modelUrl} />
          ) : (
            <div
              style={{
                width: "100%",
                height: "500px",
                backgroundColor: "#f8f9fa",
                border: "1px solid #e9ecef",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6c757d",
                fontSize: "16px",
              }}
            >
              Scroll down to load 3D viewer...
            </div>
          )}
        </Suspense>
      </div>

      {/* Feature Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginTop: "40px",
        }}
      >
        <div
          style={{
            padding: "24px",
            backgroundColor: "white",
            borderRadius: "12px",
            border: "1px solid #e9ecef",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              color: "#343a40",
              marginBottom: "12px",
              fontSize: "1.2rem",
            }}
          >
            🎮 Interactive Controls
          </h3>
          <p
            style={{
              color: "#6c757d",
              margin: "0",
              lineHeight: "1.5",
            }}
          >
            Drag to rotate, scroll to zoom, and explore every angle of your 3D
            building model with smooth controls.
          </p>
        </div>

        <div
          style={{
            padding: "24px",
            backgroundColor: "white",
            borderRadius: "12px",
            border: "1px solid #e9ecef",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              color: "#343a40",
              marginBottom: "12px",
              fontSize: "1.2rem",
            }}
          >
            📱 AR Experience
          </h3>
          <p
            style={{
              color: "#6c757d",
              margin: "0",
              lineHeight: "1.5",
            }}
          >
            View your building in augmented reality using your mobile device.
            See how it looks in real space.
          </p>
        </div>

        <div
          style={{
            padding: "24px",
            backgroundColor: "white",
            borderRadius: "12px",
            border: "1px solid #e9ecef",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              color: "#343a40",
              marginBottom: "12px",
              fontSize: "1.2rem",
            }}
          >
            ⚡ Optimized Loading
          </h3>
          <p
            style={{
              color: "#6c757d",
              margin: "0",
              lineHeight: "1.5",
            }}
          >
            Smart loading with progress tracking and optimized performance for
            large 3D models.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          marginTop: "60px",
          padding: "20px 0",
          borderTop: "1px solid #e9ecef",
          color: "#6c757d",
        }}
      >
        <p style={{ margin: "0", fontSize: "14px" }}>
          Powered by Google Model Viewer • Built with React
        </p>
      </footer>
    </div>
  );
}

export default App;
