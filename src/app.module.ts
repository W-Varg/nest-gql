import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DepartamentoModule } from './modules/departamento/departamento.module';
import { MunicipioModule } from './modules/municipio/municipio.module';
import { PaisModule } from './modules/pais/pais.module';
import { ProvinciaModule } from './modules/provincia/provincia.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    PaisModule,
    DepartamentoModule,
    ProvinciaModule,
    MunicipioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
