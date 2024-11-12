const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDRIECT_URI || 'http://localhost:2000/auth/google/callback';

const oauth2Client = new OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Generate a URL to request access from Google's OAuth 2.0 server
function fetchAuthUrl(userId) {
  const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
    state: JSON.stringify({
      userId,
    }),
  });
}

// Exchange the authorization code for tokens
async function fetchAccessToken(code) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}
oauth2Client.isTokenExpiring = function() {
  const now = new Date().getTime();
  return !this.credentials.expiry_date || now >= this.credentials.expiry_date;
};
module.exports = {
  oauth2Client,
  fetchAuthUrl,
  fetchAccessToken,
};
