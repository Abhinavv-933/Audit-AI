import { runAudit } from '@/lib/auditEngine';

describe('Audit Engine', () => {

  test('Cursor Business with 2 seats should recommend downgrade to Pro', () => {
    const result = runAudit(
      [{ toolId: 'cursor', plan: 'business', monthlySpend: '80', seats: '2' }],
      '2',
      'coding'
    );
    expect(result.results[0].priority).toBe('high');
    expect(result.results[0].potentialSaving).toBeGreaterThan(0);
  });

  test('Cursor Pro with 1 seat at correct price should be optimal', () => {
    const result = runAudit(
      [{ toolId: 'cursor', plan: 'pro', monthlySpend: '20', seats: '1' }],
      '1',
      'coding'
    );
    expect(result.results[0].priority).toBe('optimal');
    expect(result.results[0].potentialSaving).toBe(0);
  });

  test('Claude Max for coding use case should recommend downgrade to Pro', () => {
    const result = runAudit(
      [{ toolId: 'claude', plan: 'max', monthlySpend: '100', seats: '1' }],
      '1',
      'coding'
    );
    expect(result.results[0].priority).toBe('high');
    expect(result.results[0].potentialSaving).toBe(80);
  });

  test('GitHub Copilot Business with 1 seat should recommend Individual', () => {
    const result = runAudit(
      [{ toolId: 'github_copilot', plan: 'business', monthlySpend: '19', seats: '1' }],
      '1',
      'coding'
    );
    expect(result.results[0].priority).toBe('medium');
    expect(result.results[0].potentialSaving).toBe(9);
  });

  test('Gemini Ultra should flag high savings', () => {
    const result = runAudit(
      [{ toolId: 'gemini', plan: 'ultra', monthlySpend: '249', seats: '1' }],
      '1',
      'writing'
    );
    expect(result.results[0].priority).toBe('high');
    expect(result.results[0].potentialSaving).toBeGreaterThan(200);
  });

  test('Total monthly saving is sum of all tool savings', () => {
    const result = runAudit(
      [
        { toolId: 'gemini', plan: 'ultra', monthlySpend: '249', seats: '1' },
        { toolId: 'claude', plan: 'max', monthlySpend: '100', seats: '1' },
      ],
      '2',
      'writing'
    );
    const expectedTotal = result.results.reduce((sum, r) => sum + r.potentialSaving, 0);
    expect(result.totalMonthlySaving).toBe(expectedTotal);
  });

  test('Annual saving is exactly 12x monthly saving', () => {
    const result = runAudit(
      [{ toolId: 'gemini', plan: 'ultra', monthlySpend: '249', seats: '1' }],
      '1',
      'writing'
    );
    expect(result.totalAnnualSaving).toBe(result.totalMonthlySaving * 12);
  });

});