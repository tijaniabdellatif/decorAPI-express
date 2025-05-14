import { describe, test, expect, beforeEach, mock } from 'bun:test';
import { Container } from '../../src/core/container';
import { debug } from '../../src/core/utils/log-debugger';

const mockDebug = {
  error: mock(() => {
    call: true;
  }),
  log: mock(() => {
    call: true;
  }),
  warn: mock(() => {
    call: true;
  }),
  info: mock(() => {
    call: true;
  }),
};

mock.module('../../src/core/utils/log-debugger.js', () => ({
  debug: mockDebug,
}));

describe('Container', () => {
  let container: Container;

  beforeEach(() => {
    container = Container.getInstance();
    (container as any).services = new Map();

    mockDebug.error.mockClear();
    mockDebug.log.mockClear();
    mockDebug.warn.mockClear();
    mockDebug.info.mockClear();
  });

  test('getInstance returns the singleton instance', () => {
    const instance_1 = Container.getInstance();
    const instance_2 = Container.getInstance();
    expect(instance_1).toBe(instance_2);
  });

  test('registerService registers a service', () => {
    const service = { name: 'test-service' };
    container.register('test-token', service);
    expect((container as any).services.has('test-token')).toBe(true);
    expect((container as any).services.get('test-token')).toBe(service);
  });

  test('Register overwrites existing service with the same token', () => {
    const service_1 = { name: 'test-service-1' };
    const service_2 = { name: 'test-service-2' };
    container.register('test-token', service_1);
    container.register('test-token', service_2);
    expect(container.get('test-token')).toBe(service_2);
  });

  test('get returns the registred service', () => {
    const service = { name: 'test-service' };
    container.register('test-token', service);
    expect(container.get('test-token')).toBe(service);
  });

  test('get returns undefined and logs error when service not found', () => {
    const result = container.get('non-existent-token');
    expect(result).toBeUndefined();
    expect(mockDebug.error).toHaveBeenCalled();

    expect(mockDebug.error).toHaveBeenCalledWith(
      expect.stringContaining('No provider registred for this token'),
      'non-existent-token',
      expect.any(Object)
    );
  });
});
