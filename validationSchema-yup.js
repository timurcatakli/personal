import schema from './validationSchema';

describe('ValidationSchema should', () => {
  test('Require pem', async () => {
    await expect(schema.validateAt('pem', { pem: '' })).rejects.toThrow();
    await expect(schema.validateAt('pem', { pem: 'Fooooo' })).resolves.toBeTruthy();
  });
});
