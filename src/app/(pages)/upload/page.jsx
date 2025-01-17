"use client";

import { useState } from "react";

export default function UploadVideo() {
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState("");
  const [videoUrl, setVideoUrl] = useState(""); // Store the video URL here

  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleVideoUpload = async (event) => {
    event.preventDefault();
    if (!video) {
      setMessage("Please select a video to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("video", video);

    try {
      const response = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        setMessage(`Upload failed: ${data.error || "Unknown error"}`);
        return;
      }

      // Assuming the response contains the video URL or ID
      setVideoUrl("6c19b526de35f50524027ddaa0ff0062"); // Store the video URL returned by the backend
      setMessage(`Video uploaded! Use this link: ${data.uploadLink}`);
    } catch (error) {
      console.error("Error uploading video:", error);
      setMessage("An error occurred during the upload process.");
    }
  };

  const triggerEmailHandler = async () => {
    try {
      const response = await fetch("/api/cron", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trigger: true,  
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Email handler triggered successfully:", data);
      } else {
        console.error("Failed to trigger email handler:", response.status);
      }   
    } catch (error) {
      console.error("Error triggering email handler:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Upload a Video</h1>
      <form onSubmit={handleVideoUpload}>
        <input type="file" accept="video/*" onChange={handleFileChange} />
        <button type="submit" className="mt-2">
          Upload Video
        </button>
      </form>
      <p>{message}</p>

      {/* If video URL is available, render the iframe */}
      <div className="mt-4">
        <h2 className="text-lg font-bold mb-2">Video Preview</h2>
        <iframe
          src={
            "https://player.vimeo.com/video/6c19b526de35f50524027ddaa0ff0062?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
          }
          width="640"
          height="360"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Vimeo Video"
        ></iframe>
      </div>

      <button onCanPlay={triggerEmailHandler}>send email</button>
    </div>
  );
}
