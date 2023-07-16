import { gql } from '@apollo/client'

export  const ALL_AUTHORS = gql`
query  {
  allAuthors {
    born
    id
    name
    bookCount
  }
}
`

export const ALL_BOOKS = gql`
query {
  allBooks {
    author
    genres
    id
    published
    title
  }
}
`