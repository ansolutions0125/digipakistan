import React, { useState } from "react";

const RelatedVideo = () => {
  // Default video
  const [mainVideo, setMainVideo] = useState("https://www.youtube.com/embed/n7YJcBPtMEg");
  const [videoData, setVideoData] = useState({
    title: "Provincial Minister Col(R) Muhammad Hashim",
  });

  const handleThumbnailClick = (video) => {
    setMainVideo(video.videoUrl);
    setVideoData({
      title: video.title,
    });
  };

  // Videos list
  const videos = [
    {
      videoUrl: "https://www.youtube.com/embed/n7YJcBPtMEg",
      thumbnail: "https://img.youtube.com/vi/n7YJcBPtMEg/0.jpg",
      title: "Provincial Minister Col(R) Muhammad Hashim",
    },
    {
      videoUrl: "https://www.youtube.com/embed/NUttTvTSPkQ",
      thumbnail: "https://img.youtube.com/vi/NUttTvTSPkQ/0.jpg",
      title: "Chairman PEC - Engr Jawed Saleem Qureshi",
    },
    {
      videoUrl: "https://www.youtube.com/embed/xAc5l2npQsg",
      thumbnail: "https://img.youtube.com/vi/xAc5l2npQsg/0.jpg",
      title: "Chairman HEC Punjab - Dr Fazal Ahmad Khalid (SI)",
    },
    {
      videoUrl: "https://www.youtube.com/embed/yscI0ljj2Jg",
      thumbnail: "https://img.youtube.com/vi/yscI0ljj2Jg/0.jpg",
      title: "Vice Chancellor Punjab University - Dr Niaz Ahmad Akhtar",
    },
    {
      videoUrl: "https://www.youtube.com/embed/bMGzyml4HMY",
      thumbnail: "https://img.youtube.com/vi/bMGzyml4HMY/0.jpg",
      title: "Director General - Lt Col (R) Habib ur Rehman Qaiser (TI) (1)",
    },
    {
      videoUrl: "https://www.youtube.com/embed/JomFqVQ0K6k",
      thumbnail: "https://img.youtube.com/vi/JomFqVQ0K6k/0.jpg",
      title: "President IEP Engineers - Dr Javed Younas Uppal",
    },
    {
      videoUrl: "https://www.youtube.com/embed/_MZF_5zYpL4",
      thumbnail: "https://img.youtube.com/vi/_MZF_5zYpL4/0.jpg",
      title: "Governing Body PEC - Dr Suhail Aftab Qureshi",
    },
    {
      videoUrl: "https://www.youtube.com/embed/uyNzJVI934A",
      thumbnail: "https://img.youtube.com/vi/uyNzJVI934A/0.jpg",
      title: "Overview & Apply Method in DigiPAKISTAN",
    },
  ];

  return (
    <div className="py-20 bg-primary">
      <h1 className="text-4xl text-white font-bold mb-5 text-center">
        ڈیجی پاکستان قومی ہنر مند ترقیاتی پروگرام
      </h1>

      {/* Main Video Section */}
      <div className="flex lg:flex-row flex-col max-w-7xl gap-8 lg:mx-auto px-5">
        <div className="w-full">
          {/* Main Video Player */}
          <div style={{ padding: "56.25% 0 0 0", position: "relative", borderRadius: "20px" }}>
            <iframe
              src={mainVideo}
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
              }}
              title={videoData.title}
            ></iframe>
          </div>
          {/* Video Details */}
          <h2 className="text-2xl text-white font-bold mt-4">{videoData.title}</h2>
        </div>

        {/* Related Videos Section */}
        <div className="w-full lg:w-1/3">
          <h2 className="text-xl font-bold text-white mb-4">Related Videos</h2>
          <hr className="border-1 mb-6 border-white" />
          <div className="flex flex-col">
            {videos.map((video, index) => (
              <div
                key={index}
                className={`flex items-center p-3 gap-3 rounded-lg cursor-pointer ${
                  mainVideo === video.videoUrl ? "bg-white text-black" : "text-white"
                }`}
                onClick={() => handleThumbnailClick(video)} >
              {/* Thumbnail */}
                <img
                  src={video.thumbnail}
                  alt={`Thumbnail for ${video.title}`}
                  className="w-16 h-16 rounded-md"
                />
                {/* Video Title */}
                <div>
                  <h3 className="text-sm font-medium">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedVideo;
