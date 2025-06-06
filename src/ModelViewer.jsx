import "@google/model-viewer";
import { useEffect, useRef, useState } from "react";

function ModelViewer({ modelUrl }) {
  const modelViewerRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const modelViewer = modelViewerRef.current;

    if (modelViewer) {
      // Add event listeners for debugging
      const handleLoad = () => {
        console.log("Model loaded successfully");
        setIsLoading(false);
        setError(null);
      };

      const handleError = (event) => {
        console.error("Model loading error:", event.detail);
        setError(
          `Failed to load model: ${event.detail?.message || "Unknown error"}`
        );
        setIsLoading(false);

        // Debug: Check if the URL is accessible
        fetch(modelUrl)
          .then((response) => {
            console.log("Response status:", response.status);
            console.log("Response headers:", [...response.headers.entries()]);
            console.log("Content-Type:", response.headers.get("content-type"));

            if (!response.ok) {
              throw new Error(
                `HTTP ${response.status}: ${response.statusText}`
              );
            }

            // Check if it's actually GLTF content
            const contentType = response.headers.get("content-type");
            if (
              contentType &&
              !contentType.includes("model/gltf") &&
              !contentType.includes("application/octet-stream")
            ) {
              console.warn("Unexpected content type:", contentType);
            }

            return response.text();
          })
          .then((text) => {
            console.log(
              "Response preview (first 200 chars):",
              text.substring(0, 200)
            );

            // Check if it's HTML (error page)
            if (
              text.trim().toLowerCase().startsWith("<!doctype") ||
              text.trim().toLowerCase().startsWith("<html")
            ) {
              console.error(
                "Received HTML instead of GLTF - likely a 404 or server error"
              );
              setError("Model file not found or server error");
            }
          })
          .catch((err) => {
            console.error("Fetch error:", err);
            setError(`Network error: ${err.message}`);
          });
      };

      const handleProgress = (event) => {
        const progress = event.detail.totalProgress;
        setLoadingProgress(progress);
        console.log(`Loading progress: ${(progress * 100).toFixed(1)}%`);
      };

      const handleModelReady = () => {
        console.log("Model is ready for interaction");
      };

      modelViewer.addEventListener("load", handleLoad);
      modelViewer.addEventListener("error", handleError);
      modelViewer.addEventListener("progress", handleProgress);
      modelViewer.addEventListener("model-visibility", handleModelReady);

      return () => {
        modelViewer.removeEventListener("load", handleLoad);
        modelViewer.removeEventListener("error", handleError);
        modelViewer.removeEventListener("progress", handleProgress);
        modelViewer.removeEventListener("model-visibility", handleModelReady);
      };
    }
  }, [modelUrl]);

  return (
    <div style={{ position: "relative" }}>
      {error && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            right: "10px",
            background: "rgba(220, 53, 69, 0.9)",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            zIndex: 10,
            fontSize: "14px",
          }}
        >
          Error: {error}
        </div>
      )}

      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        alt="3D building model"
        ar
        ar-modes="scene-viewer webxr quick-look"
        environment-image="neutral"
        auto-rotate
        camera-controls
        loading="lazy"
        reveal="auto"
        style={{
          width: "100%",
          height: "500px",
          backgroundColor: "#f5f5f5",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' text-anchor='middle' dominant-baseline='middle' fill='%23666'%3ELoading...%3C/text%3E%3C/svg%3E"
      >
        {isLoading && (
          <div
            slot="progress-bar"
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.8)",
              color: "white",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "14px",
              fontFamily: "system-ui, sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              minWidth: "200px",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                border: "2px solid #ffffff40",
                borderTop: "2px solid #ffffff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            Loading 3D Model... {Math.round(loadingProgress * 100)}%
          </div>
        )}

        <div
          slot="ar-button"
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          View in AR
        </div>
      </model-viewer>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ModelViewer;
