import nodemailer, { Transporter } from 'nodemailer';

interface DomainBranding {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  supportEmail: string;
  domain: string;
  tagline: string;
}

export class EmailService {
  private transporter: Transporter;
  private domainBranding: Map<string, DomainBranding>;
  
  constructor() {
    // Use SMTP configuration
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.dreamhost.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // false for TLS on port 587
      auth: {
        user: process.env.SMTP_USER || 'support@astrotick.com', // Full email address
        pass: process.env.SMTP_PASS // DreamHost email password
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    console.log('📧 SMTP email service initialized successfully');

    // Initialize domain-specific branding
    this.domainBranding = new Map([
      ['astrotick.com', {
        name: 'AstroTick',
        primaryColor: '#8b5cf6',
        secondaryColor: '#06b6d4',
        supportEmail: 'support@astrotick.com',
        domain: 'astrotick.com',
        tagline: 'Your Cosmic Journey Begins Here'
      }],
      ['astroporutham.com', {
        name: 'Astro Porutham',
        primaryColor: '#ec4899',
        secondaryColor: '#fbbf24',
        supportEmail: 'support@astroporutham.com',
        domain: 'astroporutham.com',
        tagline: 'Sacred Marriage Compatibility'
      }],
      ['careersastro.com', {
        name: 'Careers Astro',
        primaryColor: '#1e40af',
        secondaryColor: '#f59e0b',
        supportEmail: 'support@careersastro.com',
        domain: 'careersastro.com',
        tagline: 'Professional Astrology Guidance'
      }],
      ['astrovedika.com', {
        name: 'Astro Vedika',
        primaryColor: '#dc2626',
        secondaryColor: '#16a34a',
        supportEmail: 'support@astrovedika.com',
        domain: 'astrovedika.com',
        tagline: 'Authentic Vedic Wisdom'
      }],
      ['kundali.in', {
        name: 'Kundali.in',
        primaryColor: '#ea580c',
        secondaryColor: '#fbbf24',
        supportEmail: 'support@kundali.in',
        domain: 'kundali.in',
        tagline: 'आपकी कुंडली का सच्चा साथी'
      }]
    ]);
  }

  private getBrandingForDomain(domain: string): DomainBranding {
    return this.domainBranding.get(domain) || this.domainBranding.get('astrotick.com')!;
  }

  async sendEmail(options: { to: string; subject: string; text?: string; html?: string; domain?: string }) {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'support@astrotick.com',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('📧 SMTP email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send welcome email to new users
  async sendWelcomeEmail(userData: { name: string; email: string; domain?: string }) {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'support@astrotick.com',
        to: userData.email,
        subject: `Welcome to ${this.getBrandingForDomain(userData.domain || 'astrotick.com').name} - Your Journey Begins`,
        html: this.getWelcomeEmailTemplate(userData.name, userData.domain || 'astrotick.com')
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Welcome email failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send consultation confirmation email
  async sendConsultationConfirmation(data: {
    userName: string;
    userEmail: string;
    astrologerName: string;
    consultationType: string;
    consultationDate: string;
    consultationTime: string;
    amount: number;
    transactionId: string;
  }) {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'support@astrotick.com',
        to: data.userEmail,
        subject: `Consultation Confirmed - ${data.astrologerName}`,
        html: this.getConsultationConfirmationTemplate(data)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Consultation confirmation sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Consultation confirmation failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send consultation reminder email
  async sendConsultationReminder(data: {
    userName: string;
    userEmail: string;
    astrologerName: string;
    consultationType: string;
    consultationDate: string;
    consultationTime: string;
    meetingLink?: string;
  }) {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'support@astrotick.com',
        to: data.userEmail,
        subject: `Consultation Reminder - Tomorrow with ${data.astrologerName}`,
        html: this.getConsultationReminderTemplate(data)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Consultation reminder sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Consultation reminder failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send report delivery email
  async sendReportDelivery(data: {
    userName: string;
    userEmail: string;
    reportType: string;
    downloadLink: string;
    orderNumber: string;
  }) {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'support@astrotick.com',
        to: data.userEmail,
        subject: `Your ${data.reportType} Report is Ready`,
        html: this.getReportDeliveryTemplate(data)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Report delivery email sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Report delivery email failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send payment confirmation email
  async sendPaymentConfirmation(data: {
    userName: string;
    userEmail: string;
    amount: number;
    transactionId: string;
    paymentFor: string;
    paymentDate: string;
  }) {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'support@astrotick.com',
        to: data.userEmail,
        subject: `Payment Confirmation - ₹${data.amount}`,
        html: this.getPaymentConfirmationTemplate(data)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Payment confirmation sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send OTP for login
  async sendLoginOTP(data: {
    userName: string;
    userEmail: string;
    otpCode: string;
    expiryMinutes: number;
  }) {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'support@astrotick.com',
        to: data.userEmail,
        subject: 'Your AstroTick Login Code',
        html: this.getLoginOTPTemplate(data)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Login OTP email sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Login OTP email failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send OTP for PIN reset
  async sendPinResetOTP(data: {
    userName: string;
    userEmail: string;
    otpCode: string;
    expiryMinutes: number;
  }) {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'support@astrotick.com',
        to: data.userEmail,
        subject: 'Reset Your AstroTick PIN',
        html: this.getPinResetOTPTemplate(data)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('PIN reset OTP email sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('PIN reset OTP email failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send contact form submission
  async sendContactFormSubmission(data: { name: string; email: string; subject: string; message: string }) {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'support@astrotick.com',
        to: process.env.SUPPORT_EMAIL || 'support@astrotick.com',
        subject: `Contact Form: ${data.subject}`,
        html: this.getContactFormTemplate(data)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Contact form submission sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Contact form submission failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send auto-reply to contact form submitter
  async sendContactAutoReply(data: { name: string; email: string; subject: string }) {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'support@astrotick.com',
        to: data.email,
        subject: `Thank you for contacting AstroTick - ${data.subject}`,
        html: this.getContactAutoReplyTemplate(data)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Contact auto-reply sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Contact auto-reply failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Email Templates
  private getBaseTemplate(content: string, title: string = 'AstroTick', domain: string = 'astrotick.com'): string {
    const branding = this.getBrandingForDomain(domain);
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body { margin: 0; padding: 20px; font-family: 'Arial', sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
          .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px; }
          .content { padding: 40px 30px; }
          .footer { background: #1f2937; color: white; padding: 30px; text-align: center; }
          .button { display: inline-block; background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .info-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .highlight { background: #f0f9ff; border: 1px solid #0ea5e9; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .divider { height: 1px; background: #e5e7eb; margin: 30px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          ${content}
          <div class="footer">
            <p style="margin: 0 0 10px 0; font-size: 14px;">&copy; 2025 ${branding.name}. All rights reserved.</p>
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">${branding.tagline}</p>
            <p style="margin: 15px 0 0 0; font-size: 12px;">
              <a href="mailto:${branding.supportEmail}" style="color: ${branding.primaryColor};">${branding.supportEmail}</a> | 
              <a href="https://${branding.domain}" style="color: ${branding.primaryColor};">www.${branding.domain}</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getWelcomeEmailTemplate(userName: string, domain: string = 'astrotick.com'): string {
    const branding = this.getBrandingForDomain(domain);
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🌟 Welcome to ${branding.name}!</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body, table, td, p, a, li, blockquote {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        body {
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            min-height: 100vh;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }
        
        .header {
            background: linear-gradient(135deg, ${branding.primaryColor}, ${branding.secondaryColor});
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        
        .content {
            padding: 40px 30px;
            color: #2d3748;
            line-height: 1.6;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 30px 0;
        }
        
        .feature-card {
            background: linear-gradient(135deg, #f7fafc, #edf2f7);
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid ${branding.primaryColor};
        }
        
        .cta-section {
            background: linear-gradient(135deg, ${branding.primaryColor}, ${branding.secondaryColor});
            color: white;
            padding: 30px;
            margin: 30px 0;
            border-radius: 12px;
            text-align: center;
        }
        
        .cta-button {
            display: inline-block;
            background: white;
            color: ${branding.primaryColor};
            padding: 15px 25px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            margin: 10px 5px;
        }
        
        .contact-info {
            background: #f7fafc;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
        }
        
        .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #4a5568;
        }
        
        @media only screen and (max-width: 600px) {
            .features-grid, .contact-grid {
                grid-template-columns: 1fr;
            }
            .cta-button {
                display: block;
                margin: 10px 0;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🌟 Welcome to ${branding.name}!</h1>
            <p>${branding.tagline}</p>
        </div>
        
        <div class="content">
            <div style="font-size: 18px; margin-bottom: 20px; color: #1a202c;">
                <strong>Namaste ${userName}!</strong> 🙏
            </div>
            
            <p>We're absolutely thrilled to have you join the ${branding.name} family! You've just taken the first step towards unlocking the profound wisdom of Vedic astrology.</p>
            
            <p>At ${branding.name}, we combine ancient Vedic knowledge with modern technology to provide you with the most authentic and comprehensive astrological insights available.</p>
            
            <div class="features-grid">
                <div class="feature-card">
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #2d3748;">🔮 Premium Reports</h3>
                    <p style="margin: 0; font-size: 14px; color: #4a5568;">Get detailed 22-section reports with personalized predictions</p>
                </div>
                
                <div class="feature-card">
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #2d3748;">📱 Live Consultations</h3>
                    <p style="margin: 0; font-size: 14px; color: #4a5568;">Connect with expert Vedic astrologers for real-time guidance</p>
                </div>
                
                <div class="feature-card">
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #2d3748;">🧮 Free Calculators</h3>
                    <p style="margin: 0; font-size: 14px; color: #4a5568;">Access Kundli, Dasha, Moon Sign, and compatibility tools</p>
                </div>
                
                <div class="feature-card">
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #2d3748;">📅 Daily Panchang</h3>
                    <p style="margin: 0; font-size: 14px; color: #4a5568;">Stay aligned with cosmic energies and auspicious timings</p>
                </div>
            </div>
            
            <div class="cta-section">
                <h3 style="margin: 0 0 15px 0;">🚀 Ready to Explore Your Cosmic Blueprint?</h3>
                <p style="margin: 0 0 20px 0;">Start your astrological journey with these popular features:</p>
                <a href="https://${branding.domain}/premium-report" class="cta-button">📄 Premium Report</a>
                <a href="https://${branding.domain}/daily-horoscope" class="cta-button">🌟 Daily Horoscope</a>
                <a href="https://${branding.domain}/kundli" class="cta-button">🧮 Free Kundli</a>
            </div>
            
            <div class="contact-info">
                <h3 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px;">💬 Need Help? We're Here for You!</h3>
                <p style="margin: 0 0 15px 0; font-size: 14px; color: #4a5568;">Our support team is ready to assist you with any questions.</p>
                
                <div class="contact-grid">
                    <div class="contact-item">
                        <strong style="color: #2d3748; margin-right: 8px;">📧 Email:</strong> Support@astrotick.com
                    </div>
                    <div class="contact-item">
                        <strong style="color: #2d3748; margin-right: 8px;">📞 Phone:</strong> 88075 56886
                    </div>
                </div>
            </div>
            
            <p><strong>What's Next?</strong></p>
            <ul style="color: #4a5568; padding-left: 20px; line-height: 1.8;">
                <li>Complete your profile for personalized recommendations</li>
                <li>Explore our free calculators and daily horoscope</li>
                <li>Consider a premium report for deeper insights</li>
                <li>Book a consultation with our expert astrologers</li>
            </ul>
            
            <p style="margin-top: 25px;">
                <strong>With cosmic blessings,</strong><br>
                <strong>The ${branding.name} Team</strong> ✨
            </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #718096; font-size: 14px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 10px 0;">© 2025 ${branding.name}. All rights reserved.</p>
            <p style="margin: 0;">This email was sent because you created an account with ${branding.name}.</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  private getConsultationConfirmationTemplate(data: any): string {
    const content = `
      <div class="header">
        <h1>Consultation Confirmed</h1>
        <p>Your session with ${data.astrologerName} is scheduled</p>
      </div>
      <div class="content">
        <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hello ${data.userName},</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
          Your consultation has been successfully booked and confirmed. Here are your session details:
        </p>
        
        <div class="highlight">
          <h3 style="color: #f97316; margin: 0 0 20px 0;">Consultation Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Astrologer:</td>
              <td style="padding: 12px 0; color: #6b7280;">${data.astrologerName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Service:</td>
              <td style="padding: 12px 0; color: #6b7280;">${data.consultationType}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Date:</td>
              <td style="padding: 12px 0; color: #6b7280;">${data.consultationDate}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Time:</td>
              <td style="padding: 12px 0; color: #6b7280;">${data.consultationTime}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Amount:</td>
              <td style="padding: 12px 0; color: #6b7280;">₹${data.amount}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Transaction ID:</td>
              <td style="padding: 12px 0; color: #6b7280; font-family: monospace;">${data.transactionId}</td>
            </tr>
          </table>
        </div>
        
        <div class="info-box">
          <h4 style="margin: 0 0 10px 0; color: #92400e;">Important Notes:</h4>
          <ul style="margin: 0; color: #92400e;">
            <li>You'll receive a reminder email 24 hours before your session</li>
            <li>Please have your birth details ready (date, time, place)</li>
            <li>Prepare specific questions you'd like to discuss</li>
            <li>Join 5 minutes early for the best experience</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://astrotick.com/consultations" class="button">View My Consultations</a>
        </div>
        
        <p style="color: #6b7280;">
          Need to reschedule or have questions? Contact us at 
          <a href="mailto:support@astrotick.com" style="color: #f97316;">support@astrotick.com</a>
        </p>
      </div>
    `;
    return this.getBaseTemplate(content, 'Consultation Confirmed');
  }

  private getConsultationReminderTemplate(data: any): string {
    const content = `
      <div class="header">
        <h1>Consultation Reminder</h1>
        <p>Your session is tomorrow with ${data.astrologerName}</p>
      </div>
      <div class="content">
        <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hello ${data.userName},</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
          This is a friendly reminder that your consultation is scheduled for tomorrow. We're excited for your session!
        </p>
        
        <div class="highlight">
          <h3 style="color: #f97316; margin: 0 0 20px 0;">Tomorrow's Session</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Astrologer:</td>
              <td style="padding: 12px 0; color: #6b7280;">${data.astrologerName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Service:</td>
              <td style="padding: 12px 0; color: #6b7280;">${data.consultationType}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Date:</td>
              <td style="padding: 12px 0; color: #6b7280; font-weight: bold; font-size: 18px;">${data.consultationDate}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Time:</td>
              <td style="padding: 12px 0; color: #dc2626; font-weight: bold; font-size: 18px;">${data.consultationTime}</td>
            </tr>
          </table>
        </div>
        
        <div class="info-box">
          <h4 style="margin: 0 0 15px 0; color: #92400e;">Preparation Checklist:</h4>
          <div style="display: grid; gap: 10px; color: #92400e;">
            <div>✓ Have your birth details ready (exact time and place)</div>
            <div>✓ Prepare specific questions about your concerns</div>
            <div>✓ Find a quiet space for your consultation</div>
            <div>✓ Test your internet connection and camera</div>
            <div>✓ Join 5 minutes before the scheduled time</div>
          </div>
        </div>
        
        ${data.meetingLink ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.meetingLink}" class="button">Join Meeting</a>
        </div>
        ` : `
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://astrotick.com/consultations" class="button">View Session Details</a>
        </div>
        `}
        
        <p style="color: #6b7280;">
          Questions or need to reschedule? Contact us immediately at 
          <a href="mailto:support@astrotick.com" style="color: #f97316;">support@astrotick.com</a>
        </p>
      </div>
    `;
    return this.getBaseTemplate(content, 'Consultation Reminder');
  }

  private getReportDeliveryTemplate(data: any): string {
    const content = `
      <div class="header">
        <h1>Your Report is Ready</h1>
        <p>Your ${data.reportType} has been generated</p>
      </div>
      <div class="content">
        <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hello ${data.userName},</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
          Great news! Your personalized astrological report has been completed and is ready for download.
        </p>
        
        <div class="highlight">
          <h3 style="color: #f97316; margin: 0 0 20px 0;">Report Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Report Type:</td>
              <td style="padding: 12px 0; color: #6b7280;">${data.reportType}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Order Number:</td>
              <td style="padding: 12px 0; color: #6b7280; font-family: monospace;">${data.orderNumber}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Generated:</td>
              <td style="padding: 12px 0; color: #6b7280;">${new Date().toLocaleDateString()}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.downloadLink}" class="button" style="font-size: 18px; padding: 20px 40px;">Download Your Report</a>
        </div>
        
        <div class="info-box">
          <h4 style="margin: 0 0 10px 0; color: #92400e;">What's Inside Your Report:</h4>
          <ul style="margin: 0; color: #92400e;">
            <li>Detailed birth chart analysis with planetary positions</li>
            <li>Comprehensive predictions for major life areas</li>
            <li>Personalized remedies and gemstone recommendations</li>
            <li>Auspicious timing guidance for important decisions</li>
            <li>Career, relationship, and health insights</li>
          </ul>
        </div>
        
        <div class="divider"></div>
        
        <h3 style="color: #1f2937;">Need Help Understanding Your Report?</h3>
        <p style="color: #6b7280;">
          Our expert astrologers are available for consultation to help you understand and implement the insights from your report.
        </p>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://astrotick.com/astrologers" style="display: inline-block; background: white; color: #f97316; border: 2px solid #f97316; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Book a Consultation</a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          <strong>Note:</strong> Your download link will be valid for 30 days. Please save your report securely.
        </p>
      </div>
    `;
    return this.getBaseTemplate(content, 'Your Report is Ready');
  }

  private getPaymentConfirmationTemplate(data: any): string {
    const content = `
      <div class="header">
        <h1>Payment Confirmed</h1>
        <p>Thank you for your payment of ₹${data.amount}</p>
      </div>
      <div class="content">
        <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hello ${data.userName},</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
          Your payment has been successfully processed. Thank you for choosing AstroTick for your astrological needs.
        </p>
        
        <div class="highlight">
          <h3 style="color: #f97316; margin: 0 0 20px 0;">Payment Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Amount:</td>
              <td style="padding: 12px 0; color: #16a34a; font-weight: bold; font-size: 20px;">₹${data.amount}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Payment For:</td>
              <td style="padding: 12px 0; color: #6b7280;">${data.paymentFor}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Transaction ID:</td>
              <td style="padding: 12px 0; color: #6b7280; font-family: monospace;">${data.transactionId}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Payment Date:</td>
              <td style="padding: 12px 0; color: #6b7280;">${data.paymentDate}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Status:</td>
              <td style="padding: 12px 0; color: #16a34a; font-weight: bold;">✓ SUCCESSFUL</td>
            </tr>
          </table>
        </div>
        
        <div class="info-box">
          <h4 style="margin: 0 0 10px 0; color: #92400e;">What Happens Next?</h4>
          <ul style="margin: 0; color: #92400e;">
            <li>You'll receive service-specific confirmation details shortly</li>
            <li>Our team will process your request within 24 hours</li>
            <li>You can track your order status in your account dashboard</li>
            <li>A receipt has been generated for your records</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://astrotick.com/dashboard" class="button">View Dashboard</a>
        </div>
        
        <div class="divider"></div>
        
        <p style="color: #6b7280;">
          Keep this email for your records. If you have any questions about your payment, please contact us at 
          <a href="mailto:support@astrotick.com" style="color: #f97316;">support@astrotick.com</a> 
          with your transaction ID.
        </p>
      </div>
    `;
    return this.getBaseTemplate(content, 'Payment Confirmation');
  }

  private getLoginOTPTemplate(data: any): string {
    const content = `
      <div class="header">
        <h1>Your Login Code</h1>
        <p>Use this code to access your AstroTick account</p>
      </div>
      <div class="content">
        <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hello ${data.userName},</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
          You requested to login to your AstroTick account. Use the 6-digit code below to complete your login.
        </p>
        
        <div style="text-align: center; margin: 40px 0;">
          <div style="display: inline-block; background: linear-gradient(135deg, #f97316, #dc2626); padding: 30px 40px; border-radius: 12px;">
            <div style="color: white; font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: monospace;">
              ${data.otpCode}
            </div>
          </div>
        </div>
        
        <div class="info-box">
          <h4 style="margin: 0 0 10px 0; color: #92400e;">Important Information:</h4>
          <ul style="margin: 0; color: #92400e;">
            <li>This code expires in ${data.expiryMinutes} minutes</li>
            <li>Use this code only once for login</li>
            <li>Don't share this code with anyone</li>
            <li>If you didn't request this, ignore this email</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://astrotick.com/login" class="button">Complete Login</a>
        </div>
        
        <div class="highlight">
          <h3 style="color: #dc2626; margin: 0 0 15px 0;">Security Notice</h3>
          <p style="margin: 0; color: #4b5563;">
            If you didn't request this login code, someone may be trying to access your account. Please secure your account and contact support if needed.
          </p>
        </div>
      </div>
    `;
    return this.getBaseTemplate(content, 'AstroTick Login Code');
  }

  private getPinResetOTPTemplate(data: any): string {
    const content = `
      <div class="header">
        <h1>Reset Your PIN</h1>
        <p>Use this code to create a new 6-digit PIN</p>
      </div>
      <div class="content">
        <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hello ${data.userName},</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
          You requested to reset your AstroTick PIN. Use the code below to verify your identity and create a new PIN.
        </p>
        
        <div style="text-align: center; margin: 40px 0;">
          <div style="display: inline-block; background: linear-gradient(135deg, #f97316, #dc2626); padding: 30px 40px; border-radius: 12px;">
            <div style="color: white; font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: monospace;">
              ${data.otpCode}
            </div>
          </div>
        </div>
        
        <div class="info-box">
          <h4 style="margin: 0 0 10px 0; color: #92400e;">PIN Reset Instructions:</h4>
          <ul style="margin: 0; color: #92400e;">
            <li>Enter this code on the PIN reset page</li>
            <li>Choose a new 6-digit PIN</li>
            <li>This code expires in ${data.expiryMinutes} minutes</li>
            <li>Use this code only once</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://astrotick.com/reset-pin" class="button">Reset My PIN</a>
        </div>
        
        <div class="highlight">
          <h3 style="color: #dc2626; margin: 0 0 15px 0;">Didn't Request This?</h3>
          <p style="margin: 0; color: #4b5563;">
            If you didn't request a PIN reset, please ignore this email. Your account remains secure and no changes will be made.
          </p>
        </div>
        
        <p style="color: #6b7280;">
          Need help? Contact our support team at 
          <a href="mailto:support@astrotick.com" style="color: #f97316;">support@astrotick.com</a>
        </p>
      </div>
    `;
    return this.getBaseTemplate(content, 'AstroTick PIN Reset', 'astrotick.com');
  }

  private getContactFormTemplate(data: any): string {
    const content = `
      <div class="header">
        <h1>New Contact Form Submission</h1>
        <p>Message received from ${data.name}</p>
      </div>
      <div class="content">
        <h2 style="color: #1f2937; margin: 0 0 20px 0;">Contact Form Details</h2>
        
        <div class="highlight">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151; width: 120px;">From:</td>
              <td style="padding: 12px 0; color: #6b7280;">${data.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Email:</td>
              <td style="padding: 12px 0; color: #6b7280;"><a href="mailto:${data.email}" style="color: #f97316;">${data.email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Subject:</td>
              <td style="padding: 12px 0; color: #6b7280; font-weight: bold;">${data.subject}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: bold; color: #374151;">Received:</td>
              <td style="padding: 12px 0; color: #6b7280;">${new Date().toLocaleString()}</td>
            </tr>
          </table>
        </div>
        
        <div style="margin: 30px 0;">
          <h3 style="color: #f97316; margin: 0 0 15px 0;">Message:</h3>
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; line-height: 1.6; color: #374151; white-space: pre-wrap;">${data.message}</div>
        </div>
        
        <div class="info-box">
          <h4 style="margin: 0 0 10px 0; color: #92400e;">Action Required:</h4>
          <ul style="margin: 0; color: #92400e;">
            <li>Respond to the customer within 24 hours</li>
            <li>Check if this requires immediate attention</li>
            <li>Update CRM with customer interaction</li>
            <li>Auto-reply confirmation has been sent to customer</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="mailto:${data.email}?subject=Re: ${data.subject}" class="button">Reply to Customer</a>
        </div>
      </div>
    `;
    return this.getBaseTemplate(content, 'New Contact Form Submission');
  }

  private getContactAutoReplyTemplate(data: any): string {
    const content = `
      <div class="header">
        <h1>Thank You for Contacting Us</h1>
        <p>We've received your message about "${data.subject}"</p>
      </div>
      <div class="content">
        <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hello ${data.name},</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
          Thank you for reaching out to AstroTick. We've received your message and our support team will review it carefully.
        </p>
        
        <div class="highlight">
          <h3 style="color: #f97316; margin: 0 0 15px 0;">What Happens Next?</h3>
          <ul style="color: #4b5563; line-height: 1.8;">
            <li><strong>Response Time:</strong> We'll respond within 24 hours</li>
            <li><strong>Priority:</strong> Urgent matters are handled first</li>
            <li><strong>Follow-up:</strong> We may ask for additional details if needed</li>
            <li><strong>Resolution:</strong> Our team will work to address your concerns completely</li>
          </ul>
        </div>
        
        <div class="info-box">
          <h4 style="margin: 0 0 15px 0; color: #92400e;">While You Wait, Explore:</h4>
          <div style="display: grid; gap: 15px; color: #92400e;">
            <div>
              <strong>📊 Free Birth Chart:</strong> Generate your personalized Kundli
              <br><a href="https://astrotick.com/kundli" style="color: #f97316; font-size: 14px;">Generate Now →</a>
            </div>
            <div>
              <strong>📅 Daily Panchangam:</strong> Check today's auspicious timings
              <br><a href="https://astrotick.com/panchang" style="color: #f97316; font-size: 14px;">View Today →</a>
            </div>
            <div>
              <strong>🔮 Expert Consultations:</strong> Book a session with our astrologers
              <br><a href="https://astrotick.com/astrologers" style="color: #f97316; font-size: 14px;">Browse Experts →</a>
            </div>
          </div>
        </div>
        
        <div class="divider"></div>
        
        <h3 style="color: #1f2937;">Need Immediate Assistance?</h3>
        <p style="color: #6b7280;">
          For urgent matters, you can also reach us at:
        </p>
        <ul style="color: #6b7280;">
          <li>Email: <a href="mailto:support@astrotick.com" style="color: #f97316;">support@astrotick.com</a></li>
          <li>Response Time: Within 24 hours</li>
          <li>Business Hours: Available 24/7 online</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://astrotick.com" class="button">Continue Exploring</a>
        </div>
        
        <p style="color: #6b7280; font-style: italic;">
          This is an automated confirmation. Please don't reply to this email. Our team will contact you directly with a personalized response.
        </p>
      </div>
    `;
    return this.getBaseTemplate(content, 'Thank You for Contacting AstroTick');
  }
}

export const emailService = new EmailService();