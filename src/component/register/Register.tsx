import React, { useState } from 'react';
import './Register.css';
import Swal from 'sweetalert2';

import { IAdmin } from '../../models/Admin';

import { db } from '../../config/firebase';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from 'react-router';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const navigate = useNavigate();

  const auth = getAuth();

  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleCadastro = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    try {
      // Verifica se há um usuário logado atualmente
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Nenhum usuário logado. Faça login primeiro.',
          showConfirmButton: true,
        });
        return;
      }

      // Pede a senha do usuário atual para confirmar
      const { value: password } = await Swal.fire({
        title: 'Confirme sua identidade',
        input: 'password',
        inputLabel: 'Digite sua senha atual para confirmar',
        inputPlaceholder: 'Insira sua senha',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Você precisa digitar sua senha!';
          }
        }
      });

      if (!password) {
        return;
      }

      // Verifica a senha do usuário atual
      try {
        await signInWithEmailAndPassword(auth, currentUser.email, password);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Senha incorreta',
          text: 'A senha digitada não confere com o usuário atual.',
          showConfirmButton: true,
        });
        return;
      }

      // Se chegou aqui, a senha está correta - prossegue com cadastro
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

      // Salva as credenciais do usuário atual para relogar depois
      const currentUserCredentials = {
        email: currentUser.email,
        password: password
      };

      // Cria o novo admin
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

      // Faz logout do novo usuário criado
      await signOut(auth);

      // Reloga o usuário original
      await signInWithEmailAndPassword(auth, currentUserCredentials.email, currentUserCredentials.password);

      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Usuário admin cadastrado com sucesso.',
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