const { register } = require('.//AuthController');

describe('Register Functionality', () => {
    it('should register a new user successfully', async () => {
        // Mock request and response objects
        const req = {
            body: {
                // Mock user registration data
                username: 'testuser',
                password: 'testpassword',
                email: 'testuser@example.com',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock AuthService.singUp function
        const AuthService = require("../../Service/Auth/AuthService");
        AuthService.singUp = jest.fn().mockResolvedValue({
            username: 'testuser',
            email: 'testuser@example.com',
        });

        // Call the register function
        await register(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Register successfully.',
            data: {
                username: 'testuser',
                email: 'testuser@example.com',
                // Assert any other relevant data returned in 'data'
            },
        });
    });    

});
