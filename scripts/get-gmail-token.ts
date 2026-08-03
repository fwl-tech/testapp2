// One-time local helper: obtains a Gmail OAuth2 refresh token for the billing agent.
// Usage: GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... npm run gmail:token
import { google } from 'googleapis'
import http from 'http'
import { URL } from 'url'

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = 'http://localhost:53682/oauth2callback'

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET env vars first (see docs/SETUP.md).')
  process.exit(1)
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/gmail.send'],
})

console.log('Open this URL, sign in with the Gmail account that should send invoices, and approve access:\n')
console.log(authUrl, '\n')

const server = http.createServer(async (req, res) => {
  if (!req.url) return
  const url = new URL(req.url, REDIRECT_URI)
  const code = url.searchParams.get('code')
  if (!code) return

  const { tokens } = await oauth2Client.getToken(code)
  res.end('Success! You can close this tab and return to the terminal.')
  server.close()

  console.log('\nGOOGLE_REFRESH_TOKEN=', tokens.refresh_token)
  console.log('\nAdd that as GOOGLE_REFRESH_TOKEN in your .env / Railway variables.')
  process.exit(0)
})

server.listen(53682)
