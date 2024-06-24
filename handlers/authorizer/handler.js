import {authorizerClient} from './authorizerClient';
import {getToken} from './getToken';
import {decodeToken} from './decodeToken';
import {verifyToken} from './verifyToken';
import {generatePolicy} from './generatePolicy';

export const authorizer = async event => {
    try {
        const token = getToken(event);
        const decodedToken = decodeToken(token);
        const key = await authorizerClient.getSigningKey(decodedToken.header.kid);
        try {
            const verifiedToken = verifyToken(token, key.rsaPublicKey);
            return {
                policyDocument: generatePolicy('Allow', '*'),
                principalId: verifiedToken.payload.sub,
            };
        } catch (err) {
            return {
                policyDocument: generatePolicy('Deny', '*'),
                principalId: decodedToken.payload.sub,
            };
        }
    } catch (err) {
        throw new Error(`Unauthorized`);
    }
};
