const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const { GraphQLError } = require('graphql')

const Author = require('./models/author')
const Book = require('./models/book')

require('dotenv').config()

let authors = [
  {
    name: 'Robert Martin',
    id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
    born: 1821,
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
  },
]

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'crime'],
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'revolution'],
  },
]

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
type Book {
  title: String!
  published: Int!
  author: Author!
  genres: [String!]!
  id: ID!
}

type Author {
  name: String!
  id: ID!
  born: Int
  bookCount: Int!
}

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author:String, genre:String): [Book!]
    allAuthors: [Author!]
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => {
      const books = await Book.find({})
      return books.length
    },
    authorCount: async () => {
      const authors = await Author.find({})
      return authors.length
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      return authors
    },
    allBooks: async (root, args) => {
      let result = await Book.find({}).populate(
        'author',
        'name id born bookCount'
      )
      if (args.author) {
        result = result.filter((book) => book.author.name === args.author)
      }
      if (args.genre) {
        result = result.filter((book) => book.genres.includes(args.genre))
      }
      return result
    },
  },
  Author: {
    bookCount: async (root) => {
      booksByAuthor = await Book.find({ author: root.id })
      return booksByAuthor.length
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      if (args.author.length < 4) {
        throw new GraphQLError('Author name must be atleast 4 letters', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
          },
        })
      }
      if (args.title.length < 5) {
        throw new GraphQLError('Title must be atleast 5 letters', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        })
      }

      let existingAuthor = await Author.findOne({ name: args.author })
      if (!existingAuthor) {
        try {
          existingAuthor = new Author({ name: args.author })
          await existingAuthor.save()
        } catch (error) {
          throw new GraphQLError('Could not save new author', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR'
            },
          })
        }
      }

      const book = new Book({ ...args, author: existingAuthor })

      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Could not save new book', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            error
          }
        })
      }
      return book
    },
    editAuthor: async (root, args) => {

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        console.log('triggered')
        throw new GraphQLError(`Could not find user ${args.name}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          }
        })
      }
      author.born = args.setBornTo

      try {
        await author.save()
      } catch {
        throw new GraphQLError('Could not edit birthyeard', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            error
          }
        })
      }
      return author
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
