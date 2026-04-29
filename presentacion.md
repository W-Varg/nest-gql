# API REST vs GraphQL con NestJS

## Conceptos base

### ¿Qué es una API REST?

REST (Representational State Transfer) es un **estilo arquitectónico** sobre HTTP. Sus pilares:

- Los datos se modelan como **recursos** identificados por una URL.
- Las acciones se expresan con los **verbos HTTP**: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- Cada recurso suele tener su propio endpoint: `/paises`, `/paises/1`, `/departamentos`.

### ¿Qué es GraphQL?

GraphQL es un **lenguaje de consulta** y un **runtime** para resolver esas consultas. Sus pilares:

- Un **único endpoint** (`/graphql`) recibe todas las operaciones.
- El **cliente** describe la forma exacta de los datos que necesita.
- El servidor expone un **schema fuertemente tipado** que documenta todo lo que se puede pedir.
- Tres tipos de operaciones: `Query` (leer), `Mutation` (escribir) y `Subscription` (eventos en tiempo real).

### Analogía rápida

> **REST** es un menú -> buffet

---

## Comparación punto por punto

| Tema                         | REST                                                          | GraphQL                                                    |
| ---------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------- |
| **Endpoints**                | Múltiples (`/paises`, `/paises/1`, `/departamentos?paisId=1`) | Uno solo (`/graphql`)                                      |
| **Forma de la respuesta**    | La decide el servidor                                         | La decide el cliente                                       |
| **Sobrefetching**            | Frecuente: llega todo el recurso aunque solo uses 2 campos    | Eliminado: pides solo los campos que usas                  |
| **Subfetching (N+1 de red)** | Varias llamadas para datos relacionados                       | Una sola query anidada                                     |
| **Tipado**                   | Opcional (Swagger/OpenAPI por fuera)                          | Obligatorio, schema fuertemente tipado                     |
| **Documentación**            | Manual (Swagger, Postman)                                     | Auto-generada por introspección                            |
| **Errores**                  | Códigos HTTP (`404`, `500`…)                                  | Siempre `200 OK`, errores en el array `errors` del payload |
| **Subida de archivos**       | Trivial (`multipart/form-data`)                               | Necesita una especificación adicional                      |
| **Curva de aprendizaje**     | Baja                                                          | Media                                                      |

---

## Demostración concreta con este proyecto

El dominio modelado es la división política de Bolivia:

```
País (Bolivia)
 └── Departamento (La Paz, Cochabamba, Santa Cruz, …)
      └── Provincia (Murillo, Cercado, …)
           └── Municipio (La Paz, El Alto, Tiquipaya, …)
```

### Caso: "obtener Bolivia con sus 9 departamentos y todas sus provincias"

#### Con una API REST tradicional necesitarías:

```http
GET /paises/1                        → 1 llamada
GET /paises/1/departamentos          → 1 llamada (devuelve 9 deptos)
GET /departamentos/1/provincias      → 1 llamada
GET /departamentos/2/provincias      → 1 llamada
GET /departamentos/3/provincias      → 1 llamada
... (uno por cada departamento)      → 9 llamadas
```

**multiples peticiones.** Cada uno con su latencia, sus headers, su parsing.

Y aún así, recibirías campos que quizá no necesitas (timestamps, metadatos, etc.).

#### Con GraphQL en este proyecto:

Una sola petición a `/graphql`:

```graphql
query BoliviaCompleta {
  pais(id: 1) {
    nombre
    codigoIso
  }
  departamentosPorPais(paisId: 1) {
    id
    nombre
    capital
  }
  provincias {
    id
    nombre
    departamentoId
  }
}
```

**Total: 1 round-trip.** Solo los campos solicitados. Tipos garantizados por el schema.

---

## ¿Cuándo elegir cada uno?

son herramientas con fortalezas distintas.

### REST conviene cuando…

- La API es **pública** y se beneficia mucho del **caché HTTP / CDN**.
- Las operaciones son CRUD simple **1:1**, sin relaciones complejas.
- Falta de experiencia previa con GraphQL.
- Hay que **servir archivos binarios** o streaming.

### GraphQL conviene cuando…

- Hay **múltiples clientes** (web, móvil, otros servicios) con necesidades de datos distintas.
- El modelo es **relacional y profundo** — exactamente este caso: País → Depto → Provincia → Municipio.
- Quieres evitar el _endpoint hell_ y el versionado a la URL.
- Construyes un **BFF** (Backend For Frontend) que agrega varias fuentes.

