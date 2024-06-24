import jwt from 'jsonwebtoken';

export const decodeToken = token => {
    const decodedToken = jwt.decode(token, {complete: true});
    if (!decodedToken || !decodedToken.header || !decodedToken.header.kid) {
        throw new Error('Invlaid Authorization Token');
    }
    return decodedToken;
};
