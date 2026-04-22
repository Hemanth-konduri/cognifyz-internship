const morgan = require('morgan');

// Custom token for request body
morgan.token('body', (req) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        return JSON.stringify(req.body);
    }
    return '-';
});

// Custom format
const logFormat = ':method :url :status :response-time ms - :res[content-length] bytes | Body: :body';

module.exports = morgan(logFormat);