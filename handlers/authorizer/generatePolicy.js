export const generatePolicy = (effect, resource) => ({
    Statement: [
        {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource,
        },
    ],
    Version: '2012-10-17',
});
