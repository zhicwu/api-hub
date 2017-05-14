import express from 'express';
import graphqlHTTP from 'express-graphql';

import {
  buildSchema,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLError,
  BREAK
} from 'graphql';

import fs from 'fs';
import path from 'path';
import {mergeStrings} from 'gql-merge';

import root from './types';

const app = express();
const schemaDir = path.resolve(__dirname, 'schema');
const schemaFiles = fs.readdirSync(schemaDir);
const types = schemaFiles.filter(file => file.search(/\.(gql|graphql)$/ig) > 0).map(file => fs.readFileSync(path.join(schemaDir, file), 'utf-8'));
const typeDefs = mergeStrings(types);

let schema = buildSchema(typeDefs);

app.use('/graphql', graphqlHTTP({schema: schema, rootValue: root, graphiql: true}));

app.listen(4000);
console.log("Server is ready: http://localhost:4000/graphql");