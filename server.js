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

    type Query {
        quoteOfTheDay: String
        random: Float!
        getDie(numSides: Int): RandomDie
    }
`)


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