---

## Cómo NestJS soporta ambos paradigmas

NestJS es **agnóstico al paradigma**: la inyección de dependencias, los módulos, los `Pipes` y `Guards` funcionan igual en REST y en GraphQL.

### Code-first vs Schema-first

Este proyecto usa el enfoque **code-first** (configurado en [src/app.module.ts](src/app.module.ts)):

```ts
GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: true,   // ← el schema se genera desde las clases TS
  sortSchema: true,
}),
```

Decoramos las clases TypeScript y NestJS genera el schema automáticamente. Por ejemplo, [src/modules/pais/entities/pais.entity.ts](src/modules/pais/entities/pais.entity.ts):

```ts
@ObjectType()
export class Pais {
  @Field(() => Int)
  id: number;

  @Field()
  nombre: string;

  @Field({ nullable: true })
  codigoIso?: string;
}
```

…produce este fragmento de schema GraphQL:

```graphql
type Pais {
  id: Int!
  nombre: String!
  codigoIso: String
}
```

### Resolver vs Controller

Lado a lado, la diferencia conceptual es mínima:

**REST (Controller hipotético):**

```ts
@Controller('paises')
export class PaisController {
  constructor(private readonly paisService: PaisService) {}

  @Get()
  findAll() {
    return this.paisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.paisService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePaisInput) {
    return this.paisService.create(dto);
  }
}
```

**GraphQL (Resolver real, [src/modules/pais/pais.resolver.ts](src/modules/pais/pais.resolver.ts)):**

```ts
@Resolver(() => Pais)
export class PaisResolver {
  constructor(private readonly paisService: PaisService) {}

  @Query(() => [Pais], { name: 'paises' })
  findAll() {
    return this.paisService.findAll();
  }

  @Query(() => Pais, { name: 'pais' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.paisService.findOne(id);
  }

  @Mutation(() => Pais)
  createPais(@Args('createPaisInput') input: CreatePaisInput) {
    return this.paisService.create(input);
  }
}
```

> **El service es exactamente el mismo en ambos casos.** Solo cambia la capa de transporte.

---

## El Playground de GraphQL

el swagger de GraphQL, con lo que se puede en modo (DEV):

- Explorar el schema (introspección automática).
- Autocompletar campos al escribir queries.
- Ver la documentación generada de cada tipo y operación.
- Ejecutar queries y mutations en vivo.

---

## Ejemplos de Queries y Mutations

