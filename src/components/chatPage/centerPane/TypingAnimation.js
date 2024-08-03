import React, { useState, useEffect } from "react";

const TypingAnimation = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots === "...") {
          return "";
        } else {
          return prevDots + ".";
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <div>Typing {dots}</div>;
};

export default TypingAnimation;
