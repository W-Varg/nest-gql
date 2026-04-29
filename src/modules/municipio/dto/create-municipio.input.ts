import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMunicipioInput {
  @Field()
  nombre: string;

  @Field(() => Int)
  provinciaId: number;
}
