import React, { useEffect, useRef } from "react";
import cloudinary from "cloudinary-core";
import "cloudinary-video-player/cld-video-player.min.css";
import "cloudinary-video-player";

const VideoPlayer = ({ videoUrl }) => {
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const cloudinaryRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    if (cloudinaryRef.current) return;

    cloudinaryRef.current = window.cloudinary;
    cloudinaryRef.current.videoPlayer(videoRef.current, {
      cloud_name: CLOUD_NAME,
      showLogo: false,
      muted: true,
      fluid: true,
      seekThumbnails: true,
      showJumpControls: true,
    });
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        height={"auto"}
        className="cld-video-player"
        data-cld-public-id={videoUrl}
        controls
      />
    </div>
  );
};

export default VideoPlayer;
