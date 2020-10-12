import { VerifyTokenMiddleware } from './verify-token.middleware';

describe('VerifyTokenMiddleware', () => {
  it('should be defined', () => {
    expect(new VerifyTokenMiddleware()).toBeDefined();
  });
});
