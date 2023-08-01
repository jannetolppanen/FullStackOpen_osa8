import { useState } from 'react'

const LoginPage = () => {

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const style = {
    margin: '20px 0px',
  }



  const handleLogin = (e) => {
    console.log('Login')
  }
  return (
    <div style={style}>
      <h2>login</h2>
      <form onSubmit={handleLogin}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
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
      </form>
            </div>
  )
}

export default LoginPage