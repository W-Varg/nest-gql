import { CreateMunicipioInput } from './create-municipio.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMunicipioInput extends PartialType(CreateMunicipioInput) {
  @Field(() => Int)
  id: number;
}
