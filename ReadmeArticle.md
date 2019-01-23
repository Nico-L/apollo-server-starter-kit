---
layout: post
title: "Serveur Apollo GraphQL"
excerpt: ""
authors:
  - fpasquet
lang: fr
permalink: /fr/graphql
categories:
  - api
  - graphql
  - apollo-graphql
  - nodejs
cover: /
---

# Serveur Apollo GraphQL

Cette article a pour but de partager les bonnes pratiques que nous avons mis en place au sein de nos projet GraphQL mais aussi de débuter en GraphQL tout en allant dans des concepts avancée. 

- Migrer rapidement une API REST existante en GraphQL

## Sommaire

- [Comment structurer son projet](#comment-structurer-son-projet)
- [Implémenter notre schéma GraphQL](#)
- [Créer un dataSource REST](#)
- [Analyser et optimiser notre GraphQL](#)

## Comment structurer son projet

Nous allons tout d'abord commencer par cloner le projet starter kit qui se trouve sur notre [github](https://github.com/fpasquet/apollo-server-starter-kit) ou bien vous pouvez le tester directement sur [codesandbox](https://codesandbox.io/s/github/fpasquet/apollo-server-starter-kit/tree/feat/master).

A quoi ressemble ce starter kit et que contient-il, voici l'arborescence de notre serveur apollo GraphQL:

```bash
.
├── src
│   ├── dataLayers
│   ├── dataSources
│   ├── definitions
│   ├── resolvers
│   ├── directives
│   ├── subscriptions
│   └── index.js
└── package.json
```

Nous retrouvons ici :

- `"src/dataLayers"` contiendra tout ce qui concerne la couche d'abstractions de données, dans notre exemple nous en aurons deux, une pour le REST et une autre pour le SQL avec `Knex.js`.
- `"src/dataSources/"` quant à lui incluera les classes encapsulent l'extraction des données. Il peut être lié à une API REST (RESTDataSource), une base de donnée .... Apollo Server implémente une classe qui intégre la mise en cache, la déduplication et le traitement des erreurs. Dans chacune des classes, nous pourrons ajouter des dataLoaders qui optimiserons notre API GraphQL. Les dataLoaders sont des fonctions de déduplication et du traitement par lots d'objets avec un système de cache intégré.
- `"src/definitions/"` comprendra tout nos fichiers définissant notre schéma GraphQL (`Queries`, `Mutations`, `Types`, `Inputs`, `Interfaces`, `Directives`, `Enums` ...)
- `"src/resolvers/"`, `"src/directives/"` et `"src/subscriptions/"` contiendra nos différents résolveurs
- `"src/index.js"` est notre point d'entrée pour notre API GraphQL


## Implémenter notre schéma GraphQL

Petit conseil sur l'implémentation de votre schéma, ne reprenez pas la structure et le nommage de votre API REST, car c'est une chose très importante le nommage en GraphQL, une personne doit comprendre du premier coup d'oeil votre API rien quand regardant votre schéma.

L'API GraphQL sera sur le thème de Game Of Throne, on affichera les différents personnages et les différents maisons. Pour ce faire nous utiliserons l'API REST qui se trouve sur le dépot github de cette [API](http://github).


### Ajoutons les types

Ajoutons notre type `Character` dans le fichier `src/definitions/Type/Character.graphql`:

```graphql
type Character {
  slug: ID!
  name: String!
  imageUrl: String
  father: Character
  mother: Character
  spouse: Character
  childrens: [Character]
  house: House
}
```

Ajoutons notre type `House` dans le fichier `src/definitions/Type/House.graphql`:

```graphql
type House {
  slug: ID!
  name: String!
  imageUrl: String
  lord: Character
  heirs: [Character]
  characters: [Character]
}
```

Ajoutons nos queries dans le fichier `src/definitions/Query.graphql`:

```graphql
extend type Query {
  characters: [Character]
  houses: [House]
}
```

## Créer un dataSource REST

Nous allons créer deux dataSource REST un pour les personnages et l'autre pour les maisons.

Ajoutons notre premier DataSource pour les personages dans le fichier `src/dataSources/CharacterRESTDataSource.js`:

```js
const { RESTDataSource } = require("apollo-datasource-rest");

class CharacterRESTDataSource extends RESTDataSource {
  constructor() {
    super();
    if (!process.env.ENDPOINT_GOT_API) {
      throw new Error(
        "You have not set the `ENDPOINT_GOT_API` environment variable !"
      );
    }
    this.baseURL = process.env.ENDPOINT_GOT_API;
  }

  get characters() {
    return this.get("/characters");
  }

  findCharacterBySlug(slug) {
    return this.get(`/character/${slug}`);
  }
}

module.exports = CharacterRESTDataSource;
```

Ajoutons notre deuxième DataSource pour les maisons dans le fichier `src/dataSources/HouseRESTDataSource.js`:

```js
const { RESTDataSource } = require("apollo-datasource-rest");

class HouseRESTDataSource extends RESTDataSource {
  constructor() {
    super();
    if (!process.env.ENDPOINT_GOT_API) {
      throw new Error(
        "You have not set the `ENDPOINT_GOT_API` environment variable !"
      );
    }
    this.baseURL = process.env.ENDPOINT_GOT_API;
  }

  get houses() {
    return this.get("/houses");
  }

  findHouseBySlug(slug) {
    return this.get(`/house/${slug}`);
  }
}

module.exports = HouseRESTDataSource;
```

## Ajoutons nos resolveurs

Ajoutons notre premier resolveur pour les personnages dans le fichier `src/resolvers/character.js`:

```js
const resolvers = {
  Query: {
    characters: (
      parent,
      args,
      { dataSources: { CharacterRESTDataSource } },
      info
    ) => CharacterRESTDataSource.characters
  },
  Character: {
    father: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.father ? CharacterRESTDataSource.findCharacterBySlug(parent.father) : null,
    mother: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.mother ? CharacterRESTDataSource.findCharacterBySlug(parent.mother) : null,
    spouses: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.spouses ? CharacterRESTDataSource.findCharactersBySlug(parent.spouses) : null,
    childrens: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.childrens ? CharacterRESTDataSource.findCharactersBySlug(parent.childrens) : null,
    house: (parent, args, { dataSources: { HouseRESTDataSource } }) => parent.house ? HouseRESTDataSource.findHouseBySlug(parent.house) : null,
  }
};

module.exports = resolvers;
```

Ajoutons notre deuxième resolveur pour les maisons dans le fichier `src/resolvers/house.js`:

```js
const resolvers = {
  Query: {
    characters: (
      parent,
      args,
      { dataSources: { CharacterRESTDataSource } },
      info
    ) => CharacterRESTDataSource.characters
  },
  House: {
    lord: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.lord ? CharacterRESTDataSource.findCharacterBySlug(parent.lord) : null,
    heirs: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.heirs ? CharacterRESTDataSource.findCharactersBySlug(parent.heirs) : null,
    characters: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.father ? CharacterRESTDataSource.findCharactersByHouseSlug(parent.slug) : null,
  },
};

module.exports = resolvers;
```

## Analyser et optimiser notre API GraphQL
