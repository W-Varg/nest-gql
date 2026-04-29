import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Departamento } from '../departamento/entities/departamento.entity';
import { ProvinciaService } from '../provincia/provincia.service';
import { Municipio } from './entities/municipio.entity';
import { MunicipioService } from './municipio.service';

@Resolver(() => Departamento)
export class DepartamentoMunicipiosResolver {
  constructor(
    private readonly provinciaService: ProvinciaService,
    private readonly municipioService: MunicipioService,
  ) {}

  @ResolveField('municipios', () => [Municipio], {
    description:
      'Todos los municipios pertenecientes a este departamento (atraviesa provincias internamente).',
  })
  municipios(@Parent() departamento: Departamento): Municipio[] {
    const provincias = this.provinciaService.findByDepartamento(departamento.id);
    const provinciaIds = provincias.map((p) => p.id);
    return this.municipioService.findByProvinciaIds(provinciaIds);
  }
}
