import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { useNavigate } from 'react-router';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import './Projects.css';

function Projects() {
  const [documents, setDocuments] = useState<{
    id: string;
    titulo?: string;
    descricaoProjeto?: string;
    etapa?: string;
    timestamp?: number;
    urlFile?: string;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();

  const getFilenameFromUrl = (urlFile: string) => {
    return urlFile.substring(urlFile.lastIndexOf('/') + 1);
  };

  const handleDownload = async (projetoID: string, filename: string) => {
    try {
      const response = await fetch(`http://localhost:3333/download/${projetoID}/${filename}`);

      if (!response.ok) {
        throw new Error('Erro ao baixar arquivo');
      }

      const data = await response.json();

      const link = document.createElement('a');
      link.href = data.base64;
      link.setAttribute('download', data.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error(error);
      alert('Falha ao baixar arquivo');
    }
  };

    
    const handleDelete = async (projetoID: string, urlFile?: string) => {
      if (!window.confirm('Tem certeza que deseja deletar este projeto e seu arquivo?')) return;

      try {
        // Deleta o documento do Firestore
        await deleteDoc(doc(db, 'projetos', projetoID));

        // Deleta o arquivo na API se existir
        if (urlFile) {
          const filename = getFilenameFromUrl(urlFile);
          const response = await fetch(`http://localhost:3333/delete-file/${projetoID}/${filename}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Erro ao deletar arquivo na API');
          }
        }

        alert('Projeto e arquivo deletados com sucesso!');
        fetchDocuments(); // Atualiza a lista de projetos
      } catch (error) {
        console.error(error);
        alert('Falha ao deletar projeto e arquivo.');
      }
    };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'projetos'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDocuments(data);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar os projetos.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    navigate('/editarprojeto/' + id);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  if (error) return <div>{error}</div>;

  return (
    <div>
      {documents.map((doc) => {
        const filename = doc.urlFile ? getFilenameFromUrl(doc.urlFile) : null;
        return (
          <div key={doc.id} className="div-container">
            <h1 className="header-row">{doc.titulo || 'Sem título'}</h1>
            <h2>{doc.etapa || 'Sem etapa'}</h2>
            <p>{doc.descricaoProjeto || 'Sem descrição'}</p>

            {user && (
              <>
                <button onClick={() => handleEdit(doc.id)}>Editar</button>
                {filename && (
                  <button onClick={() => handleDownload(doc.id, filename)}>
                    Download Doc do Projeto
                  </button>
                )}
                <button className="button-delete" onClick={() => handleDelete(doc.id, doc.urlFile)}>Deletar</button>
              </>
            )}
          </div>
        );
      })}
      {loading && <div>Carregando...</div>}
    </div>
  );
}

export default Projects;
