import React, { useState } from 'react';
// To install react-icons, run: npm install react-icons
// or if using yarn: yarn add react-icons
import { FaTimes } from 'react-icons/fa';
const LoadingIndicator = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-white rounded-2xl">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
  </div>
);

const Chatbot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      {isChatbotOpen ? (
        <div className="relative transform transition-all duration-300 ease-in-out">
          <div className="absolute -top-12 right-0 bg-white px-4 py-2 rounded-t-lg shadow-lg border border-purple-200">
            <p className="text-purple-600 font-medium">Chat with Yaazhini</p>
          </div>
          <button
            onClick={() => setIsChatbotOpen(false)}
            className="absolute -top-3 -right-3 z-50 bg-white text-purple-600 p-2 rounded-full hover:bg-purple-100 transition-all duration-300 shadow-lg border-2 border-purple-600 hover:rotate-90"
          >
            <FaTimes size={20} />
          </button>
          <div className="animate-fadeIn">
            {isChatbotOpen && (
              <div className="relative">
                {!isIframeLoaded && <LoadingIndicator />}
                <iframe 
                  src="https://widget.botsonic.com/CDN/index.html?service-base-url=https%3A%2F%2Fapi-azure.botsonic.ai&token=ea4e875e-57b9-4665-a9f1-cc46229b0923&base-origin=https%3A%2F%2Fbot.writesonic.com&instance-name=Botsonic&standalone=true&page-url=https%3A%2F%2Fbot.writesonic.com%2Fbots%2F62003206-b85b-4871-8f09-351678531fd6%2Fconnect"
                  width="400"
                  height="600"
                  frameBorder="0"
                  title="Chatbot"
                  className={`rounded-2xl shadow-2xl transition-opacity duration-300 ${isIframeLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setIsIframeLoaded(true)}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="relative group">
          <div className="absolute -top-12 right-0 bg-white px-4 py-2 rounded-lg shadow-lg border border-purple-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-purple-600 font-medium whitespace-nowrap">Need help? Click to chat!</p>
          </div>
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="transform hover:scale-110 transition-all duration-300 relative"
          >
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            <img 
              src="https://png.pngtree.com/png-vector/20240715/ourmid/pngtree-d-indian-m-cartoon-drawing-of-a-girl-sitting-in-front-png-image_13097835.png" 
              alt="Chatbot Icon" 
              className="w-12 h-12 rounded-full object-cover border-2 border-purple-600 shadow-lg"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;