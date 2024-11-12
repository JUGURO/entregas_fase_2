// user.test.js
const userService = require('../services/userService');
describe('User Registration Test Suite', () => {
  test('Registro de usuário com dados válidos', async () => {
    const newUser = {
      name: 'João Silva',
      email: 'joao.silva@example.com',
      password: 'senhaSegura123'
    };
    const result = await userService.registerUser(newUser);
    expect(result.success).toBe(true);
    expect(result.user).toHaveProperty('id');
    expect(result.user.email).toBe(newUser.email);
  });
  test('Registro de usuário sem e-mail', async () => {
    const newUser = {
      name: 'Maria Souza',
      password: 'senhaSegura123'
    };
    const result = await userService.registerUser(newUser);
    expect(result.success).toBe(false);
    expect(result.error).toBe('O e-mail é obrigatório');
  });
});
