import axios from "axios";

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  // Replace with your Firebase project URL
  const firebaseFunctionUrl = "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/sendEmail";
  try {
    const res = await axios.post(firebaseFunctionUrl, { data: { to, subject, html } });
    return res.data;
  } catch (error: any) {
    console.error("Failed to send email:", error);
    return { success: false, error: error.message };
  }
} 