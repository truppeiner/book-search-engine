import { gql } from "@apollo/client";

// get me 

export const QUERY_ME = gql`
{
  me {
    _id
    username
    email
    bookCount
    savedBooks {
      bookId
      authors
      description
      image
      link
      title
    }
  }
}
`