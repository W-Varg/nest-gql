import { CreateDepartamentoInput } from './create-departamento.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDepartamentoInput extends PartialType(CreateDepartamentoInput) {
  @Field(() => Int)
  id: number;
}
