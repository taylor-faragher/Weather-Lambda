import jwt from 'jsonwebtoken';

export const verifyToken = (token, secretOrPublicKey) => {
    return jwt.verify(token, secretOrPublicKey, {complete: true});
};
