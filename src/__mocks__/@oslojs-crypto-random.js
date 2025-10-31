// Mock for @oslojs/crypto/random
module.exports = {
  generateRandomString: jest.fn((random, alphabet, length) => {
    return 'a'.repeat(length || 10)
  }),
}
