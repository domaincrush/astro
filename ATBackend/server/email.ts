import nodemailer from 'nodemailer';

// Gmail SMTP configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.GMAIL_USER || params.from,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html
    };

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.log('Gmail credentials not configured. Email would be sent to:', params.to, 'Subject:', params.subject);
      return true; // Return true for development when no credentials are provided
    }

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('Gmail email error:', error);
    return false;
  }
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendEmailVerificationCode(
  email: string,
  verificationCode: string,
  username: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">AstroScroll</h1>
        <p style="color: white; margin: 10px 0 0 0;">Email Verification</p>
      </div>
      
      <div style="padding: 30px 20px; background: #f9f9f9;">
        <h2 style="color: #333; margin-bottom: 20px;">Hello ${username}!</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          You've requested to change your email address. Please use the verification code below to confirm this change:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="background: #667eea; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 8px; display: inline-block; letter-spacing: 3px;">
            ${verificationCode}
          </div>
        </div>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          This verification code will expire in 10 minutes. If you didn't request this change, you can safely ignore this email.
        </p>
        
        <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; color: #999; font-size: 12px;">
          <p>This is an automated email from AstroScroll. Please do not reply to this email.</p>
        </div>
      </div>
    </div>
  `;

  const text = `
    Hello ${username}!
    
    You've requested to change your email address. Please use this verification code: ${verificationCode}
    
    This code will expire in 10 minutes. If you didn't request this change, you can safely ignore this email.
    
    - AstroScroll Team
  `;

  return await sendEmail({
    to: email,
    from: process.env.GMAIL_USER || 'noreply@astroguide.com',
    subject: 'Verify Your New Email Address - AstroScroll',
    html,
    text,
  });
}