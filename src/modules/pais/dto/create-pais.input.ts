import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePaisInput {
  @Field()
  nombre: string;

  @Field({ nullable: true })
  codigoIso?: string;
}
