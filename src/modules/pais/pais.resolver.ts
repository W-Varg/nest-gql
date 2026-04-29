import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PaisService } from './pais.service';
import { Pais } from './entities/pais.entity';
import { CreatePaisInput } from './dto/create-pais.input';
import { UpdatePaisInput } from './dto/update-pais.input';

@Resolver(() => Pais)
export class PaisResolver {
  constructor(private readonly paisService: PaisService) {}

  @Mutation(() => Pais)
  createPais(@Args('createPaisInput') createPaisInput: CreatePaisInput) {
    return this.paisService.create(createPaisInput);
  }

  @Query(() => [Pais], { name: 'paises' })
  findAll() {
    return this.paisService.findAll();
  }

  @Query(() => Pais, { name: 'pais' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.paisService.findOne(id);
  }

  @Mutation(() => Pais)
  updatePais(@Args('updatePaisInput') updatePaisInput: UpdatePaisInput) {
    return this.paisService.update(updatePaisInput.id, updatePaisInput);
  }

  @Mutation(() => Pais)
  removePais(@Args('id', { type: () => Int }) id: number) {
    return this.paisService.remove(id);
  }
}
