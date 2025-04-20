const logger = {
    debug: (message, data) => {
        console.debug(
            JSON.stringify({
                level: 'DEBUG',
                message,
                data,
                timestamp: new Date().toISOString(),
            })
        );
    },

    info: (message, data) => {
        console.info(
            JSON.stringify({
                level: 'INFO',
                message,
                data,
                timestamp: new Date().toISOString(),
            })
        );
    },

    warn: (message, data) => {
        console.warn(
            JSON.stringify({
                level: 'WARN',
                message,
                data,
                timestamp: new Date().toISOString(),
            })
        );
    },

    error: (message, error, additionalData = {}) => {
        console.error(
            JSON.stringify({
                level: 'ERROR',
                message,
                errorName: error.name,
                errorMessage: error.message,
                stackTrace: error.stack,
                additionalData,
                timestamp: new Date().toISOString(),
            })
        );
    },
};

export default logger;
