import { useEffect } from 'react';

const ChatWidget = () => {
  useEffect(() => {
    (function (w, d, s, o, f, js, fjs) {
      w["botsonic_widget"] = o;
      w[o] = w[o] || function () {
        (w[o].q = w[o].q || []).push(arguments);
      };
      js = d.createElement(s);
      fjs = d.getElementsByTagName(s)[0];
      js.id = o;
      js.src = f;
      js.async = 1;
      fjs.parentNode.insertBefore(js, fjs);
    })(window, document, "script", "Botsonic", "https://widget.botsonic.com/CDN/botsonic.min.js");

    window.Botsonic("init", {
      serviceBaseUrl: "https://api-azure.botsonic.ai",
      token: "1dd02f10-7d60-40c5-8bef-a55313775b7c",
    });
  }, []);

  return null;
};

export default ChatWidget;