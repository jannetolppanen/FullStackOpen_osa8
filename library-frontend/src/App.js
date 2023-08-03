import Authors from './components/Authors'
import Books from './components/Books'
import LoginPage from './components/LoginPage'
import NewBook from './components/NewBook'
import Recommendations from './components/Recommendations'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { LOGGEDIN_USER } from './queries'
import userEvent from '@testing-library/user-event'

const App = () => {
  const client = useApolloClient()
  const [token, setToken] = useState(null)
  const userDetails = useQuery(LOGGEDIN_USER)
  const style = {
    margin: '4px',
  }

  // Check localstorage for logged in user
  useEffect(() => {
    const loggedUser = window.localStorage.getItem('library-user-token')
    if (loggedUser) {
      setToken(loggedUser)
    }
  },[])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <Router>
      <div>
        <Link style={style} to='/authors'>
          <button>authors</button>
        </Link>

        <Link style={style} to='/books'>
          <button>books</button>
        </Link>
        
        {token ? (<Link style={style} to='/add'>
          <button>add book</button>
        </Link>) : null}

        {token ? (<Link style={style} to='/recommendations'>
          <button>recommendations</button>
        </Link>) : null}

        {token ? (
          <Link>
            <button onClick={logout}>logout</button>
          </Link>
        ) : (
          <Link style={style} to='/login'>
            <button>login</button>
          </Link>
        )}
      </div>

      <Routes>
        <Route path='*' element={<Authors />} />
        <Route path='authors' element={<Authors token={token} />} />
        <Route path='books' element={<Books />} />
        <Route path='add' element={<NewBook />} />
        <Route path='recommendations' element={<Recommendations userDetails={userDetails} />} />
        <Route path='login' element={<LoginPage setToken={setToken} />} />
      </Routes>
    </Router>
  )
}

export default App
