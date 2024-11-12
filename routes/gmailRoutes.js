const express = require("express");
const {
  getAccessToken,
  getAuthUrl,
  getMails,
  getMailById,
} = require("../controllers/gmailController");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, getAuthUrl);
router.get("/callback", getAccessToken);
router.get("/mails", authMiddleware, getMails);
router.get("/mails/:id", authMiddleware, getMailById);

module.exports = router;
