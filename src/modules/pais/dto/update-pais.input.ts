import { CreatePaisInput } from './create-pais.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePaisInput extends PartialType(CreatePaisInput) {
  @Field(() => Int)
  id: number;
}
