import { Module } from '@nestjs/common';
import { ProvinciaService } from './provincia.service';
import { ProvinciaResolver } from './provincia.resolver';
import { ProvinciaLoader } from './provincia.loader';
import { DepartamentoModule } from '../departamento/departamento.module';

@Module({
  imports: [DepartamentoModule],
  providers: [ProvinciaResolver, ProvinciaService, ProvinciaLoader],
  exports: [ProvinciaService, ProvinciaLoader],
})
export class ProvinciaModule {}
