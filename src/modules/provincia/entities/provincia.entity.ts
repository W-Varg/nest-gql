import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Provincia {
  @Field(() => Int)
  id: number;

  @Field()
  nombre: string;

  @Field(() => Int)
  departamentoId: number;
}
