import React, { useState, useEffect } from 'react';

import { db } from '../../config/firebase';
import { useNavigate } from 'react-router'
import { collection, getDocs, query } from 'firebase/firestore';

import './Projects.css';

function Projects() {
  const [documents, setDocuments] = useState<{ id: string; titulo?: string; descricaoProjeto?: string; etapa?: string; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    setLoading(true);
      try {
      const q = query(collection(db, 'projetos'));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setDocuments(data);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      setError('Erro ao carregar os projetos.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id:string) => {
    navigate(/editarprojeto/ + id)
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div>
      {documents.map((doc) => (
        <div key={doc.id} className='div-container'>
          <h1 className='header-row'>{doc.titulo || 'Sem título'}</h1>
          <h2>{doc.etapa || "Sem etapa"}</h2>
          <p>{doc.descricaoProjeto || 'Sem descrição'}</p>
          <button onClick={() => handleEdit(doc.id)}>Editar</button>
        </div>
      ))}
      {loading && <div>Carregando...</div>}
    </div>
  );
}

export default Projects;
