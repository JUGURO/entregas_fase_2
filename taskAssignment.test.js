// taskAssignment.test.js
const taskService = require('../services/taskService');
describe('Task Assignment Test Suite', () => {
  test('Atribuição de tarefa a membro do grupo com dados válidos', async () => {
    const taskId = 1;  // ID da tarefa existente
    const memberId = 2; // ID do membro do grupo

    const result = await taskService.assignTaskToMember(taskId, memberId);
    expect(result.success).toBe(true);
    expect(result.task).toHaveProperty('assignedTo');
    expect(result.task.assignedTo).toBe(memberId);
  });
  test('Atribuição de tarefa a membro do grupo inexistente', async () => {
    const taskId = 1;
    const memberId = 999; // ID do membro inexistente
    const result = await taskService.assignTaskToMember(taskId, memberId);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Membro do grupo não encontrado');
  });
