import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Municipio {
  @Field(() => Int)
  id: number;

  @Field()
  nombre: string;

  @Field(() => Int)
  provinciaId: number;
}
