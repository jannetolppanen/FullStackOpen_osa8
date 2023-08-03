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
  query AllBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      published
      genres
      id
      author {
        name
      }
    }
  }
`

export const ADD_BOOK = gql`
mutation addBook(
  $title: String!,
  $author: String!,
  $published: Int!,
  $genres: [String!]
  ) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
    ) {
    title
    author {
      name
    }
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

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const LOGGEDIN_USER = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`