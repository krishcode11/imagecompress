import { Request, Response } from 'express';
import { getStorage } from '../storage';
import nodemailer from 'nodemailer';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export const sendContactMessage = async (req: any, res: Response) => {
  try {
    const { name, email, message, subject, attachment } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;

    // Validate input
    if (!name || !email || !message || !subject || !adminEmail) {
      return res.status(400).json({ 
        error: 'All fields are required',
        missing: !name ? 'name' : !email ? 'email' : !message ? 'message' : !subject ? 'subject' : !adminEmail ? 'ADMIN_EMAIL' : ''
      });
    }

    // If attachment is present, upload to Cloudinary
    let attachmentUrl = null;
    if (attachment) {
      try {
        const result = await cloudinary.uploader.upload(attachment);
        attachmentUrl = result.secure_url;
      } catch (error) {
        console.error('Error uploading attachment:', error);
      }
    }

    // Send email
    const mailOptions = {
      from: email,
      to: adminEmail,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        ${attachmentUrl ? `<p><strong>Attachment:</strong> <a href="${attachmentUrl}">${attachmentUrl}</a></p>` : ''}
      `
    };

    await transporter.sendMail(mailOptions);

    // Store message in database
    const storage = await getStorage();
    await storage.createContactMessage({
      name,
      email,
      subject,
      message,
      attachmentUrl: attachmentUrl || undefined,
      userId: req.user?.id
    });

    res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error sending contact message:', error);
    res.status(500).json({
      error: 'Failed to send message'
    });
  }
};

export const getTutorials = async (req: any, res: Response) => {
  try {
    const storage = await getStorage();
    const tutorials = await storage.getTutorials();
    res.json(tutorials);
  } catch (error) {
    console.error('Error fetching tutorials:', error);
    res.status(500).json({
      error: 'Failed to fetch tutorials'
    });
  }
};
