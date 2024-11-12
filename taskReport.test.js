// taskReport.test.js
const reportService = require('../services/reportService');
describe('Task Report Generation Test Suite', () => {
  test('Geração de relatório de tarefa existente', async () => {
    const taskId = 1; // ID de uma tarefa existente
    const result = await reportService.generateTaskReport(taskId);
    expect(result.success).toBe(true);
    expect(result.report).toHaveProperty('taskId');
    expect(result.report.taskId).toBe(taskId);
    expect(result.report).toHaveProperty('status');
  });
  test('Geração de relatório de tarefa inexistente', async () => {
    const taskId = 999; // ID de uma tarefa inexistente

    const result = await reportService.generateTaskReport(taskId);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Tarefa não encontrada');
  });
});
