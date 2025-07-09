import { useEffect } from "react";
export default function PopunderAd() {
  useEffect(() => {
    if (!sessionStorage.getItem('pop_shown')) {
      const script = document.createElement('script');
      script.src = "//pl27103183.profitableratecpm.com/21/f7/dc/21f7dcf20532b364db076b89d2f7d86b.js";
      document.body.appendChild(script);
      sessionStorage.setItem('pop_shown', 'true');
    }
  }, []);
  return null;
} 