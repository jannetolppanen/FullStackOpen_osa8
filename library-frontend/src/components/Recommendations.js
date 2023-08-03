import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { LOGGEDIN_USER } from '../queries'

const Recommendations = () => {
  const { data } = useQuery(LOGGEDIN_USER)
  const { favoriteGenre } = data?.me || {}

  const books = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
  })

  if (books.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <b>{favoriteGenre}</b></p>
<table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.allBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
