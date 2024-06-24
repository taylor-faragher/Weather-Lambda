import {
    AuthFlowType,
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {getDecryptedCredentials} from './getDecryptedCredentials';

const cognitoClient = new CognitoIdentityProviderClient({region: 'us-east-1'});

interface AuthResponse {
    idToken: string;
    accessToken: string;
    refreshToken: string;
}

export const authenticateUser = async (): Promise<AuthResponse> => {
    const {decryptedUsername, decryptedPassword, decryptedClientId} = await getDecryptedCredentials();
    const CLIENT_ID = decryptedClientId;
    const username = decryptedUsername;
    const password = decryptedPassword;

    const params = {
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: CLIENT_ID,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
        },
    };

    const command = new InitiateAuthCommand(params);
    const response = await cognitoClient.send(command);

    if (!response.AuthenticationResult) {
        throw new Error('Authentication failed');
    }

    return {
        idToken: response.AuthenticationResult.IdToken!,
        accessToken: response.AuthenticationResult.AccessToken!,
        refreshToken: response.AuthenticationResult.RefreshToken!,
    };
};
