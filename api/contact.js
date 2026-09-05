import { Resend } from 'resend';

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
  // Reject non-POST requests
  if (req.method !== 'POST') {
    if (res.setHeader) res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON payload' });
      }
    }

    const { name, email, message, _honeypot } = body || {};

    // Honeypot check: silently accept to trick automated bots
    if (_honeypot && typeof _honeypot === 'string' && _honeypot.trim() !== '') {
      return res.status(200).json({ success: true, message: 'Message sent successfully' });
    }

    // Server-side validations
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length > 100) {
      return res.status(400).json({ error: 'Name must be 100 characters or less' });
    }
    if (trimmedEmail.length > 254) {
      return res.status(400).json({ error: 'Email must be 254 characters or less' });
    }
    if (trimmedMessage.length > 5000) {
      return res.status(400).json({ error: 'Message must be 5000 characters or less' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY environment variable is not configured.');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const resend = new Resend(apiKey);
    const safeName = escapeHtml(trimmedName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeMessage = escapeHtml(trimmedMessage);

    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact Form <onboarding@resend.dev>',
      to: ['apk355194@gmail.com'],
      replyTo: trimmedEmail,
      subject: `New Portfolio Message from ${trimmedName}`,
      text: `New message received from your portfolio.\n\nName:\n${trimmedName}\n\nEmail:\n${trimmedEmail}\n\nMessage:\n${trimmedMessage}\n\n---\nSent from Aman Kumar's portfolio website.`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #1e293b; background-color: #f8fafc; border-radius: 8px;">
          <h2 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">New Portfolio Message</h2>
          <p style="margin: 12px 0;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin: 12px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #2563eb;">${safeEmail}</a></p>
          <div style="margin-top: 20px; padding: 16px; background-color: #ffffff; border-left: 4px solid #f2b759; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <p style="white-space: pre-wrap; margin: 0; font-size: 14px; line-height: 1.6; color: #334155;">${safeMessage}</p>
          </div>
          <hr style="margin-top: 24px; border: none; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">Sent from Aman Kumar's portfolio website.</p>
        </div>
      `
    });

    if (error) {
      console.error('Resend delivery error:', error);
      return res.status(500).json({ error: 'Failed to deliver message' });
    }

    return res.status(200).json({ success: true, message: 'Message sent successfully', id: data?.id });
  } catch (err) {
    console.error('API /api/contact handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
