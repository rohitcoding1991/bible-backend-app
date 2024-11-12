const {
  signUpUser,
  signInUser,
  confirmSignUp,
  listCognitoUsers,
} = require("../services/cognitoService");

const signUp = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const data = await signUpUser(email, password, name);
    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "user signup successfully",
      data,
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      statusCode: 400,
      message: error.message,
      data: [],
    });
  }
};
const handleVerifyOtp = async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    const data = await confirmSignUp(email, otpCode);
    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "otp verify successfully",
      data,
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      statusCode: 400,
      message: error.message,
      data: [],
    });
  }
};
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await signInUser(email, password);
    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "user signin successfully",
      data,
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      statusCode: 400,
      message: error.message,
      data: [],
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const data = await listCognitoUsers();
    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "users get successfully",
      data,
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      statusCode: 400,
      message: error.message,
      data: [],
    });
  }
};
module.exports = { signUp, signIn, handleVerifyOtp, getUsers };
