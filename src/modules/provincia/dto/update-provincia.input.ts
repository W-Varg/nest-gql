import { CreateProvinciaInput } from './create-provincia.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProvinciaInput extends PartialType(CreateProvinciaInput) {
  @Field(() => Int)
  id: number;
}
