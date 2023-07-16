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

export const ADD_BOOK = gql`
mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]) {
  addBook(title: $title, author: $author, published: $published, genres: $genres) {
    title
    author
    published
    genres
  }
}`

export const CHANGE_BIRTHDAY = gql`
mutation EditAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name    
  }
}
`