import express = require("express");
import { ApolloServer } from "apollo-server-express";
import gql from "graphql-tag";
import { StorageAPI, ICard, ITheme } from "./dataSource";
import { DataSources } from "apollo-server-core/dist/graphqlOptions";

export interface MySources {
  storageAPI: StorageAPI;
}

export interface Context {
  dataSources: MySources;
}

const PATH = process.env.LOCAL ? "/graphql" : "/";
const PORT = 4001;

const app = express();

const typeDefs = gql`

    #  Inputs

    input AddCardInput {
        title: String!
        description: String
        theme: ID!
    }
    
    input EditCardInput {
        id: ID!
        title: String
        description: String
    }

    input DeleteCardInput {
        id: ID!
    }

    #  Query types
    
    type Card {
        _id: ID!
        title: String
        description: String
        theme: ID!
    }
    
    type Theme {
        _id: ID!
        name: String!
        description: String
    }
    
    type Query {
        cards: [Card]
        themes: [Theme]
    }

    type Mutation {
        addCard(input: AddCardInput): Card
#        editCard(input: EditCardInput): Card
        deleteCard(input: DeleteCardInput): Card
    }
`;

const resolvers = {
  Query: {
    cards: (parent: any, args: any, context: Context): Promise<ICard[]> => {
      return context.dataSources.storageAPI.getCards();
    },
    themes: (parent: any, args: any, context: Context): Promise<ITheme[]> => {
      return context.dataSources.storageAPI.getThemes();
    }
  },
  Mutation: {
    addCard: (parent: any, args: any, context: Context) => {
      return context.dataSources.storageAPI.addCard(args);
    },
    deleteCard: (parent: any, args: any, context: Context) => {
      return context.dataSources.storageAPI.deleteCard(args);
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: (): DataSources<MySources> => {
    return {
      storageAPI: new StorageAPI()
    };
  }
});

server.applyMiddleware({ app, path: PATH });

app.listen({ port: PORT }, () =>
  console.info(
    `🚀 Server ready at http://localhost:${ PORT }${ server.graphqlPath }`
  )
);


