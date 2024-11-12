// tests/authController.test.js
require("dotenv").config();

const {
  signUp,
  handleVerifyOtp,
  getUsers,
} = require("../controllers/authController");
const cognitoService = require("../services/cognitoService");

// Mocking the services
jest.mock("../services/cognitoService");

describe("Auth Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should sign up a user successfully", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "password123",
        name: "John Doe",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    cognitoService.signUpUser.mockResolvedValue({ userSub: "12345" });

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      status: "success",
      statusCode: 200,
      message: "user signup successfully",
      data: { userSub: "12345" },
    });
  });

  it("should handle error when sign up fails", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "password123",
        name: "John Doe",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    cognitoService.signUpUser.mockRejectedValue(new Error("Sign up failed"));

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      status: "failed",
      statusCode: 400,
      message: "Sign up failed",
      data: [],
    });
  });

  it("should verify OTP successfully", async () => {
    const req = {
      body: { email: "test@example.com", otpCode: "123456" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    cognitoService.confirmSignUp.mockResolvedValue({ success: true });

    await handleVerifyOtp(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      status: "success",
      statusCode: 200,
      message: "otp verify successfully",
      data: { success: true },
    });
  });

  it("should list Cognito users successfully", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    cognitoService.listCognitoUsers.mockResolvedValue([
      { Username: "test@example.com" },
    ]);

    await getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      status: "success",
      statusCode: 200,
      message: "users get successfully",
      data: [{ Username: "test@example.com" }],
    });
  });
});
