import React, { useEffect } from "react";

const Chatbot = () => {
  useEffect(() => {
    const removeWatermark = () => {
      setTimeout(() => {
        const iframe = document.querySelector("iframe"); // Select the chatbot iframe
        if (iframe) {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          if (iframeDoc) {
            const watermark = iframeDoc.querySelector(".botsonic-watermark"); // Adjust class if needed
            if (watermark) {
              watermark.style.display = "none";
              watermark.style.visibility = "hidden";
            }
          }
        }
      }, 3000); // Wait for chatbot to load before trying to remove
    };

    removeWatermark();
  }, []);

  return (
    <div>
      <iframe
        src="https://widget.botsonic.com/CDN/index.html?service-base-url=https%3A%2F%2Fapi-azure.botsonic.ai&token=ea4e875e-57b9-4665-a9f1-cc46229b0923&base-origin=https%3A%2F%2Fbot.writesonic.com&instance-name=Botsonic&standalone=true&page-url=https%3A%2F%2Fbot.writesonic.com%2Fbots%2F62003206-b85b-4871-8f09-351678531fd6%2Fconnect"
        width="400"
        height="600"
        title="Chatbot"
      ></iframe>
    </div>
  );
};

export default Chatbot;