export const getToken = event => {
    const tokenString = event.authorizationToken;
    if (!tokenString) {
        throw new Error('Expected "event.headers.authorization');
    }
    const matchArray = tokenString.match(/^Bearer (.*)$/);

    if (!matchArray) {
        throw new Error('Invalid Authorization token - Needs Bearer *');
    }

    const match = matchArray[1];

    return match;
};
