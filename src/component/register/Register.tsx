import React, { useState } from 'react';
import './Register.css';
import Swal from 'sweetalert2';

import { IAdmin } from '../../models/Admin';

import { db } from '../../config/firebase';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleCadastro = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    try {
      Swal.fire({
        title: 'Cadastrando usuário...',
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

      if (senha !== confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'A senha tem que ser igual a confirmação.',
          showConfirmButton: true,
        });
        return;
      }

      let credentialAdmin = await createUserWithEmailAndPassword(getAuth(), email, senha);
      let idAdmin = credentialAdmin.user?.uid;
      await updateProfile(credentialAdmin.user, {
        displayName: nome
      });

      let dataAdmin: IAdmin = {
        idAdmin: idAdmin,
        name: nome,
        email: email,
        admin: true,
      };

      await setDoc(doc(db, "admins", idAdmin), dataAdmin);

      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Usuário cadastrado com sucesso.',
        showConfirmButton: true,
      }).then(() => {
        navigate('/');
      });
    } catch (erro) {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: erro as string,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className='background-login-register'>
      <div className="register">
        <h1>Cadastro Admin</h1>
        <p>Faça seu cadastro para ter acesso às informações</p>
        <form>
          <label>
            <input type="text" name="displayname" required placeholder="Nome do Admin" value={nome} onChange={(event) => setNome(event.target.value)} />
          </label>
          <label>
            <input type="email" name="email" required placeholder="E-mail do Admin" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            <input type="password" name="password" required placeholder="Insira a senha" value={senha} onChange={(event) => setSenha(event.target.value)} />
          </label>
          <label>
            <input type="password" name="confirmPassword" required placeholder="Confirme a sua senha" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          </label>
          <button type="submit" onClick={(event) => handleCadastro(event)} className="button-cadastro">Cadastrar</button>
        </form>
      </div>
    </div>
  );
};

export default Register;