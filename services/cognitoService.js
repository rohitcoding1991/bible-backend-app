const cognitoClient = require("../config/aws");
const {
  SignUpCommand,
  AdminInitiateAuthCommand,
  ConfirmSignUpCommand,
  ListUsersCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const signUpUser = async (email, password, name) => {
  const command = new SignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "name",
        Value: name,
      },
    ],
  });

  return await cognitoClient.send(command);
};
const confirmSignUp = async (email, confirmationCode) => {
  try {
    const command = new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID, // Your Cognito App Client ID
      Username: email, // The username or email the user signed up with
      ConfirmationCode: confirmationCode, // The OTP or confirmation code sent to the user
    });

    const response = await cognitoClient.send(command);
  } catch (error) {
    console.error("Error confirming sign up:", error);
    throw error;
  }
};
const signInUser = async (email, password) => {
  try {
    const command = new AdminInitiateAuthCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthFlow: "ADMIN_NO_SRP_AUTH", // Specify authentication flow
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const response = await cognitoClient.send(command);
    return response.AuthenticationResult;
  } catch (error) {
    console.error("Error confirming sign up:", error);
    throw error;
  }
};

const listCognitoUsers = async () => {
  const params = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Limit: 60,
  };

  try {
    const command = new ListUsersCommand(params);
    const data = await cognitoClient.send(command);
    return data.Users;
  } catch (error) {
    console.error("Error fetching Cognito users:", error);
    throw error;
  }
};

module.exports = { signUpUser, signInUser, confirmSignUp, listCognitoUsers };
