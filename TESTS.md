# Tests

## Running the tests

```bash
npm test
```

## Test file

`__tests__/auditEngine.test.ts`

## Test coverage

| Test | What it covers |
|------|---------------|
| Cursor Business with 2 seats should recommend downgrade to Pro | Detects over-provisioned plan for small team |
| Cursor Pro with 1 seat at correct price should be optimal | Confirms correctly priced plans are not flagged |
| Claude Max for coding use case should recommend downgrade to Pro | Detects use-case mismatch — Max plan for non-research use |
| GitHub Copilot Business with 1 seat should recommend Individual | Detects single-user overpaying for team plan |
| Gemini Ultra should flag high savings | Detects extreme overspend on premium tier |
| Total monthly saving is sum of all tool savings | Validates aggregation logic across multiple tools |
| Annual saving is exactly 12x monthly saving | Validates annual saving calculation |

## Notes

All 7 tests cover the audit engine specifically as required. The audit engine is pure TypeScript with no external dependencies, making tests fast and deterministic. Tests run in under 1 second.