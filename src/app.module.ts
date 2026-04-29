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
import { GraphQLError } from 'graphql';
import { join } from 'node:path';

const depthLimitPlugin = (maxDepth: number) => ({
  async requestDidStart() {
    return {
      async didResolveOperation({ request, document }) {
        const depths = {};
        const AST = document;

        function determineDepth(node: any, currentDepth = 0, maxDepthReached = 0): number {
          if (node.selectionSet) {
            currentDepth++;
            maxDepthReached = Math.max(maxDepthReached, currentDepth);

            for (const selection of node.selectionSet.selections) {
              maxDepthReached = Math.max(
                maxDepthReached,
                determineDepth(selection, currentDepth, maxDepthReached),
              );
            }
          }

          return maxDepthReached;
        }

        AST.definitions.forEach((definition: any) => {
          if (definition.operation) {
            const depth = determineDepth(definition);
            if (depth > maxDepth) {
              throw new GraphQLError(
                `Query excede el límite de profundidad permitido (${maxDepth}). Profundidad actual: ${depth}`,
                { extensions: { code: 'DEPTH_LIMIT_EXCEEDED' } },
              );
            }
          }
        });
      },
    };
  },
});

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      introspection: true,
      sortSchema: true,
      playground: false,
      plugins: [/**depthLimitPlugin(4), */ ApolloServerPluginLandingPageLocalDefault()],
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
