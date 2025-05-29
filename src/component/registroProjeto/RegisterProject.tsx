import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2';

import { db } from '../../config/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

import { IForm } from '../../models/Form';

import './RegisterProject.css'

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
/*   const [images, setImages] = useState<File[]>([]);  */
  const [urlFile] = useState<string>("");

  const [warning, setWarning] = useState({ message: '', color: '' });
  const navigate = useNavigate();

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

/*   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setImages(filesArray);
    }
  }; */

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  Swal.fire({
    title: 'Enviando cadastro de projeto...',
    text: 'Por favor, aguarde enquanto salvamos seu projeto.',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    const projetoRef = doc(collection(db, "projetos"));
    const projetoID = idProjeto || projetoRef.id;

    let urlFileStorage = urlFile;

    if (file) {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });

      const apiResponse = await fetch('http://localhost:3333/base64-to-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projetoID: projetoID,
          base64: base64,
          filename: file.name
        })
      });

      const result = await apiResponse.json();
      urlFileStorage = `/uploads/${projetoID}/${file.name}`;
    }

    const projetoData: IForm = {
      idProjeto: projetoID,
      titulo: tituloProjeto,
      etapa: etapaProjeto,
      categoriaProjeto: categoriaProjeto,
      dataInicio: dataInicio, // <-- Salva diretamente no formato YYYY-MM-DD
      dataFim: dataFim,       // <-- Mesmo formato do input
      tipoPesquisa: tipoPesquisa,
      propriedadeIntelectual: propriedadeIntelectual,
      linkProjeto: linkProjeto,
      tipoLink: tipoDeLink,
      descricaoProjeto: descricaoProjeto,
      urlFile: urlFileStorage,
    };

    await setDoc(projetoRef, projetoData);

    Swal.fire({
      title: 'Sucesso!',
      text: 'Projeto cadastrado com sucesso!',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      navigate('/projetos');
    });

  } catch (error) {
    console.error('Erro ao cadastrar projeto:', error);
    await Swal.fire({
      title: 'Erro!',
      text: 'Ocorreu um erro ao cadastrar o projeto. Tente novamente.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
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
                  <option value="Em Planejamento">Projeto em Planejamento</option>
                  <option value="Em Desenvolvimento">Em Desenvolvimento</option>
                  <option value="Em Publicação">Em Publicação</option>
                  <option value="Esperando Registro">
                    Aguardando Registro de Software
                  </option>
                  <option value="Concluído">Concluído</option>
                  <option value="Cancelado">Cancelado</option>
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
                Data de Início(M/D/A):
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
                Data de Fim(M/D/A):
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
                  <option value="Desenho Industrial">Desenho Industrial</option>
                  <option value="Registro de Software">Registro de Software</option>
                  <option value="Patente">Patente</option>
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
                  <option value="Página Web">Página Web</option>
                  <option value="Aplicativo">Aplicativo</option>
                  <option value="Outro">Outro</option>
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
              required
            />
{/*             <input
              id="image-upload"
              type="file"
              accept=".jpeg, .png, .jpg"
              className="image-input"
              onChange={handleImageChange}
              multiple
              required
            /> */}
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