import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MunicipioService } from './municipio.service';
import { Municipio } from './entities/municipio.entity';
import { CreateMunicipioInput } from './dto/create-municipio.input';
import { UpdateMunicipioInput } from './dto/update-municipio.input';

@Resolver(() => Municipio)
export class MunicipioResolver {
  constructor(private readonly municipioService: MunicipioService) {}

  @Mutation(() => Municipio)
  createMunicipio(@Args('createMunicipioInput') createMunicipioInput: CreateMunicipioInput) {
    return this.municipioService.create(createMunicipioInput);
  }

  @Query(() => [Municipio], { name: 'municipios' })
  findAll() {
    return this.municipioService.findAll();
  }

  @Query(() => Municipio, { name: 'municipio' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.municipioService.findOne(id);
  }

  @Query(() => [Municipio], { name: 'municipiosPorProvincia' })
  findByProvincia(@Args('provinciaId', { type: () => Int }) provinciaId: number) {
    return this.municipioService.findByProvincia(provinciaId);
  }

  @Mutation(() => Municipio)
  updateMunicipio(@Args('updateMunicipioInput') updateMunicipioInput: UpdateMunicipioInput) {
    return this.municipioService.update(updateMunicipioInput.id, updateMunicipioInput);
  }

  @Mutation(() => Municipio)
  removeMunicipio(@Args('id', { type: () => Int }) id: number) {
    return this.municipioService.remove(id);
  }
}
