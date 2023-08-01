import Authors from './components/Authors'
import Books from './components/Books'
import LoginPage from './components/LoginPage'
import NewBook from './components/NewBook'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

const App = () => {
  const style = {
    padding: "10px 20px",
    margin: "4px",
    backgroundColor: "#99bfb7"
  }



  return (
    <Router>

      <div>
        <Link style={style} to='/authors'>
          authors
        </Link>
        <Link style={style} to='/books'>
          books
        </Link>
        <Link style={style} to='/add'>
          add book
        </Link>
        <Link style={style} to='/login'>
          login
        </Link>
        <button>logout</button>
      </div>

      <Routes>
        <Route path='*' element={<Authors />} />
        <Route path='authors' element={<Authors />} />
        <Route path='books' element={<Books />} />
        <Route path='add' element={<NewBook />} />
        <Route path='login' element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App
