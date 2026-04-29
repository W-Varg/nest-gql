import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateProvinciaInput {
  @Field()
  nombre: string;

  @Field(() => Int)
  departamentoId: number;
}
