import { Module } from '@nestjs/common';
import { MunicipioService } from './municipio.service';
import { MunicipioResolver } from './municipio.resolver';

@Module({
  providers: [MunicipioResolver, MunicipioService],
  exports: [MunicipioService],
})
export class MunicipioModule {}
