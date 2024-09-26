const HttpError = require('./HttpError');

describe('HttpError', () => {
    it('should create an instance of HttpError with default message and properties', () => {
        const errorInstance = new HttpError();

        expect(errorInstance).toBeInstanceOf(HttpError);
        expect(errorInstance.message).toBe('Something went wrong');
        expect(errorInstance.name).toBe('Internal Server Error');
        expect(errorInstance.statusCode).toBe(500);
        expect(errorInstance.error).toBeUndefined();
    });

    it('should create an instance of HttpError with custom message and error', () => {
        const customMessage = 'Custom error message';
        const customError = new Error('Custom error');
        const errorInstance = new HttpError(customMessage, customError);

        expect(errorInstance).toBeInstanceOf(HttpError);
        expect(errorInstance.message).toBe(customMessage);
        expect(errorInstance.name).toBe('Internal Server Error');
        expect(errorInstance.statusCode).toBe(500);
        expect(errorInstance.error).toBe(customError);
    });

    it('should return the correct object from getObject method', () => {
        const customMessage = 'Custom error message';
        const customError = new Error('Custom error');
        const errorInstance = new HttpError(customMessage, customError);

        const expectedObject = {
            statusCode: 500,
            name: 'Internal Server Error',
            message: customMessage,
            error: customError,
        };

        expect(errorInstance.getObject()).toEqual(expectedObject);
    });

    it('should return the correct JSON from toJSON method', () => {
        const customMessage = 'Custom error message';
        const customError = new Error('Custom error');
        const errorInstance = new HttpError(customMessage, customError);

        const expectedJSON = {
            statusCode: 500,
            name: 'Internal Server Error',
            message: customMessage,
            error: customError,
        };

        expect(errorInstance.toJSON()).toEqual(expectedJSON);
    });
});
