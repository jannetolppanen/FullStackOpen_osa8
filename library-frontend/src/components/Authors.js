import { ALL_AUTHORS, ALL_BOOKS, CHANGE_BIRTHDAY } from '../queries'
import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'

const Authors = () => {
  const [ name, setName] = useState('')
  const [ born, setBorn ] = useState('')

  const result = useQuery(ALL_AUTHORS)
  const [ editAuthor ] = useMutation(CHANGE_BIRTHDAY, {
    refetchQueries: [{ query: ALL_AUTHORS}, {query: ALL_BOOKS}]
  })

  const submit = async (event) => {
    event.preventDefault()

    editAuthor( { variables: {name, setBornTo: born}})

    setName('')
    setBorn('')
  }
  
  if (result.loading)  {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
          </tbody>
        </table>
          <h2>set birthyear</h2>

          <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(parseInt(target.value))}
          />
        </div>


        <button type='submit'>update author</button>
      </form>

    </div>
  )
}

export default Authors
