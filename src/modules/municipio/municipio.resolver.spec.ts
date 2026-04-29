import { Test, TestingModule } from '@nestjs/testing';
import { MunicipioResolver } from './municipio.resolver';
import { MunicipioService } from './municipio.service';

describe('MunicipioResolver', () => {
  let resolver: MunicipioResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MunicipioResolver, MunicipioService],
    }).compile();

    resolver = module.get<MunicipioResolver>(MunicipioResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
