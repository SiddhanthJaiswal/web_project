import { useEffect } from "react";

const Chatbot = () => {
  useEffect(() => {
    // Prevent duplicate script loading
    if (document.getElementById("chatbase-script")) return;

    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "chatbase-script";
    script.setAttribute("chatbotId", "kAqcIxTsRmhn67OHGmD6z"); 
    script.defer = true;

    document.body.appendChild(script);
  }, []);

  return null;
};

export default Chatbot;