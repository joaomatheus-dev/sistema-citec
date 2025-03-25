import React from 'react'
 import { useNavigate } from 'react-router'
import Swal from 'sweetalert2';
import './Login.css'

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
    event.preventDefault();
    try{
      Swal.fire({
        title: 'Logando usuário...',
        html: `
         <div style="display: flex; flex-direction: column; align-items: center;">
         <BarLoader color="#0000ff" width={150} />
         <p style="margin-top: 10px;">Por favor, aguarde...</p>
         </div>
              `,
         allowOutsideClick: false,
         showConfirmButton: false,
         willOpen: () => {
         Swal.showLoading();
         },
        });

    const auth = getAuth();
    await  signInWithEmailAndPassword(auth, email, password)
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Usuário logado com sucesso.',
            showConfirmButton: true,
          }).then(() => {
            navigate('/');
          });

    }catch(erro){
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: erro as string,
        showConfirmButton: true
      });
    }
  }

  return (
  <div className='background-login-register'>
    <div className="login">
      <h1>Login</h1>
      <form>
        <input type='text'
        value={email}
         onChange={({target}) => setEmail(target.value)}
         placeholder='Insira seu e-mail'
         />
        <input type='password'
        value={password}
         onChange={({target}) => setPassword(target.value)}
         placeholder='Insira sua senha'
        />
        <button className='button-login' onClick={handleLogin}>Login</button>
{/*         <Link to="/login/perdeu">
          <button>Perdeu a senha?</button>
        </Link> */}
      </form>
    </div>
  </div>
  )
}

export default LoginForm