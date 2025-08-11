import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

async function main() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const port = Number(process.env.API_PORT ?? 4000);
  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: async () => ({})
  });
  console.log(`API ready at ${url}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});