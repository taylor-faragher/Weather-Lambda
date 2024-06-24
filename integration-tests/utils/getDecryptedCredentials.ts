import {SecretsManagerClient, GetSecretValueCommand} from '@aws-sdk/client-secrets-manager';

export const getDecryptedCredentials = async () => {
    const secret_name = 'TaylorsWeatherWebsiteTestCredentials';

    const client = new SecretsManagerClient({
        region: 'us-east-1',
    });

    let response;

    try {
        response = await client.send(
            new GetSecretValueCommand({
                SecretId: secret_name,
            })
        );
    } catch (error) {
        throw error;
    }

    const secret = response.SecretString;
    const decryptedUsername = secret ? JSON.parse(secret).testEmail : '';
    const decryptedPassword = secret ? JSON.parse(secret).testPassword : '';
    const decryptedUserPoolId = secret ? JSON.parse(secret).userPoolId : '';
    const decryptedClientId = secret ? JSON.parse(secret).clientId : '';

    return {decryptedUsername, decryptedPassword, decryptedUserPoolId, decryptedClientId};
};
