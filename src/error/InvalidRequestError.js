const HttpError = require('./HttpError');

class InvalidRequestError extends HttpError {
    constructor(message, error) {
        super(message || 'Invalid request', error);

        Object.setPrototypeOf(this, InvalidRequestError.prototype);

        this.name = 'Invalid Request';
        this.statusCode = 400;
    }
}

module.exports = InvalidRequestError;
