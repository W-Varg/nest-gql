# Ejemplos GraphQL — listos para ejecutar

> Cómo usar este archivo:
> 1. Inicia el servidor con `yarn start:dev`.
> 2. Abre el playground en [http://localhost:3000/graphql](http://localhost:3000/graphql).
> 3. Copia y pega cualquier bloque en el editor del playground y ejecútalo (`Ctrl+Enter` o botón ▶).
>
> **Tip didáctico:** abre la consola donde corre `yarn start:dev` mientras ejecutas las queries de la sección de N+1 — verás los logs `[PaisLoader] batch byId ids=[…]` que demuestran el batching.

---

## Índice

1. [Queries básicas](#1-queries-básicas)
2. [Queries por relación (filtrado por padre)](#2-queries-por-relación-filtrado-por-padre)
3. [Queries anidadas — el superpoder de GraphQL](#3-queries-anidadas--el-superpoder-de-graphql)
4. [Demostración del problema N+1 y su solución (DataLoader)](#4-demostración-del-problema-n1-y-su-solución-dataloader)
5. [Mutations — crear, actualizar, eliminar](#5-mutations--crear-actualizar-eliminar)
6. [Fragments — selecciones reutilizables](#6-fragments--selecciones-reutilizables)
7. [Variables — queries parametrizadas](#7-variables--queries-parametrizadas)
8. [Multiples operaciones en una sola petición](#8-multiples-operaciones-en-una-sola-petición)
9. [Introspección del schema](#9-introspección-del-schema)

---

## 1. Queries básicas

### 1.1 Listar todos los países

```graphql
query GetPaises {
  paises {
    id
    nombre
    codigoIso
  }
}
```

### 1.2 Obtener un país por ID

```graphql
query GetPaisById {
  pais(id: 1) {
    id
    nombre
    codigoIso
  }
}
```

### 1.3 Listar todos los departamentos

```graphql
query GetDepartamentos {
  departamentos {
    id
    nombre
    capital
    paisId
  }
}
```

### 1.4 Listar todas las provincias

```graphql
query GetProvincias {
  provincias {
    id
    nombre
    departamentoId
  }
}
```

### 1.5 Listar todos los municipios

```graphql
query GetMunicipios {
  municipios {
    id
    nombre
    provinciaId
  }
}
```

---

## 2. Queries por relación (filtrado por padre)

### 2.1 Departamentos de un país

```graphql
query DeptosDeBolivia {
  departamentosPorPais(paisId: 1) {
    id
    nombre
    capital
  }
}
```

### 2.2 Provincias de un departamento

```graphql
query ProvinciasDeLaPaz {
  provinciasPorDepartamento(departamentoId: 1) {
    id
    nombre
  }
}
```

### 2.3 Municipios de una provincia

```graphql
query MunicipiosDeMurillo {
  municipiosPorProvincia(provinciaId: 1) {
    id
    nombre
  }
}
```

---

## 3. Queries anidadas — el superpoder de GraphQL

Aquí es donde GraphQL aporta más valor frente a REST: **una sola petición** trae datos relacionados de varios niveles.

### 3.1 Cada departamento con su país

```graphql
query DeptosConPais {
  departamentos {
    id
    nombre
    pais {
      id
      nombre
      codigoIso
    }
  }
}
```

> Equivalente en REST: 1 llamada a `/departamentos` + 9 llamadas a `/paises/:id`. Aquí: **1 sola petición**.

### 3.2 Cada provincia con su departamento y su país

```graphql
query ProvinciasCompletas {
  provincias {
    id
    nombre
    departamento {
      id
      nombre
      capital
      pais {
        nombre
        codigoIso
      }
    }
  }
}
```

### 3.3 Cada municipio con toda su jerarquía hacia arriba

```graphql
query MunicipiosJerarquiaCompleta {
  municipios {
    id
    nombre
    provincia {
      nombre
      departamento {
        nombre
        capital
        pais {
          nombre
        }
      }
    }
  }
}
```

> Esta única query reemplaza ~30 llamadas REST.

---

## 4. Demostración del problema N+1 y su solución (DataLoader)

### 4.1 ¿Qué es el problema N+1?

Cuando el cliente pide **N items con un campo relacionado**, el servidor naïve hace:

- **1 query** para obtener los N items
- **N queries** adicionales (una por cada item) para resolver el campo relacionado

Total: **N + 1 queries** al backend.

Con 10 items eso son 11 llamadas a la base de datos. Con 1.000 items son 1.001. Es **el problema de rendimiento más clásico de GraphQL**.

### 4.2 Solución: DataLoader

[DataLoader](https://github.com/graphql/dataloader) hace dos cosas:

1. **Batching**: agrupa todas las llamadas a `load(id)` que ocurren dentro del mismo *tick* del event loop en una sola llamada `batchFn(ids[])`.
2. **Caching por petición**: si dentro de la misma request se pide el mismo `id` dos veces, solo lo busca una vez.

### 4.3 Implementación en este proyecto

Cada módulo expone un *loader* request-scoped (creado fresco por cada petición HTTP):

- [src/modules/pais/pais.loader.ts](src/modules/pais/pais.loader.ts)
- [src/modules/departamento/departamento.loader.ts](src/modules/departamento/departamento.loader.ts)
- [src/modules/provincia/provincia.loader.ts](src/modules/provincia/provincia.loader.ts)

Y los `@ResolveField` los usan así (ejemplo en [src/modules/departamento/departamento.resolver.ts](src/modules/departamento/departamento.resolver.ts)):

```ts
@ResolveField(() => Pais)
pais(@Parent() departamento: Departamento) {
  return this.paisLoader.byId.load(departamento.paisId);
}
```

Cada servicio tiene `findByIds(ids)` que resuelve N en una sola pasada — eso es lo que el loader llama por debajo (ver [src/modules/pais/pais.service.ts](src/modules/pais/pais.service.ts)).

### 4.4 Demo en vivo — ejecuta esto y mira la consola del servidor

#### Caso A — 9 departamentos, todos pidiendo su país

```graphql
query DemoBatching {
  departamentos {
    id
    nombre
    pais {
      nombre
    }
  }
}
```

**Logs esperados en la terminal:**

```
[PaisLoader] batch byId ids=[1] (size=1)
[PaisService] findByIds([1]) (1 batched call for 1 ids)
```

> Se hicieron **9 llamadas a `paisLoader.byId.load(1)`**, pero el loader las **agrupó en una sola** y además dedup-licó porque todas pedían el mismo `id`. **De N+1 → 2 llamadas totales.**

#### Caso B — 10 provincias con su departamento y su país

```graphql
query DemoBatchingProfundo {
  provincias {
    id
    nombre
    departamento {
      nombre
      pais {
        nombre
      }
    }
  }
}
```

**Logs esperados:**

```
[DepartamentoLoader] batch byId ids=[1,2,3,4,5,6,7,8,9] (size=9)
[DepartamentoService] findByIds([1,2,3,4,5,6,7,8,9]) (1 batched call for 9 ids)
[PaisLoader] batch byId ids=[1] (size=1)
[PaisService] findByIds([1]) (1 batched call for 1 ids)
```

> Sin DataLoader: 1 (provincias) + 10 (departamentos) + 10 (paises) = **21 llamadas**.
> Con DataLoader: 1 (provincias) + 1 (deptos batched) + 1 (paises batched) = **3 llamadas**.

#### Caso C — Stress test: municipios → provincia → depto → país

```graphql
query StressBatching {
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

Aunque agreguemos 1.000 municipios, los logs siempre mostrarán **a lo sumo 1 batch por nivel de profundidad**. Ese es el punto.

---

## 5. Mutations — crear, actualizar, eliminar

### 5.1 Crear un país

```graphql
mutation CreatePais {
  createPais(createPaisInput: {
    nombre: "Argentina"
    codigoIso: "AR"
  }) {
    id
    nombre
    codigoIso
  }
}
```

### 5.2 Crear un departamento (referenciando país)

```graphql
mutation CreateDepartamento {
  createDepartamento(createDepartamentoInput: {
    nombre: "Buenos Aires"
    capital: "La Plata"
    paisId: 2
  }) {
    id
    nombre
    capital
    pais { nombre }
  }
}
```

### 5.3 Crear una provincia

```graphql
mutation CreateProvincia {
  createProvincia(createProvinciaInput: {
    nombre: "Ingavi"
    departamentoId: 1
  }) {
    id
    nombre
    departamento { nombre }
  }
}
```

### 5.4 Crear un municipio

```graphql
mutation CreateMunicipio {
  createMunicipio(createMunicipioInput: {
    nombre: "Tiquipaya"
    provinciaId: 3
  }) {
    id
    nombre
    provincia {
      nombre
      departamento { nombre }
    }
  }
}
```

### 5.5 Actualizar

```graphql
mutation UpdatePais {
  updatePais(updatePaisInput: {
    id: 1
    nombre: "Estado Plurinacional de Bolivia"
  }) {
    id
    nombre
    codigoIso
  }
}
```

### 5.6 Eliminar

```graphql
mutation RemoveMunicipio {
  removeMunicipio(id: 4) {
    id
    nombre
  }
}
```

---

## 6. Fragments — selecciones reutilizables

Define una vez los campos que quieres y reúsalos:

```graphql
fragment DatosPais on Pais {
  id
  nombre
  codigoIso
}

fragment DatosDepartamento on Departamento {
  id
  nombre
  capital
}

query UsandoFragments {
  paises { ...DatosPais }
  departamentos {
    ...DatosDepartamento
    pais { ...DatosPais }
  }
}
```

---

## 7. Variables — queries parametrizadas

En el playground, en el panel inferior **Variables**, pega el JSON de variables. En la query, los `$nombre` son reemplazados.

**Query:**

```graphql
query DeptosDePais($paisId: Int!) {
  departamentosPorPais(paisId: $paisId) {
    id
    nombre
    capital
  }
}
```

**Variables (panel inferior del playground):**

```json
{
  "paisId": 1
}
```

---

## 8. Multiples operaciones en una sola petición

GraphQL permite empacar varias queries y mutations en un solo round-trip:

```graphql
mutation SetupBolivia {
  pais: createPais(createPaisInput: {
    nombre: "Perú"
    codigoIso: "PE"
  }) {
    id
    nombre
  }

  depto: createDepartamento(createDepartamentoInput: {
    nombre: "Arequipa"
    capital: "Arequipa"
    paisId: 2
  }) {
    id
    nombre
  }
}
```

> Nota: usa **alias** (`pais:`, `depto:`) cuando llamas dos veces a la misma operación o quieres renombrar el campo de respuesta.

---

## 9. Introspección del schema

GraphQL es auto-documentado. Puedes preguntar al servidor qué tipos y operaciones expone:

### 9.1 Listar todas las operaciones

```graphql
query Introspeccion {
  __schema {
    queryType { name }
    mutationType { name }
    types {
      name
      kind
    }
  }
}
```

### 9.2 Detalles de un tipo específico

```graphql
query DetallePais {
  __type(name: "Pais") {
    name
    description
    fields {
      name
      type {
        name
        kind
      }
    }
  }
}
```

> El playground usa exactamente esta API para autocompletarte mientras escribes el codigo.

---

## Apéndice — equivalencia con `curl`

Si prefieres ejecutar fuera del playground:

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ paises { id nombre codigoIso } }"}'
```

Para queries con variables:

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query($paisId: Int!) { departamentosPorPais(paisId: $paisId) { nombre } }",
    "variables": { "paisId": 1 }
  }'
```
