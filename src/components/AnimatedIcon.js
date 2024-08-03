import React, { useRef } from "react";

const AnimatedIcon = ({ staticSrc, hoverSrc, alt, width, height }) => {
  const imageRef = useRef(null);
  let isPlaying = false;

  const handleClick = () => {
    if (!isPlaying) {
      isPlaying = true;
      imageRef.current.src = hoverSrc;
      setTimeout(() => {
        isPlaying = false;
        imageRef.current.src = staticSrc;
      }, 1000); // Adjust the time as needed for your GIF's duration
    }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: `${width}px`, // Adjust this size as needed
        height: `${height}px`, // Adjust this size as needed
      }}
      onClick={handleClick}
    >
      <img
        ref={imageRef}
        src={staticSrc}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default AnimatedIcon;
