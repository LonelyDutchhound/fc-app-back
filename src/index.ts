import express = require("express");
import apolloServerExpress = require("apollo-server-express");
import gql from "graphql-tag";
import { StorageAPI, Card } from "./dataSource";
import { DataSources } from "apollo-server-core/dist/graphqlOptions";

export interface MySources {
  storageAPI: StorageAPI;
}

export interface Context {
  dataSources: MySources;
}

const { ApolloServer } = apolloServerExpress;

const PATH = process.env.LOCAL ? "/graphql" : "/";
const PORT = 4001;

const app = express();

const typeDefs = gql`
  type Card {
    id: ID!
    name: String
  }

  type Query {
    hello: String
    cards: [Card]
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello, World",
    cards: (parent: any, args: any, context: Context): Promise<Card[]> => {
      return context.dataSources.storageAPI.getCards();
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
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  )
);
