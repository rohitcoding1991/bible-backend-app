const { google } = require("googleapis");
const { oauth2Client } = require("../config/auth");
const prisma = require("../prismaClient/prismaClient");

async function setCredentialsFromDB(userId) {
  try {
    const auth = await prisma.oAuthToken.findFirst({
      where: { userId },
    });

    if (!auth) {
      return null;
    }

    oauth2Client.setCredentials({
      access_token: auth.access_token,
      refresh_token: auth.refresh_token,
      expiry_date: auth.expiry_date,
      scope: auth.scope,
      token_type: auth.token_type,
    });

    // Check if token needs refreshing
    if (oauth2Client.isTokenExpiring()) {
      const tokens = await oauth2Client.refreshAccessToken();

      oauth2Client.setCredentials(tokens.credentials);

      // Update the refreshed token in the database
      prisma.oAuthToken.update({
        where: {
          userId: userId,
        },
        data: tokens,
      });
    }
    return true;
  } catch (err) {
    console.log(err);
  }
}

async function listEmails(userId, pageNo) {
  try {
    let result = await setCredentialsFromDB(userId); // Set credentials before making API call
    if (result === null) {
      return null;
    }
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Fetch the list of message IDs
    const res = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
      pageToken: pageNo,
    });

    // Extract message IDs from the response
    const messages = res.data.messages;

    // Fetch details for each email
    const emailDetails = await Promise.all(
      messages.map(async (message) => {
        return await getEmail(userId, message.id);
      })
    );

    return { emailDetails, pageNo: res.data.nextPageToken };
  } catch (err) {
    console.log(err);
  }
}

// Retrieve details of a specific email
async function getEmail(userId, emailId) {
  await setCredentialsFromDB(userId); // Set credentials before making API call

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const res = await gmail.users.messages.get({
    userId: "me",
    id: emailId,
  });

  return res.data;
}
// Helper to check if token needs refreshing

module.exports = {
  listEmails,
  getEmail,
};
