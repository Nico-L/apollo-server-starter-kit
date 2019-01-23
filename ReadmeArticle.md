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

Nous allons ré-implémenter une API REST sur le thème de Game of Throne en GraphQL. Voici le dépot github de cette [API](http://github).


### Ajoutons les types

Nous allons commencer par ajouter notre type `Character`  `src/definitions/Query.graphql` avec ceci:

```graphql
type Query {
  _empty: String
}

extend type Query {
  me: AuthPayload
}
```

## Créer un dataSource REST

## Analyser et optimiser notre API GraphQL
