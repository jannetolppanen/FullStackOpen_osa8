const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser
    },
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
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })

      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
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
              code: 'INTERNAL_SERVER_ERROR',
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
            error,
          },
        })
      }
      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        console.log('triggered')
        throw new GraphQLError(`Could not find user ${args.name}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      }
      author.born = args.setBornTo

      try {
        await author.save()
      } catch {
        throw new GraphQLError('Could not edit birthyeard', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            error,
          },
        })
      }
      return author
    },
  },
}

module.exports = resolvers