import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Pais {
  @Field(() => Int)
  id: number;

  @Field()
  nombre: string;

  @Field({ nullable: true })
  codigoIso?: string;
}
