import { Module } from '@nestjs/common';
import { DepartamentoService } from './departamento.service';
import { DepartamentoResolver } from './departamento.resolver';
import { DepartamentoLoader } from './departamento.loader';
import { PaisDepartamentosResolver } from './pais-departamentos.resolver';
import { PaisModule } from '../pais/pais.module';

@Module({
  imports: [PaisModule],
  providers: [
    DepartamentoResolver,
    DepartamentoService,
    DepartamentoLoader,
    PaisDepartamentosResolver,
  ],
  exports: [DepartamentoService, DepartamentoLoader],
})
export class DepartamentoModule {}
