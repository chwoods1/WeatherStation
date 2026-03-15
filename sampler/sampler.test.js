const test = require('node:test');

const validReading = { voltage: 2.5, timestamp: 1741234567.123 };
const badVoltage = { voltage: 99, timestamp: 1741234567.123 };
const badTimestamp = { voltage: 2.5, timestamp: 12345 };
const missingVoltage = { timestamp: 1741234567.123 };


test('accepts valid reading', () =>
    expect(isValidReading(validReading)).toBe(true));

test('returns false for invalid voltage', () =>
    expect(isValidReading(badVoltage)).toBe(false));

test('returns false for bad timestamp', () =>
    expect(isValidReading(badTimestamp)).toBe(false));

test('returns false for missing voltage', () =>
    expect(isValidReading(missingVoltage)).toBe(false));