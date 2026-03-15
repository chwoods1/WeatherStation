const { isValid } = require('./sampler');

const validReading = { voltage: 2.5123, timestamp: 1234567890 };

test('returns ok status for valid reading', () => {
  const result = processSample(validReading);
  expect(result.status).toBe('ok');
});