- Queries básicas (sección 1) → ver [examples.md 1](examples.md#1-queries-básicas)
- Queries por relación padre (sección 2) → ver [examples.md 2](examples.md#2-queries-por-relación-filtrado-por-padre)
- Queries anidadas multinivel (sección 3) → ver [examples.md 3](examples.md#3-queries-anidadas--el-superpoder-de-graphql)
- Mutations create/update/delete (sección 5) → ver [examples.md 5](examples.md#5-mutations--crear-actualizar-eliminar)
- Fragments, variables, multi-operación, introspección (secciones 6–9) → ver [examples.md](examples.md)

Vista rápida de una query anidada (lo que **REST no puede hacer en una sola llamada**):

```graphql
query MunicipiosJerarquiaCompleta {
  municipios {
    nombre
    provincia {
      nombre
      departamento {
        nombre
        pais {
          nombre
        }
      }
    }
  }
}
```

---

## El problema N+1 y su solución con DataLoader

### ¿Qué es el problema N+1?

Cuando exponemos relaciones con `@ResolveField`, el resolver se ejecuta **una vez por cada item del array padre**. Sin precaución, esto genera una llamada al backend por cada item:

```
1 query  → traer N departamentos
N queries → traer el país de cada departamento (¡uno a la vez!)
─────────
Total: N + 1 llamadas
```

Con 9 departamentos son 10 llamadas. Con 1.000 son 1.001. Es **el problema de rendimiento más conocido de GraphQL**.

### La solución: DataLoader

[DataLoader](https://github.com/graphql/dataloader)  hace dos cosas:

1. **Batching**: agrupa todas las llamadas a `load(id)` que ocurren dentro del mismo _tick_ del event loop en una sola llamada `batchFn(ids[])`.
2. **Caching por petición**: si el mismo `id` se pide varias veces dentro de la misma request, solo se busca una vez.

El loader se crea **fresco por cada petición HTTP** (request-scoped) — así no hay leaks de caché entre usuarios distintos.

### Cómo se ve en este proyecto

**1) Cada servicio expone un `findByIds` que resuelve N en una sola pasada:**

```ts
// src/modules/pais/pais.service.ts
findByIds(ids: readonly number[]): Pais[] {
  this.logger.log(`findByIds([${ids.join(',')}])`);
  const set = new Set(ids);
  return this.items.filter((p) => set.has(p.id));
}
```

**2) Un loader request-scoped envuelve ese método en DataLoader:**

```ts
// src/modules/pais/pais.loader.ts
@Injectable({ scope: Scope.REQUEST })
export class PaisLoader {
  constructor(private readonly paisService: PaisService) {}

  readonly byId = new DataLoader<number, Pais>(async (ids) => {
    const items = this.paisService.findByIds(ids as number[]);
    const map = new Map(items.map((p) => [p.id, p]));
    return ids.map((id) => map.get(id) ?? new Error(`Pais #${id} no encontrado`));
  });
}
```

**3) El `@ResolveField` lo usa transparentemente:**

```ts
// src/modules/departamento/departamento.resolver.ts
@ResolveField(() => Pais)
pais(@Parent() departamento: Departamento) {
  return this.paisLoader.byId.load(departamento.paisId);
}
```

### Demostración medible

Las queries de la sección **4 de [examples.md](examples.md#4-demostración-del-problema-n1-y-su-solución-dataloader)** vienen con logs esperados. Resumen:

| Escenario                                    | Sin DataLoader | Con DataLoader                                       |
| -------------------------------------------- | -------------- | ---------------------------------------------------- |
| 9 departamentos + su país (todos `paisId=1`) | 10 llamadas    | **2** (1 deptos + 1 país dedup-licado)               |
| 10 provincias + depto + país                 | 21 llamadas    | **3** (1 provincias + 1 deptos batch + 1 país batch) |
| 1.000 municipios + jerarquía completa        | 4.001 llamadas | **4** (uno por nivel, sin importar N)                |


### Por qué DataLoader es la respuesta canónica

- Es **opt-in**: solo lo usan los `@ResolveField` que lo necesitan.
- Es **agnóstico al storage**: el `findByIds` puede ser un `IN (...)` SQL, un `findMany` de Prisma, una llamada gRPC a otro microservicio, etc.
- Tiene **caché por petición**: queries que mencionan el mismo `id` varias veces se resuelven una sola.

---

## Conceptos avanzados que impresionan

- **Fragments**: trozos reutilizables de selección de campos. Ver [examples.md 6](examples.md#6-fragments--selecciones-reutilizables).
- **Variables**: queries parametrizadas, separadas de los datos. Ver [examples.md 7](examples.md#7-variables--queries-parametrizadas).
- **Múltiples operaciones por request**: ver [examples.md 8](examples.md#8-multiples-operaciones-en-una-sola-petición).
- **DataLoader**: ver sección 8 — la solución estándar al problema N+1 dentro de los resolvers (batching + caching por petición).
- **Límite de Profundidad (Query Depth Limit)**: Una medida de seguridad esencial para prevenir consultas excesivamente anidadas que puedan sobrecargar el servidor. El `depthLimitPlugin` que has implementado en `app.module.ts` calcula la "profundidad" de una consulta entrante y la rechaza si excede un umbral predefinido (por ejemplo, 3 niveles). Esto protege tu API contra ataques de denegación de servicio (DoS) y consultas ineficientes.

---

## Conclusión

REST y GraphQL son herramientas con características distintas.

Para el dominio que modelamos en este proyecto — una **jerarquía profunda** de entidades relacionadas (País → Departamento → Provincia → Municipio) — **GraphQL nos da tres ganancias claras**:

1. **Una sola llamada** en lugar de N: el cliente compone la consulta que necesita.
2. **Tipado fuerte gratis**: el schema documenta y valida todo automáticamente.
3. **Evolución sin versionado**: agregamos campos sin romper clientes existentes.

Para tareas como **servir un PDF estático**, **integrarse con un webhook de pago** o **publicar una API consumida por CDN**, REST sigue siendo la elección natural.

> **La pregunta no es "REST o GraphQL", sino "¿qué problema estoy resolviendo?".**
