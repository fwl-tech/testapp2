import { google } from 'googleapis'

function getOAuthClient() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    throw new Error(
      'Gmail is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN (see docs/SETUP.md).'
    )
  }
  const client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
  client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN })
  return client
}

function encodeMessage(raw: string): string {
  return Buffer.from(raw)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export async function sendEmail(opts: { to: string; subject: string; html: string; text: string }) {
  const auth = getOAuthClient()
  const gmail = google.gmail({ version: 'v1', auth })
  const from = process.env.GMAIL_SENDER_EMAIL || 'me'

  const boundary = 'billing-agent-boundary'
  const raw = [
    `From: ${from}`,
    `To: ${opts.to}`,
    `Subject: ${opts.subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    opts.text,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    '',
    opts.html,
    '',
    `--${boundary}--`,
  ].join('\r\n')

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encodeMessage(raw) },
  })
  return res.data
}
