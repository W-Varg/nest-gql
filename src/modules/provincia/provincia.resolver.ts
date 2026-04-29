import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProvinciaService } from './provincia.service';
import { Provincia } from './entities/provincia.entity';
import { CreateProvinciaInput } from './dto/create-provincia.input';
import { UpdateProvinciaInput } from './dto/update-provincia.input';

@Resolver(() => Provincia)
export class ProvinciaResolver {
  constructor(private readonly provinciaService: ProvinciaService) {}

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
}
