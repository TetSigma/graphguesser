import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[#0B0C10] flex justify-center items-center z-50">
      <div className="border-8 border-t-8 border-gray-300 border-t-blue-500 rounded-full w-20 h-20 animate-spin"></div>
    </div>
  );
};

export default Loader;
