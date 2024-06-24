import {JwksClient} from 'jwks-rsa';

export const authorizerClient = new JwksClient({
    cache: true,
    jwksUri: process.env.JWKS_URI,
});
