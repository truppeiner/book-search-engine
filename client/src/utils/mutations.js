import { gql } from "@apollo/client";

// log in 
export const LOGIN_USER = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      username
    }
  }
}
`

// add user 
export const ADD_USER = gql`
mutation AddUser($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    token
    user {
      _id
      username
    }
  }
}
`

// save book 
export const SAVE_BOOK = gql`
mutation SaveBook($book: addBook!) {
  saveBook(book: $book) {
    _id
    username
    email
    savedBooks {
      bookId
      authors
      description
      image
      link
      title
    }
    bookCount
  }
}
`

// remove book 
export const REMOVE_BOOK = gql`
mutation RemoveBook($bookId: String!) {
  removeBook(bookId: $bookId) {
    _id
    username
    email
    bookCount
    savedBooks {
      bookId
      authors
      description
      link
      image
      title
    }
  }
}`