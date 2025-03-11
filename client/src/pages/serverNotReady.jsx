import React, { useEffect, useState } from 'react';
import '../components/css/loadingPage.css';

const LoadingPage = ({ triggerAnimation }) => {
    const [animateOut, setAnimateOut] = useState(false);

    // Trigger the final animation when the server is ready
    useEffect(() => {
        if (triggerAnimation) {
            setTimeout(() => {
                setAnimateOut(true);
            }, 500); // Optional delay for smoother transition
        }
    }, [triggerAnimation]);

    return (
        <div
            className={`flex flex-col text-center justify-center items-center h-screen bg-black text-white transition-opacity duration-1000 ${animateOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
        >
            <div className="border-8 border-t-8 spinner border-gray-300 rounded-full w-24 h-24 animate-spin"></div>

            <h1 className='mb-2 mt-5 text-2xl md:text-3xl lg:text-3xl'>Our server is getting ready</h1>
            <p className="mt-4 text-lg md:text-xl mb-2 text-gray-400 animate-fadeIn-delay ">
                We are preparing everything for you ! Please be patient.
            </p>
            <p className="text-sm md:text-lg">
                Free tier servers spin down upon inactivity! Hence this additional effort.
            </p>
        </div>
    );
};

export default LoadingPage;
