import { useEffect, useRef } from "react";

export default function BannerAd() {
  const adRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!adRef.current) return;
    // Remove any previous ad
    adRef.current.innerHTML = "";
    // Create script for atOptions
    const atOptionsScript = document.createElement("script");
    atOptionsScript.type = "text/javascript";
    atOptionsScript.innerHTML = `atOptions = { 'key' : '42928d8c05f8508c009631c21c747036', 'format' : 'iframe', 'height' : 250, 'width' : 300, 'params' : {} };`;
    adRef.current.appendChild(atOptionsScript);
    // Create ad script
    const adScript = document.createElement("script");
    adScript.type = "text/javascript";
    adScript.src = "//www.highperformanceformat.com/42928d8c05f8508c009631c21c747036/invoke.js";
    adRef.current.appendChild(adScript);
  }, []);
  return <div className="my-6 ad-slot-banner flex justify-center" ref={adRef} style={{ minHeight: 250 }} />;
} 