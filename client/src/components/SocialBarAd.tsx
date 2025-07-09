import { useEffect } from "react";
export default function SocialBarAd() {
  useEffect(() => {
    if (document.getElementById("social-bar-ad-script")) return;
    const script = document.createElement("script");
    script.id = "social-bar-ad-script";
    script.type = "text/javascript";
    script.src = "//pl27103156.profitableratecpm.com/10/1e/c8/101ec8bd853902dc60cc8a20243a44a0.js";
    document.body.appendChild(script);
  }, []);
  return null;
} 