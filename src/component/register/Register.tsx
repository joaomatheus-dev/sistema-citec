import React, { useState } from 'react';
import './Register.css';
import Swal from 'sweetalert2';

import { db } from '../../config/firebase';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';

const Register = () => {
  const handleSubmit = (e: any) =>{
    e.preventDefault()

/*     if(formAdmin.password !== setFormAdmin.confirmPassword){
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'A senha tem que ser igual a confirmação.',
        showConfirmButton: true,
      });
 */}

  return (
    <div className='background-login-register'>
      <div className="register">
        <h1>Cadastro Admin</h1>
        <p>Faça seu cadastro para ter acesso às informações</p>
        <form>
          <label>
            <input type="text" name="displayname" required placeholder="Nome do Admin" />
          </label>
          <label>
            <input type="email" name="email" required placeholder="E-mail do Admin" />
          </label>
          <label>
            <input type="password" name="password" required placeholder="Insira a senha" />
          </label>
          <label>
            <input type="password" name="confirmPassword" required placeholder="Confirme a sua senha" />
          </label>
          <button type="submit" className="button-cadastro">Cadastrar</button>
        </form>
      </div>
    </div>
  );
};

export default Register;