import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Pais } from '../pais/entities/pais.entity';
import { Departamento } from './entities/departamento.entity';
import { DepartamentoService } from './departamento.service';

@Resolver(() => Pais)
export class PaisDepartamentosResolver {
  constructor(private readonly departamentoService: DepartamentoService) {}

  @ResolveField('departamentos', () => [Departamento], {
    description: 'Departamentos pertenecientes a este país (relación 1:N).',
  })
  departamentos(@Parent() pais: Pais): Departamento[] {
    return this.departamentoService.findByPais(pais.id);
  }
}
