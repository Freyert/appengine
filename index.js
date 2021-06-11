import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import { readFile } from 'fs/promises'
import firebase from 'firebase-admin'

async function startApollo() {
    const gqlRaw = await readFile('./schemas/todo.graphql')
    const typeDefs = gql`${gqlRaw.toString()}`


    firebase.initializeApp()

    const db = firebase.firestore()

    const collRef = db.collection('todos')

    const docRef = collRef.doc("1")

    docRef.set({
        title: "finish talk",
        details: "it's due FRIDAY"
    })

    const resolvers = {
        Query: {
            async todos() {
                var collect = []
                await collRef.get().then(snapshot => snapshot.forEach(doc => collect.push(doc.data())))
                console.log(collect)
                return collect
            }
        }
    }

    const server = new ApolloServer({typeDefs, resolvers})
    await server.start()

    const app = express()
    server.applyMiddleware({app})

    await new Promise(resolve => app.listen({port: 8080}, resolve))
    console.log(`🚀 Server ready at http://localhost:8080${server.graphqlPath}`);
    return { server, app };
}

startApollo()