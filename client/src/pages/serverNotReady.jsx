import React, { useEffect, useState } from "react";
import "../components/css/loadingPage.css";

const LoadingPage = ({ triggerAnimation }) => {
  const [animateOut, setAnimateOut] = useState(false);
  const [dots, setDots] = useState(".");
  useEffect(() => {
    if (triggerAnimation) {
      setTimeout(() => {
        setAnimateOut(true);
      }, 500);
    }
  }, [triggerAnimation]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);
  return (
    <div
      className={`flex flex-col text-center justify-center items-center h-screen bg-[#0a0a0a] text-white transition-opacity duration-1000 ${
        animateOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="spinner"></div>

      <h1 className="mb-2 mt-12 text-2xl md:text-3xl lg:text-3xl ">
        Our server is getting ready <span className="dots">{dots}</span>
      </h1>
      <p className="mt-4 text-lg md:text-xl mb-2 text-gray-400 animate-fadeIn-delay ">
        We are preparing everything for you ! Please be patient.
      </p>
      <p className="text-sm md:text-lg ">
        Free tier servers spin down upon inactivity ! Hence this additional
        effort.
      </p>
    </div>
  );
};

export default LoadingPage;
