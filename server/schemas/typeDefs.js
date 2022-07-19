const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        savedBooks: [Book]
        bookCount: Int
        }
    
    type Book {
        bookId: String
        authors: [String]
        description: String
        image: String
        link: String
        title: String
        }

    type Query {
    users: [User]
    }

    type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    }

    type Auth {
    token: ID!
    user: User
    }
`
;

module.exports = typeDefs;