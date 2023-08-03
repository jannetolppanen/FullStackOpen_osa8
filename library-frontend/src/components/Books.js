import { ALL_BOOKS } from "../queries"
import { useQuery } from "@apollo/client"
import { useState } from "react"
const Books = () => {
  const [filter, setFilter] = useState('')

  const result = useQuery(ALL_BOOKS, {
    fetchPolicy: "no-cache",  // bypass cache when querying
  })
  
  const books = useQuery(ALL_BOOKS, {
    variables: { genre: filter },
    fetchPolicy: "no-cache",  // bypass cache when querying
  })
  
  if (result.loading || books.loading)  {
    return <div>loading...</div>
  }
  // Create list of genres without duplicates
  const genres = [...new Set(result.data.allBooks.reduce((accumulator, book) => accumulator.concat(book.genres), []))]

// Creates a list of books and filters them if filter is set
// Left this here to show how it was done with frontend
// const filteredBooks = filter
//   ? result.data.allBooks.filter((book) => book.genres.includes(filter))
//   : result.data.allBooks

  return (
    <div>
      <h2>books</h2>
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
      <button onClick={() => setFilter('')}>all genres</button><br/>
      {genres.map((genre) => (
        <button key={genre} onClick={() => setFilter(genre)}>{genre}</button>
      ))}
    </div>
  )
}

export default Books
