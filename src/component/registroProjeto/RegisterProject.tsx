import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2';

import { db, storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';
import { collection, doc, setDoc } from 'firebase/firestore';

import { IForm } from '../../models/Form';

import './RegisterProject.css'
import { link } from 'fs';

function RegisterProject() {
  const [idProjeto, setIDProjeto] = useState<string>("");
  const [tituloProjeto, setTituloProjeto] = useState<string>('')
  const [etapaProjeto, setEtapaProjeto] = useState<string>('')
  const [categoriaProjeto, setCategoriaProjeto] = useState<string>('')
  const [dataInicio, setDataIncio] = useState<string>('')
  const [dataFim, setDataFim] = useState<string>('')
  const [tipoPesquisa, setTipoPesquisa] = useState<string>('')
  const [propriedadeIntelectual, setPropriedadeIntelectual] = useState<string>('')
  const [linkProjeto, setLinkProjeto] = useState<string>('')
  const [tipoDeLink, setTipoDeLink] = useState<string>('')
  const [descricaoProjeto, setDescricaoProjeto] = useState<string>('')
  const [file, setFile] = useState<File | null>(null);

  const [warning, setWarning] = useState({ message: '', color: '' });
  const navigate = useNavigate();
  const storage = getStorage();

  const dataInicioBr = new Date(dataInicio).toLocaleDateString('pt-BR'); 
  const dataFimBr = new Date(dataFim).toLocaleDateString('pt-BR');

  function checkDescription(){
    if(descricaoProjeto.length === 550){
      setWarning({
        message: 'Limite máximo de 550 caracteres atingido!',
        color: 'red',
      });
    }else if(descricaoProjeto.length >= 500 && descricaoProjeto.length < 550){
      setWarning({
        message: 'Você está próximo do limite máximo de 550 caracteres!',
        color: 'orange',
      });
    } else {
      setWarning({ message: '', color: '' });
    }
  };

  useEffect(() => {
    checkDescription();
  }, [descricaoProjeto]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit= async (e: React.MouseEvent<HTMLButtonElement>) =>{
    e.preventDefault();
    
    Swal.fire({
      title: 'Enviando cadastro de projeto...',
      text: 'Por favor, aguarde enquanto salvamos seu projeto.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    try{
      let projetoID  = idProjeto

      if (projetoID === "")
        projetoID = doc(collection(db,"Projetos")).id;

      let projeto: IForm = {
        idProjeto: projetoID,
        titulo: tituloProjeto,
        etapa: etapaProjeto,
        categoriaProjeto: categoriaProjeto,
        dataInicio: dataInicioBr,
        dataFim: dataFimBr,
        tipoPesquisa: tipoPesquisa,
        propriedadeIntelectual: propriedadeIntelectual,
        linkProjeto: linkProjeto,
        tipoLink: tipoDeLink,
        descricaoProjeto: descricaoProjeto,
        urlFile: urlFileStorage,
      }


      await setDoc(doc(db, "projetos", projetoID), projeto, {merge : true})
      navigate('/projetos')
    }catch(error){
      await Swal.fire({
        title: 'Erro!',
        text: 'Ocorreu um erro ao cadastrar o projeto. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }finally{
      Swal.close();
    }
  }

  return (
    <div className='background-login-register'>
      <div className="App-form">
        <form className="Formulario">
          <h1>Cadastro de Projeto</h1>
          <div className="form-row">
            <div className="form-group left-group">
              <label>
                Título do Projeto:
                <input
                  className='input-form'
                  type="text"
                  name="titulo"
                  value={tituloProjeto}
                  onChange={(event) => setTituloProjeto(event.target.value)}
                  required
                />
              </label>
            </div>
            <div className="form-group right-group">
              <label>
                Etapa:
                <select
                  name="etapa"
                  value={etapaProjeto}
                  onChange={(event) => setEtapaProjeto(event.target.value)}
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
                  value={categoriaProjeto}
                  onChange={(event) => setCategoriaProjeto(event.target.value)}
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
                  value={dataInicio}
                  onChange={(event)=> setDataIncio(event.target.value)}
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
                  value={dataFim}
                  onChange={(event) => setDataFim(event.target.value)}
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
                  value={tipoPesquisa}
                  onChange={(event) => setTipoPesquisa(event.target.value)}
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
                  value={propriedadeIntelectual}
                  onChange={(event) => setPropriedadeIntelectual(event.target.value)}
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
                  value={linkProjeto}
                  onChange={(event) => setLinkProjeto(event.target.value)}
                />
              </label>
            </div>
            <div className="form-group right-group">
              <label>
                Tipo de Link:
                <select
                  name="tipoLink"
                  value={tipoDeLink}
                  onChange={(event) => setTipoDeLink(event.target.value)}
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
                  value={descricaoProjeto}
                  onChange={(event) => setDescricaoProjeto(event.target.value)}
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
          <button className='Button-project' onClick={handleSubmit} type="submit">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterProject;