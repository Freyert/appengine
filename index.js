import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import { readFile } from 'fs/promises'

async function startApollo() {
    const gqlRaw = await readFile('./schemas/todo.graphql')
    const typeDefs = gql`${gqlRaw.toString()}`

    const resolvers = {
        Query: {
            todos: () => [
                {
                    title: "win",
                    details: "it all"
                },
                {
                    title: "catch",
                    details: "'em all"
                }
            ]
        }
    }

    const server = new ApolloServer({typeDefs, resolvers})
    await server.start()

    const app = express()
    server.applyMiddleware({app})

    await new Promise(resolve => app.listen({port: 4000}, resolve))
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    return { server, app };
}

startApollo()