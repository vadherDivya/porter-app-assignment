class HttpError extends Error {
    constructor(message, error) {
        super(message || 'Something went wrong');

        Object.setPrototypeOf(this, HttpError.prototype);

        this.name = 'Internal Server Error';
        this.statusCode = 500;
        this.error = error;
    }

    getObject() {
        return {
            statusCode: this.statusCode,
            name: this.name,
            message: this.message,
            error: this.error,
        };
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            name: this.name,
            message: this.message,
            error: this.error,
        };
    }
}

module.exports = HttpError;
