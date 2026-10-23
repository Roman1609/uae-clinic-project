import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, specialty, timeline, notes } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: "Full Name and Phone / WhatsApp number are required." },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || 465);
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    const user = process.env.GMAIL_USER || "usefultech.agency@gmail.com";
    const pass = process.env.GMAIL_APP_PASSWORD || "opiltdfqptsfajse";
    const from = process.env.MAIL_FROM || `"DubaiMed" <no-reply@kingoclock.com>`;
    const to = process.env.MAIL_TO || "usefultech.agency@gmail.com";

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    const emailSubject = `[DubaiMed Lead] ${fullName} - ${specialty || "Clinic Setup Consultation"}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0D0F12; color: #FFFFFF; margin: 0; padding: 24px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #16191E; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            .header { background: linear-gradient(135deg, #1C2128 0%, #0D0F12 100%); padding: 30px 24px; border-bottom: 2px solid #D4AF37; text-align: center; }
            .logo-text { font-size: 22px; font-weight: bold; letter-spacing: 4px; color: #D4AF37; text-transform: uppercase; margin: 0; }
            .sub-title { font-size: 11px; letter-spacing: 2px; color: #A1A1AA; text-transform: uppercase; margin-top: 6px; }
            .content { padding: 32px 24px; }
            .badge { display: inline-block; background-color: rgba(212, 175, 55, 0.15); color: #D4AF37; border: 1px solid rgba(212, 175, 55, 0.4); padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px; }
            .field-row { margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
            .label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; margin-bottom: 4px; }
            .value { font-size: 16px; color: #FFFFFF; font-weight: 500; }
            .value-highlight { color: #ECC867; font-weight: 600; }
            .notes-box { background-color: #0D0F12; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 14px; font-size: 14px; color: #CBD5E1; line-height: 1.6; white-space: pre-wrap; margin-top: 6px; }
            .footer { background-color: #0D0F12; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid rgba(255, 255, 255, 0.06); }
            .action-btn { display: inline-block; margin-top: 15px; padding: 12px 24px; background: linear-gradient(135deg, #E5C772 0%, #D4AF37 50%, #B89224 100%); color: #0D0F12; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo-text">DubaiMed Consult</h1>
              <div class="sub-title">New Strategic Consultation Request</div>
            </div>
            <div class="content">
              <div class="badge">Direct Healthcare Lead</div>

              <div class="field-row">
                <div class="label">Full Name</div>
                <div class="value">${fullName}</div>
              </div>

              <div class="field-row">
                <div class="label">Phone / WhatsApp</div>
                <div class="value value-highlight">
                  <a href="https://wa.me/${phone.replace(/[^0-9]/g, "")}" style="color: #ECC867; text-decoration: none;">
                    ${phone} ↗ (Chat on WhatsApp)
                  </a>
                </div>
              </div>

              <div class="field-row">
                <div class="label">Preferred Clinic Specialty</div>
                <div class="value">${specialty || "Not specified"}</div>
              </div>

              <div class="field-row">
                <div class="label">Target Setup Timeline</div>
                <div class="value">${timeline || "Immediate"}</div>
              </div>

              ${
                notes
                  ? `
                <div class="field-row" style="border-bottom: none;">
                  <div class="label">Project Vision / Inquiries</div>
                  <div class="notes-box">${notes}</div>
                </div>
              `
                  : ""
              }

              <div style="text-align: center; margin-top: 25px;">
                <a href="tel:${phone.replace(/[^0-9+]/g, "")}" class="action-btn">
                  Direct Call: ${phone}
                </a>
              </div>
            </div>
            <div class="footer">
              Sent automatically from DubaiMed Consult Landing Page Platform • Dubai, UAE
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from,
      to,
      subject: emailSubject,
      text: `New DubaiMed Lead:\nName: ${fullName}\nPhone: ${phone}\nSpecialty: ${specialty}\nTimeline: ${timeline}\nNotes: ${notes || "None"}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Error sending email:", err);
    const message = err instanceof Error ? err.message : "Failed to send consultation request.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
