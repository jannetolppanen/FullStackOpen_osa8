import Authors from './components/Authors'
import Books from './components/Books'
import LoginPage from './components/LoginPage'
import NewBook from './components/NewBook'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import { useApolloClient } from '@apollo/client'

const App = () => {
  const client = useApolloClient()
  const [token, setToken] = useState(null)
  const style = {
    margin: '4px',
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  console.log(token)

  return (
    <Router>
      {token ? token : "no token"}
      <div>
        <Link style={style} to='/authors'>
          <button>authors</button>
        </Link>
        <Link style={style} to='/books'>
          <button>books</button>
        </Link>
        <Link style={style} to='/add'>
          <button>add book</button>
        </Link>
        <Link style={style} to='/login'>
          <button>login</button>
        </Link>
        <Link>
          <button onClick={logout}>logout</button>
        </Link>
      </div>

      <Routes>
        <Route path='*' element={<Authors />} />
        <Route path='authors' element={<Authors />} />
        <Route path='books' element={<Books />} />
        <Route path='add' element={<NewBook />} />
        <Route path='login' element={<LoginPage setToken={setToken} />} />
      </Routes>
    </Router>
  )
}

export default App
