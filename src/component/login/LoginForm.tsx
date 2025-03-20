import React from 'react'
import { Link } from 'react-router'

const LoginForm = () => {
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
  }

  return (
    <section>
      <h1>Login</h1>
      <form action='' onSubmit={handleSubmit}>
        <input type='text'
        value={username}
         onChange={({target}) => setUsername(target.value)}
         />
        <input type='text'
        value={password}
         onChange={({target}) => setPassword(target.value)}
        />
      </form>
        <Link to="/login/perdeu">
          <button>Perdeu a senha?</button>
        </Link>
    </section>
  )
}

export default LoginForm