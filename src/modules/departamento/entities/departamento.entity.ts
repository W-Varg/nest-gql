import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Departamento {
  @Field(() => Int)
  id: number;

  @Field()
  nombre: string;

  @Field({ nullable: true })
  capital?: string;

  @Field(() => Int)
  paisId: number;
}
