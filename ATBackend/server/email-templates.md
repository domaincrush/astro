# AstroScroll Email Templates Documentation

## Available Email Templates

The AstroScroll platform includes a comprehensive set of professional email templates for all user communications:

### 1. Welcome Email (`sendWelcomeEmail`)
**Trigger**: New user registration
**Purpose**: Welcome new users and introduce platform features
**Content**: 
- Welcome message with personalized greeting
- Platform feature overview
- Quick action buttons (Generate Kundli, etc.)
- Why choose AstroScroll benefits
- Support contact information

### 2. Consultation Confirmation (`sendConsultationConfirmation`)
**Trigger**: Successful consultation booking and payment
**Purpose**: Confirm consultation details and provide important information
**Content**:
- Consultation details table (astrologer, date, time, amount)
- Transaction ID for reference
- Preparation checklist and important notes
- Direct link to consultations dashboard
- Rescheduling information

### 3. Consultation Reminder (`sendConsultationReminder`)
**Trigger**: 24 hours before scheduled consultation
**Purpose**: Remind users about upcoming consultation
**Content**:
- Session details highlighting date and time
- Preparation checklist with actionable items
- Meeting link (if available)
- Last-minute contact information
- Rescheduling options

### 4. Report Delivery (`sendReportDelivery`)
**Trigger**: Astrological report generation completion
**Purpose**: Deliver personalized reports to users
**Content**:
- Report type and order number
- Direct download link with prominent button
- Report contents overview
- Consultation booking for report clarification
- Download link validity period (30 days)

### 5. Payment Confirmation (`sendPaymentConfirmation`)
**Trigger**: Successful payment processing
**Purpose**: Confirm payment and provide receipt details
**Content**:
- Payment summary with amount and transaction ID
- Payment status with success indicator
- What happens next information
- Dashboard access link
- Receipt storage recommendation

### 6. Password Reset (`sendPasswordReset`)
**Trigger**: Password reset request
**Purpose**: Secure password reset with time-limited link
**Content**:
- Secure reset link with expiration time
- Security instructions and best practices
- Alternative action if not requested
- Manual link copy option
- Support contact for assistance

### 7. Contact Form Submission (`sendContactFormSubmission`)
**Trigger**: Contact form submission (internal notification)
**Purpose**: Notify support team of new customer message
**Content**:
- Customer details and message content
- Timestamp and priority indicators
- Action items for support team
- Direct reply functionality
- Customer response requirements

### 8. Contact Auto-Reply (`sendContactAutoReply`)
**Trigger**: Contact form submission (customer confirmation)
**Purpose**: Acknowledge receipt and set expectations
**Content**:
- Confirmation of message receipt
- Response time expectations (24 hours)
- Platform features to explore while waiting
- Alternative contact methods
- Automated message disclaimer

## Template Features

### Design Elements
- **Responsive Design**: All templates work on desktop and mobile
- **Brand Consistency**: AstroScroll colors (orange #f97316, red #dc2626)
- **Professional Layout**: Clean, structured HTML with CSS styling
- **Accessibility**: High contrast, readable fonts, clear hierarchy

### Common Components
- **Header**: Gradient background with logo and title
- **Content Area**: White background with structured information
- **Footer**: Contact information and branding
- **Call-to-Action Buttons**: Prominent, gradient-styled buttons
- **Information Boxes**: Highlighted important information
- **Data Tables**: Organized display of details

### Technical Implementation
- **HTML Email Compatible**: Works across all major email clients
- **Inline CSS**: Ensures consistent rendering
- **Fallback Text**: Plain text versions available
- **Error Handling**: Graceful degradation for failed sends
- **Logging**: All email activities tracked with message IDs

## Usage Examples

### Send Welcome Email
```typescript
await emailService.sendWelcomeEmail({
  name: "John Doe",
  email: "john@example.com"
});
```

### Send Consultation Confirmation
```typescript
await emailService.sendConsultationConfirmation({
  userName: "John Doe",
  userEmail: "john@example.com",
  astrologerName: "Priya Sharma",
  consultationType: "Birth Chart Reading",
  consultationDate: "January 15, 2025",
  consultationTime: "10:00 AM IST",
  amount: 1500,
  transactionId: "TXN123456789"
});
```

### Send Report Delivery
```typescript
await emailService.sendReportDelivery({
  userName: "John Doe",
  userEmail: "john@example.com",
  reportType: "Comprehensive Astrological Report",
  downloadLink: "https://astrotick.com/download-report/abc123",
  orderNumber: "ORD-2025-001"
});
```

## Email Service Configuration

The email service uses DreamHost SMTP with the following settings:
- **Host**: smtp.dreamhost.com
- **Port**: 587 (TLS)
- **From Address**: support@astrotick.com
- **Authentication**: Username and password based

All templates are mobile-responsive and tested across major email clients including Gmail, Outlook, Yahoo Mail, and Apple Mail.

## Support and Maintenance

- **Message Tracking**: All emails generate unique message IDs for tracking
- **Error Logging**: Failed sends are logged with detailed error information
- **Template Updates**: Templates can be updated centrally in the EmailService class
- **Testing**: Use the `/api/test-email` endpoint for template testing
- **Monitoring**: Email delivery status can be monitored through server logs