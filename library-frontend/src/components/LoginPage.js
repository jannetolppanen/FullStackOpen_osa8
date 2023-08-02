import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginPage = ({ setToken }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const style = {
    margin: '20px 0px',
  }

  const [ login, result ] = useMutation(LOGIN)

  useEffect(() => {    
    if ( result.data ) {      
        const token = result.data.login.value      
        setToken(token)      
        localStorage.setItem('library-user-token', token)    
      }  
  }, [result.data])


  const submit = async (event) => {
    event.preventDefault()
    
    login({ variables: { username, password } })
  }
  return (
    <div style={style}>
      <h2>login</h2>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            />
        </div>
        <div>
          password
          <input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            />
        </div>
        <button type='submit'>login</button>
        <p>admin / secret</p>
      </form>
            </div>
  )
}

export default LoginPage