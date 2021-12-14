const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

// Construct a schema
let schema = buildSchema(`
    type Query {
        hello: String
    }
`)

// Define resolver functions
let resolvers = {
    hello: () => {
        return 'Hello Iello Jello Kello Mello Nello Oello'
    }
}

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true
}))
app.listen(4000)