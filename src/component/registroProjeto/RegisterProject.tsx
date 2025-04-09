import React, { useState } from 'react';
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2';

import { db, storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

import { IForm } from '../../models/Form';

import { v4 as uuidv4 } from 'uuid';
import './RegisterProject.css'

function RegisterProject() {
  const [formData, setFormData] = useState<IForm>({
    idForm: uuidv4(),
    titulo: '',
    etapa: '',
    categoriaProjeto: '',
    dataInicio: '',
    dataFim: '',
    tipoPesquisa: '',
    propriedadeIntelectual: '',
    linkProjeto: '',
    tipoLink: '',
    descricaoProjeto: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [warning, setWarning] = useState({ message: '', color: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'descricaoProjeto') {
      if (value.length === 550) {
        setWarning({
          message: 'Limite máximo de 550 caracteres atingido!',
          color: 'red',
        });
      } else if (value.length >= 500 && value.length < 550) {
        setWarning({
          message: 'Você está próximo do limite máximo de 550 caracteres!',
          color: 'orange',
        });
      } else if (value.length > 550) {
        setWarning({
          message: 'O limite máximo é de 550 caracteres',
          color: 'red',
        });
      } else {
        setWarning({ message: '', color: '' });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    Swal.fire({
      title: 'Enviando...',
      text: 'Por favor, aguarde enquanto salvamos seu projeto.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      let fileUrl = '';
      
      if (file) {
        const fileRef = ref(storage, `projectFiles/${formData.idForm}/${file.name}`);
        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
      }

      const formWithFile = {
        ...formData,
        fileUrl: fileUrl || 'Nenhum arquivo enviado',
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "projects", formData.idForm), formWithFile);

      await Swal.fire({
        title: 'Sucesso!',
        text: 'Projeto cadastrado com sucesso!',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      navigate('/');

    } catch (error) {
      console.error('Erro ao enviar formulário:', error);

      await Swal.fire({
        title: 'Erro!',
        text: 'Ocorreu um erro ao cadastrar o projeto. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      Swal.close();
    }
  };

  return (
    <div className='background-login-register'>
      <div className="App-form">
        <form className="Formulario" onSubmit={handleSubmit}>
          <h1>Cadastro de Projeto</h1>
          <div className="form-row">
            <div className="form-group left-group">
              <label>
                Título do Projeto:
                <input
                  className='input-form'
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="form-group right-group">
              <label>
                Etapa:
                <select
                  name="etapa"
                  value={formData.etapa}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled hidden>
                    Selecione...
                  </option>
                  <option value="emPlanejamento">Projeto em Planejamento</option>
                  <option value="emDesenvolvimento">Em Desenvolvimento</option>
                  <option value="emPublicacao">Em Publicação</option>
                  <option value="esperandoRegistro">
                    Aguardando Registro de Software
                  </option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group left-group">
              <label>
                Categoria do projeto:
                <select
                  name="categoriaProjeto"
                  value={formData.categoriaProjeto}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled hidden>
                    Selecione...
                  </option>
                  <option value="Aplicativo">Aplicativo</option>
                  <option value="Sistema Web">Sistema Web</option>
                  <option value="Equipamento">Equipamento</option>
                </select>
              </label>
            </div>
            <div className="form-group data-group">
              <label>
                Data de Início:
                <input
                  className='input-form'
                  type="date"
                  name="dataInicio"
                  value={formData.dataInicio}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="form-group data-group">
              <label>
                Data de Fim:
                <input
                  className='input-form'
                  type="date"
                  name="dataFim"
                  value={formData.dataFim}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group left-group">
              <label>
                Tipo de Pesquisa:
                <select
                  name="tipoPesquisa"
                  value={formData.tipoPesquisa}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled hidden>
                    Selecione...
                  </option>
                  <option value="TCC">TCC</option>
                  <option value="PSIC">PSIC</option>
                  <option value="PBIC">PBIC</option>
                  <option value="Mestrado">Mestrado</option>
                  <option value="Outro">Outro</option>
                </select>
              </label>
            </div>
            <div className="form-group right-group">
              <label>
                Propriedade Intelectual:
                <select
                  name="propriedadeIntelectual"
                  value={formData.propriedadeIntelectual}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled hidden>
                    Selecione...
                  </option>
                  <option value="desenhoIndustrial">Desenho Industrial</option>
                  <option value="registroSoftware">Registro de Software</option>
                  <option value="patente">Patente</option>
                </select>
              </label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group left-group">
              <label>
                Link do Projeto:
                <input
                  className='input-form'
                  type="text"
                  name="linkProjeto"
                  value={formData.linkProjeto}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="form-group right-group">
              <label>
                Tipo de Link:
                <select
                  name="tipoLink"
                  value={formData.tipoLink}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled hidden>
                    Selecione...
                  </option>
                  <option value="paginaWeb">Página Web</option>
                  <option value="appStore">Aplicativo</option>
                  <option value="outro">Outro</option>
                </select>
              </label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>
                Descrição Breve do Projeto:
                <textarea
                  className='textArea-form'
                  name="descricaoProjeto"
                  value={formData.descricaoProjeto}
                  onChange={handleChange}
                  maxLength={550}
                  rows={4}
                  required
                />
                <div id="warning" style={{ color: warning.color }}>
                  {warning.message}
                </div>
              </label>
            </div>
          </div>
          <label htmlFor="file-upload" className="file-input-label">
            <span>
              {'Selecione um arquivo PDF ou DOC'}
            </span>
            <div/>
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              className="file-input"
              onChange={handleFileChange}
            />
          </label>
          <button className='Button-project' type="submit">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterProject;