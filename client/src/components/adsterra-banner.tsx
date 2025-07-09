import React, { useEffect } from "react";

export default function AdsterraBanner() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//pl27102337.profitableratecpm.com/0f93e873ffc52e23483708289d04ec0a/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    document.getElementById("container-0f93e873ffc52e23483708289d04ec0a")?.appendChild(script);
    // Clean up: remove script on unmount
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);
  return (
    <div style={{ width: "100%", textAlign: "center", margin: "20px 0" }}>
      <div id="container-0f93e873ffc52e23483708289d04ec0a"></div>
    </div>
  );
} 