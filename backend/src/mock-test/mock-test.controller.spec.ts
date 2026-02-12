import { Test, TestingModule } from '@nestjs/testing';
import { MockTestController } from './mock-test.controller';

describe('MockTestController', () => {
  let controller: MockTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MockTestController],
    }).compile();

    controller = module.get<MockTestController>(MockTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
