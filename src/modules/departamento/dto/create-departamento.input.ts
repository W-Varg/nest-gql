import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateDepartamentoInput {
  @Field()
  nombre: string;

  @Field({ nullable: true })
  capital?: string;

  @Field(() => Int)
  paisId: number;
}
