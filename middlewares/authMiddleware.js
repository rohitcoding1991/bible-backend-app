const jwt = require("jsonwebtoken");
const axios = require("axios");
const jwkToPem = require("jwk-to-pem");

const JWKS_URL = process.env.JWKS_URL;

const getPublicKey = async (kid) => {
  try {
    const { data } = await axios.get(JWKS_URL);

    const key = data.keys.find((key) => key.kid === kid);

    if (!key) {
      throw new Error("Public key not found");
    }

    return jwkToPem(key);
  } catch (error) {
    throw new Error("Error fetching public key: " + error.message);
  }
};
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedHeader = jwt.decode(token, { complete: true });
    const kid = decodedHeader.header.kid;

    const publicKey = await getPublicKey(kid);

    jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

module.exports = authMiddleware;
