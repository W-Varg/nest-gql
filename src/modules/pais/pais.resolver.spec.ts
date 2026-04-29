import { Test, TestingModule } from '@nestjs/testing';
import { PaisResolver } from './pais.resolver';
import { PaisService } from './pais.service';

describe('PaisResolver', () => {
  let resolver: PaisResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaisResolver, PaisService],
    }).compile();

    resolver = module.get<PaisResolver>(PaisResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
