const bcrypt = require('bcrypt');
const { getHasedPassword, comparedHased } = require('./utils'); // Adjust the path as needed

describe('Utils', () => {
  const password = 'mySecretPassword';
  const saltRounds = 10;
  
  describe('getHasedPassword', () => {
    it('should return a hashed password', () => {
      const hashedPassword = getHasedPassword(password, saltRounds);
      
      // Check if the hashed password is not the same as the original password
      expect(hashedPassword).not.toBe(password);
      
      // Check if the hashed password is a string
      expect(typeof hashedPassword).toBe('string');
      
      // Check if the hashed password can be compared successfully
      const isMatch = bcrypt.compareSync(password, hashedPassword);
      expect(isMatch).toBe(true);
    });
  });

  describe('comparedHased', () => {
    it('should return true for a correct password comparison', async () => {
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
      const isMatch = await comparedHased(password, hashedPassword);
      expect(isMatch).toBe(true);
    });

    it('should return false for an incorrect password comparison', async () => {
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
      const isMatch = await comparedHased('wrongPassword', hashedPassword);
      expect(isMatch).toBe(false);
    });
  });
});
