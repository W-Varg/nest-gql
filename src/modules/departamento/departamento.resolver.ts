import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DepartamentoService } from './departamento.service';
import { Departamento } from './entities/departamento.entity';
import { CreateDepartamentoInput } from './dto/create-departamento.input';
import { UpdateDepartamentoInput } from './dto/update-departamento.input';

@Resolver(() => Departamento)
export class DepartamentoResolver {
  constructor(private readonly departamentoService: DepartamentoService) {}

  @Mutation(() => Departamento)
  createDepartamento(
    @Args('createDepartamentoInput') createDepartamentoInput: CreateDepartamentoInput,
  ) {
    return this.departamentoService.create(createDepartamentoInput);
  }

  @Query(() => [Departamento], { name: 'departamentos' })
  findAll() {
    return this.departamentoService.findAll();
  }

  @Query(() => Departamento, { name: 'departamento' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.departamentoService.findOne(id);
  }

  @Query(() => [Departamento], { name: 'departamentosPorPais' })
  findByPais(@Args('paisId', { type: () => Int }) paisId: number) {
    return this.departamentoService.findByPais(paisId);
  }

  @Mutation(() => Departamento)
  updateDepartamento(
    @Args('updateDepartamentoInput') updateDepartamentoInput: UpdateDepartamentoInput,
  ) {
    return this.departamentoService.update(updateDepartamentoInput.id, updateDepartamentoInput);
  }

  @Mutation(() => Departamento)
  removeDepartamento(@Args('id', { type: () => Int }) id: number) {
    return this.departamentoService.remove(id);
  }
}
