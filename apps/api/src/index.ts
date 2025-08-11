import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { config } from './config.js';
import { getClickHouse } from './clickhouse.js';

async function main() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const port = config.apiPort;
  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: async () => ({})
  });
  const ch = getClickHouse();
  console.log(`API ready at ${url} (ClickHouse: ${ch ? 'enabled' : 'disabled'})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});