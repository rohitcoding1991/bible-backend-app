require("dotenv").config();
const request = require("supertest");
const express = require("express");

const {
  getAuthUrl,
  getAccessToken,
  getMails,
  getMailById,
} = require("../controllers/gmailController");
const { fetchAuthUrl, fetchAccessToken } = require("../config/auth");
const { listEmails, getEmail } = require("../services/gmailService");
const prisma = require("../prismaClient/prismaClient");

// Mock dependencies
jest.mock("../config/auth");
jest.mock("../services/gmailService");
jest.mock("../prismaClient/prismaClient");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.user = { username: "testUser" };
  next();
});
app.get("/auth/url", getAuthUrl);
app.get("/auth/token", getAccessToken);
app.get("/mails", getMails);
app.get("/mails/:id", getMailById);

describe("Email Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the auth URL", async () => {
    const mockAuthUrl = "http://example.com/auth";
    fetchAuthUrl.mockReturnValue(mockAuthUrl);

    const response = await request(app).get("/auth/url");

    expect(response.status).toBe(200);
    expect(response.text).toBe(mockAuthUrl);
    expect(fetchAuthUrl).toHaveBeenCalledWith("testUser");
  });

  it("should store access tokens in the database", async () => {
    const mockTokens = {
      access_token: "accessToken",
      refresh_token: "refreshToken",
    };
    fetchAccessToken.mockResolvedValue(mockTokens);
    prisma.oAuthToken.findFirst.mockResolvedValue(null);
    prisma.oAuthToken.create.mockResolvedValue(mockTokens);

    const response = await request(app).get(
      "/auth/token?code=authCode&state=" + JSON.stringify({ userId: 1 })
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Authentication successful!");
    expect(fetchAccessToken).toHaveBeenCalledWith("authCode");
    expect(prisma.oAuthToken.create).toHaveBeenCalledWith({ data: mockTokens });
  });

  it("should update existing tokens in the database", async () => {
    const mockTokens = {
      access_token: "accessToken",
      refresh_token: "refreshToken",
    };
    fetchAccessToken.mockResolvedValue(mockTokens);
    prisma.oAuthToken.findFirst.mockResolvedValue(mockTokens);
    prisma.oAuthToken.update.mockResolvedValue({ ...mockTokens, userId: 1 });

    const response = await request(app).get(
      "/auth/token?code=authCode&state=" + JSON.stringify({ userId: 1 })
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Authentication successful!");
    expect(fetchAccessToken).toHaveBeenCalledWith("authCode");
    expect(prisma.oAuthToken.update).toHaveBeenCalledWith({
      where: { userId: 1 },
      data: mockTokens,
    });
  });

  it("should return emails", async () => {
    const mockEmails = { emailDetails: [], pageNo: 2 };
    listEmails.mockResolvedValue(mockEmails);

    const response = await request(app).get("/mails?pageNo=1");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toEqual(mockEmails.emailDetails);
    expect(response.body.nextPageNo).toBe(mockEmails.pageNo);
    expect(listEmails).toHaveBeenCalledWith("testUser", "1");
  });

  it("should handle no access token found", async () => {
    listEmails.mockResolvedValue(null);

    const response = await request(app).get("/mails?pageNo=1");

    expect(response.status).toBe(400);
    expect(response.body.status).toBe("failed");
    expect(response.body.message).toBe("No access token found");
  });

  it("should return email by ID", async () => {
    const mockEmail = { id: 1, subject: "Test Email" };
    getEmail.mockResolvedValue(mockEmail);

    const response = await request(app).get("/mails/1");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toEqual(mockEmail);
    expect(getEmail).toHaveBeenCalledWith("testUser", "1");
  });

  it("should handle errors retrieving email", async () => {
    getEmail.mockRejectedValue(new Error("Error retrieving email"));

    const response = await request(app).get("/mails/1");

    expect(response.status).toBe(500);
    expect(response.text).toBe("Error retrieving email");
  });
});
