const InvalidRequestError = require('./InvalidRequestError');

describe('InvalidRequestError', () => {
    it('should create an instance of InvalidRequestError with default message', () => {
        const error = new InvalidRequestError();

        expect(error).toBeInstanceOf(InvalidRequestError);
        expect(error.name).toBe('Invalid Request');
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('Invalid request');
    });

    it('should create an instance of InvalidRequestError with custom message', () => {
        const customMessage = 'Custom invalid request message';
        const error = new InvalidRequestError(customMessage);

        expect(error).toBeInstanceOf(InvalidRequestError);
        expect(error.name).toBe('Invalid Request');
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe(customMessage);
    });

    it('should properly set the prototype chain', () => {
        const error = new InvalidRequestError();
        
        expect(error instanceof InvalidRequestError).toBe(true);
        expect(error instanceof Error).toBe(true);
        expect(Object.getPrototypeOf(error)).toBe(InvalidRequestError.prototype);
    });

    it('should handle the second error parameter correctly', () => {
        const innerError = new Error('Inner error');
        const error = new InvalidRequestError('Custom message', innerError);

        expect(error).toBeInstanceOf(InvalidRequestError);
        expect(error.name).toBe('Invalid Request');
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('Custom message');
        expect(error.error).toBe(innerError);
    });
});
