import { Test, TestingModule } from '@nestjs/testing';
import { DepartamentoResolver } from './departamento.resolver';
import { DepartamentoService } from './departamento.service';

describe('DepartamentoResolver', () => {
  let resolver: DepartamentoResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepartamentoResolver, DepartamentoService],
    }).compile();

    resolver = module.get<DepartamentoResolver>(DepartamentoResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
