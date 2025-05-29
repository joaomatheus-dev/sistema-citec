import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router'
import Swal from 'sweetalert2';

import { db } from '../../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import { IForm } from '../../models/Form';

const API_BASE = 'http://localhost:3333';

const EditarProjeto = () => {
  const { id } = useParams<{ id: string }>();
  
  const [tituloProjeto, setTituloProjeto] = useState<string>('');
  const [etapaProjeto, setEtapaProjeto] = useState<string>('');
  const [categoriaProjeto, setCategoriaProjeto] = useState<string>('');
  const [dataInicio, setDataIncio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [tipoPesquisa, setTipoPesquisa] = useState<string>('');
  const [propriedadeIntelectual, setPropriedadeIntelectual] = useState<string>('');
  const [linkProjeto, setLinkProjeto] = useState<string>('');
  const [tipoDeLink, setTipoDeLink] = useState<string>('');
  const [descricaoProjeto, setDescricaoProjeto] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [urlFile, setUrlFile] = useState<string>('');

  const [warning, setWarning] = useState({ message: '', color: '' });
  const navigate = useNavigate();

  const fetchProjeto = async () => {
    if (!id) return;
    try {
      const docRef = doc(db, "projetos", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTituloProjeto(data.titulo || '');
        setEtapaProjeto(data.etapa || '');
        setCategoriaProjeto(data.categoriaProjeto || '');
        setDataIncio(data.dataInicio || '');
        setDataFim(data.dataFim || '');
        setTipoPesquisa(data.tipoPesquisa || '');
        setPropriedadeIntelectual(data.propriedadeIntelectual || '');
        setLinkProjeto(data.linkProjeto || '');
        setTipoDeLink(data.tipoLink || '');
        setDescricaoProjeto(data.descricaoProjeto || '');
        setUrlFile(data.urlFile || '');
      }
    } catch (error) {
      console.error('Erro ao buscar dados do projeto:', error);
    }
  };

  useEffect(() => {
    fetchProjeto();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const checkDescription = () => {
    if (descricaoProjeto.length === 550) {
      setWarning({ message: 'Limite máximo de 550 caracteres atingido!', color: 'red' });
    } else if (descricaoProjeto.length >= 500) {
      setWarning({ message: 'Você está próximo do limite máximo de 550 caracteres!', color: 'orange' });
    } else {
      setWarning({ message: '', color: '' });
    }
  };

  useEffect(() => {
    checkDescription();
  }, [descricaoProjeto]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Swal.fire({
      title: 'Salvando...',
      text: 'Por favor, aguarde.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const projetoID = id || '';
      let urlFileStorage = urlFile;

      if (file) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = error => reject(error);
          reader.readAsDataURL(file);
        });

        const apiResponse = await fetch(`${API_BASE}/base64-to-pdf`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projetoID,
            base64,
            filename: file.name,
          }),
        });

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text();
          console.error('Erro no upload do arquivo:', errorText);
          throw new Error(`Erro no upload do arquivo: ${errorText}`);
        }

        const result = await apiResponse.json();
        urlFileStorage = result.path;
      }

      const projetoData: IForm = {
        idProjeto: projetoID,
        titulo: tituloProjeto,
        etapa: etapaProjeto,
        categoriaProjeto: categoriaProjeto,
        dataInicio: dataInicio,
        dataFim: dataFim,
        tipoPesquisa: tipoPesquisa,
        propriedadeIntelectual: propriedadeIntelectual,
        linkProjeto: linkProjeto,
        tipoLink: tipoDeLink,
        descricaoProjeto: descricaoProjeto,
        urlFile: urlFileStorage,
        timestamp: Date.now(),
      };

      await setDoc(doc(db, 'projetos', projetoID), projetoData);

      Swal.fire('Sucesso!', 'Projeto atualizado com sucesso.', 'success').then(() => {
        navigate('/projetos');
      });

    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      Swal.fire('Erro!', 'Não foi possível atualizar o projeto.', 'error');
    }
  };

  const handleDownload = () => {
    if (urlFile) {
      const url = `${API_BASE}${urlFile.replace('/uploads', '/download')}`;
      window.open(url, '_blank');
    } else {
      Swal.fire('Atenção', 'Nenhum arquivo disponível para download.', 'info');
    }
  };

  return (
  <div className='background-login-register'>
        <div className="App-form">
          <form className="Formulario" onSubmit={handleSubmit}>
            <h1>Editar projeto {tituloProjeto}</h1>
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
                {'Selecione um arquivo PDF ou DOC Para editar o projeto.(Caso não vá fazer mudanças no arquivo baixe o arquivo atual e reupload ele)'}
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
            {urlFile && (
              <button type="button" onClick={handleDownload} className='Button-project'>
                Download do Arquivo Atual
              </button>
            )}

            <button className='Button-project' type="submit">
              Enviar
            </button>
          </form>
        </div>
      </div>
    )
}

export default EditarProjeto