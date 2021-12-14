const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

// Construct a schema
let schema = buildSchema(`
    type RandomDie {
        roll(numRolls: Int!): [Int]
        numSides: Int!
        rollOnce: Int!
    }

    input MessageInput {
        content: String
        author: String
    }

    type Message {
        id: ID!
        content: String
        author: String
    }

    type Query {
        quoteOfTheDay: String
        random: Float!
        getDie(numSides: Int): RandomDie
        getMessage(id: ID!): Message
    }

    type Mutation {
        createMessage(input: MessageInput): Message
        updateMessage(id: ID!, input: MessageInput): Message
    }
`)

/**
 * the mutations return a Message type so that the client can get more information about the newly-modified Message in the same request
 * as the request thaat mutates it
 * 
 * Input types can't have fields that are other objects, only basic scalar types, list types and other input types
 * 
 */


// if message had any complex fields we'd put them here
class Message {
    constructor(id, { content, author }) {
        this.id = id
        this.content = content
        this.author = author
    }
}

class RandomDie {
    constructor(numSides) {
        this.numSides = numSides
    }

    rollOnce() {
        return 1 + Math.floor(Math.random() * this.numSides);
    }

    roll({ numRolls }) {
        let output = []
        for (let i = 0; i < numRolls; i++) {
            output.push(this.rollOnce())
        }
        return output
    }
}

// Maps content
let fakeDB = {}


// Define resolver functions
let resolvers = {
    quoteOfTheDay: () => {
        return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within'
    },
    random: () => {
        return Math.random()
    },
    getDie: ({ numSides }) => {
        return new RandomDie(numSides || 6)
    },
    getMessage: ({ id }) => {
        if (!fakeDB[id]) {
            throw new Error('No messages exist with id' + id)
        }
        return new Message(id, input)
    },
    createMessage: ({ input }) => {
        // create a random id for our db
        var id = require('crypto').randomBytes(10).toString('hex')

        fakeDB[id] = input
        return new Message(id, input)
    },
    updateMessage: ({ id, input }) => {
        if (!fakeDB[id]) {
            throw new Error('no messages exists with id ' + id)
        }

        // replace old data
        fakeDB[id] = input
        return new Message(id, input)
    }
}

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true
}))
app.listen(4000, () => {
    console.log("Server running on http://localhost:4000/graphql")
})