import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Creates and caches the nodemailer transporter based on environment configuration.
 * Supports standard SMTP (Gmail, SendGrid, Amazon SES, custom corporate mail servers).
 * If SMTP credentials are not configured, falls back to a development logger.
 */
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (host && user && pass) {
    try {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });
      console.log(`[EmailService] Configured live SMTP transport with host: ${host}:${port} (${user})`);
      return transporter;
    } catch (err) {
      console.error('[EmailService] Failed to initialize SMTP transporter:', err.message);
    }
  }

  // Fallback transporter: Logs email dispatch details clearly in development/local environments
  transporter = {
    sendMail: async (mailOptions) => {
      console.log('----------------------------------------------------');
      console.log('[EmailService - Simulated Dispatch (Configure SMTP in .env)]');
      console.log(`To:      ${mailOptions.to}`);
      console.log(`From:    ${mailOptions.from}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`Date:    ${new Date().toISOString()}`);
      console.log('----------------------------------------------------');
      return {
        messageId: 'simulated-' + Date.now(),
        response: 'Simulated dispatch (configure SMTP_HOST/SMTP_USER/SMTP_PASS in .env for live SMTP delivery)',
      };
    },
  };

  return transporter;
}

/**
 * Sends an immediate acknowledgment email to a candidate who applied for a job role.
 * Confirms receipt of application and informs the user that the team is reviewing their profile.
 *
 * @param {Object} params
 * @param {string} params.candidateName
 * @param {string} params.candidateEmail
 * @param {string} params.jobTitle
 * @param {string} [params.applicationId]
 * @param {string} [params.createdAt]
 */
export async function sendApplicationAcknowledgment({
  candidateName,
  candidateEmail,
  jobTitle = 'Job Role',
  applicationId = '',
  createdAt = new Date().toISOString(),
}) {
  if (!candidateEmail) {
    throw new Error('Candidate email is required to send application acknowledgment.');
  }

  const cleanName = candidateName || 'Candidate';
  const cleanTitle = jobTitle || 'Position';
  const submissionDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'careers@durgamsoft.com';
  const replyToEmail = 'careers@durgamsoft.com';

  const subject = `Application Received: ${cleanTitle} - Durgam Soft Pvt. Ltd.`;

  const plainText = `Dear ${cleanName},

Thank you for applying for the ${cleanTitle} position at Durgam Soft Pvt. Ltd.!

We have successfully received your application and resume. Our hiring and technical evaluation team is currently reviewing your profile and credentials against the position requirements.

What to Expect Next:
1. Application Review: Our recruitment team carefully assesses each candidate's qualifications, experience, and background.
2. Shortlisting & Selection: If your profile is shortlisted for the next evaluation round, we will get back to you directly with an invitation for the next steps (technical assessment or interview discussion).
3. Status Updates: You will receive all further notifications regarding your application directly at this email address (${candidateEmail}).

Application Summary:
- Position Applied: ${cleanTitle}
${applicationId ? `- Application Reference ID: ${applicationId}\n` : ''}- Submission Date: ${submissionDate}
- Current Status: Under Review

If you have any questions in the meantime, please feel free to reply directly to this email or reach our talent acquisition team at careers@durgamsoft.com.

Thank you again for your interest in building your career with Durgam Soft!

Warm regards,
Talent Acquisition Team
Durgam Soft Pvt. Ltd.
Hitech City, Hyderabad, Telangana, India
Email: careers@durgamsoft.com | Web: https://www.durgamsoft.com
`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received - Durgam Soft</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          
          <!-- Top Accent Header Banner -->
          <tr>
            <td style="background-color: #0B1F3A; padding: 28px 30px; text-align: left;">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <div style="font-size: 20px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; text-transform: uppercase;">
                      DURGAM SOFT PVT. LTD.
                    </div>
                    <div style="font-size: 11px; font-weight: 700; color: #EA580C; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 3px;">
                      Innovate • Develop • Deliver
                    </div>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; padding: 5px 12px; background-color: rgba(234,88,12,0.18); border: 1px solid rgba(234,88,12,0.4); border-radius: 20px; font-size: 11px; font-weight: 800; color: #ffedd5; text-transform: uppercase; letter-spacing: 0.5px;">
                      Application Confirmed
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Color Brand Divider -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #0B1F3A 0%, #EA580C 100%);"></td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 30px;">
              <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0;">
                Thank You for Applying, ${cleanName}!
              </h1>

              <p style="font-size: 14px; color: #334155; margin: 0 0 16px 0;">
                We have successfully received your application for the 
                <strong style="color: #EA580C;">${cleanTitle}</strong> position at Durgam Soft Pvt. Ltd.
              </p>

              <!-- Status Notification Banner -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; margin: 20px 0; padding: 16px;">
                <tr>
                  <td>
                    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #1e40af; margin-bottom: 4px;">
                      Current Status: Application Under Review
                    </div>
                    <div style="font-size: 13px; color: #1e3a8a;">
                      Our talent acquisition team is actively reviewing your resume, qualifications, and past experience. We will get back to you directly when your profile is selected for the next round.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Next Steps Timeline -->
              <div style="margin: 24px 0 18px 0;">
                <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 12px;">
                  What Happens Next
                </div>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 13px; color: #334155;">
                  <tr>
                    <td style="width: 28px; vertical-align: top; padding-bottom: 12px;">
                      <span style="display: inline-block; width: 20px; height: 20px; background-color: #0B1F3A; color: #ffffff; border-radius: 50%; text-align: center; line-height: 20px; font-size: 11px; font-weight: 800;">1</span>
                    </td>
                    <td style="padding-bottom: 12px;">
                      <strong>Profile Evaluation:</strong> Our technical leadership assesses every application within 48 to 72 hours.
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 28px; vertical-align: top; padding-bottom: 12px;">
                      <span style="display: inline-block; width: 20px; height: 20px; background-color: #EA580C; color: #ffffff; border-radius: 50%; text-align: center; line-height: 20px; font-size: 11px; font-weight: 800;">2</span>
                    </td>
                    <td style="padding-bottom: 12px;">
                      <strong>Next Round Invitation:</strong> When shortlisted, you will receive an invitation email containing details for your technical assessment or interview schedule.
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 28px; vertical-align: top;">
                      <span style="display: inline-block; width: 20px; height: 20px; background-color: #10b981; color: #ffffff; border-radius: 50%; text-align: center; line-height: 20px; font-size: 11px; font-weight: 800;">3</span>
                    </td>
                    <td>
                      <strong>Direct Communication:</strong> You can reply directly to this email at any point if you have questions or updates regarding your availability.
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Application Summary Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin: 20px 0; padding: 14px 18px; font-size: 12px;">
                <tr>
                  <td style="padding: 4px 0; color: #64748b; width: 38%;"><strong>Role Applied:</strong></td>
                  <td style="padding: 4px 0; color: #0f172a; font-weight: 700;">${cleanTitle}</td>
                </tr>
                ${
                  applicationId
                    ? `<tr>
                  <td style="padding: 4px 0; color: #64748b;"><strong>Reference ID:</strong></td>
                  <td style="padding: 4px 0; color: #0f172a; font-family: monospace;">${applicationId}</td>
                </tr>`
                    : ''
                }
                <tr>
                  <td style="padding: 4px 0; color: #64748b;"><strong>Date Submitted:</strong></td>
                  <td style="padding: 4px 0; color: #0f172a;">${submissionDate}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;"><strong>Notification Email:</strong></td>
                  <td style="padding: 4px 0; color: #0f172a;">${candidateEmail}</td>
                </tr>
              </table>

              <p style="font-size: 13px; color: #475569; margin: 20px 0 0 0;">
                Thank you again for your interest in building high-impact software products with Durgam Soft.
              </p>

              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #334155;">
                <strong>Talent Acquisition Team</strong><br>
                <span style="color: #64748b;">Durgam Soft Pvt. Ltd.</span><br>
                <span style="color: #64748b;">Hitech City, Hyderabad, Telangana, India</span><br>
                <a href="mailto:careers@durgamsoft.com" style="color: #EA580C; text-decoration: none; font-weight: 600;">careers@durgamsoft.com</a> • 
                <a href="https://www.durgamsoft.com" style="color: #EA580C; text-decoration: none; font-weight: 600;">www.durgamsoft.com</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 18px 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
              This is an automated notification from the Durgam Soft Careers System. You received this because an application was submitted with ${candidateEmail}.<br>
              © ${new Date().getFullYear()} Durgam Soft Pvt. Ltd. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const activeTransporter = getTransporter();
  const info = await activeTransporter.sendMail({
    from: `"Durgam Soft Careers" <${fromEmail}>`,
    to: candidateEmail,
    replyTo: replyToEmail,
    subject,
    text: plainText,
    html: htmlContent,
  });

  return {
    success: true,
    messageId: info.messageId,
    subject,
    candidateEmail,
    jobTitle: cleanTitle,
  };
}

export default {
  sendApplicationAcknowledgment,
};
