import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ProvinciaService } from './provincia.service';
import { Provincia } from './entities/provincia.entity';
import { CreateProvinciaInput } from './dto/create-provincia.input';
import { UpdateProvinciaInput } from './dto/update-provincia.input';
import { Departamento } from '../departamento/entities/departamento.entity';
import { DepartamentoLoader } from '../departamento/departamento.loader';

@Resolver(() => Provincia)
export class ProvinciaResolver {
  constructor(
    private readonly provinciaService: ProvinciaService,
    private readonly departamentoLoader: DepartamentoLoader,
  ) {}

  @Mutation(() => Provincia)
  createProvincia(@Args('createProvinciaInput') createProvinciaInput: CreateProvinciaInput) {
    return this.provinciaService.create(createProvinciaInput);
  }

  @Query(() => [Provincia], { name: 'provincias' })
  findAll() {
    return this.provinciaService.findAll();
  }

  @Query(() => Provincia, { name: 'provincia' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.provinciaService.findOne(id);
  }

  @Query(() => [Provincia], { name: 'provinciasPorDepartamento' })
  findByDepartamento(@Args('departamentoId', { type: () => Int }) departamentoId: number) {
    return this.provinciaService.findByDepartamento(departamentoId);
  }

  @Mutation(() => Provincia)
  updateProvincia(@Args('updateProvinciaInput') updateProvinciaInput: UpdateProvinciaInput) {
    return this.provinciaService.update(updateProvinciaInput.id, updateProvinciaInput);
  }

  @Mutation(() => Provincia)
  removeProvincia(@Args('id', { type: () => Int }) id: number) {
    return this.provinciaService.remove(id);
  }

  @ResolveField(() => Departamento, {
    description: 'Departamento al que pertenece la provincia — resuelto vía DataLoader (batched).',
  })
  departamento(@Parent() provincia: Provincia) {
    return this.departamentoLoader.byId.load(provincia.departamentoId);
  }
}
