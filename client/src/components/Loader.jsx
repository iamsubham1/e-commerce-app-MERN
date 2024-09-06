import React from 'react';

const Loader = ({ width = '100px', height = '100px', fullScreen = false }) => {
    return (
        <div
            className={`flex justify-center items-center overflow ${fullScreen ? 'w-[100vw] h-[80vh]' : ''}`}
            style={!fullScreen ? { width, height } : {}}
        >
            <span className="loader"></span>
        </div>
    );
};

export default Loader;