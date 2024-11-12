const { fetchAuthUrl, fetchAccessToken } = require("../config/auth");
const { listEmails, getEmail } = require("../services/gmailService");
const prisma = require("../prismaClient/prismaClient");
  
const getAuthUrl = async (req, res) => {
  let { username } = req.user;
  const authUrl = fetchAuthUrl(username);

  res.send(authUrl);
};

const getAccessToken = async (req, res) => {
  const { code, state } = req.query;
  if (state) {
    const { userId } = JSON.parse(state);

    const tokens = await fetchAccessToken(code);
    tokens.userId = userId;
    const auth = await prisma.oAuthToken.findFirst({
      where: { userId },
    });

    if (auth) {
      prisma.oAuthToken.update({
        where: {
          userId: userId,
        },
        data: tokens,
      });
    } else {
      await prisma.oAuthToken.create({
        data: tokens,
      });
    }

    res.status(200).send({ message: "Authentication successful!" });
  }
};

const getMails = async (req, res) => {
  let { username } = req.user;
  let { pageNo } = req.query;
  try {
    const result = await listEmails(username, pageNo);

    if (result === null) {
      return res.status(400).send({
        status: "failed",
        statusCode: 400,
        message: "No access token found",
        data: [],
      });
    } else {
      res.status(200).send({
        status: "success",
        statusCode: 200,
        message: "Emails retrieved successfully",
        data: result.emailDetails,
        nextPageNo: result.pageNo,
      });
    }
  } catch (error) {
    res.status(500).send("Error retrieving emails");
  }
};

const getMailById = async (req, res) => {
  let { username } = req.user;
  try {
    const email = await getEmail(username, req.params.id);
    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "Emails retrieved successfully",
      data: email,
    });
  } catch (error) {
    res.status(500).send("Error retrieving email");
  }
};

module.exports = { getAuthUrl, getAccessToken, getMails, getMailById };
