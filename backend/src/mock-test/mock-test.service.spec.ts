import { Test, TestingModule } from '@nestjs/testing';
import { MockTestService } from './mock-test.service';

describe('MockTestService', () => {
  let service: MockTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockTestService],
    }).compile();

    service = module.get<MockTestService>(MockTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
