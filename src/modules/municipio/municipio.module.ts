import { Module } from '@nestjs/common';
import { MunicipioService } from './municipio.service';
import { MunicipioResolver } from './municipio.resolver';
import { DepartamentoMunicipiosResolver } from './departamento-municipios.resolver';
import { ProvinciaModule } from '../provincia/provincia.module';

@Module({
  imports: [ProvinciaModule],
  providers: [MunicipioResolver, MunicipioService, DepartamentoMunicipiosResolver],
  exports: [MunicipioService],
})
export class MunicipioModule {}
