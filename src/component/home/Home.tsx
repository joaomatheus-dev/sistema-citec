import React from 'react'
import './Home.css'
import { useNavigate } from 'react-router';

const Home = () => {  
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/agendamento')
  }

  return (  
    <div>
      <div>
        <img src={require('../../assets/imgs/RapazComputador.png')} />
      </div>
      <div>
        <h1 className='text-blue'>Conheça o CITEC</h1>
        <h2>O Centro de Inovação Tecnológica do Cesmac é o lugar onde ideias ganham vida. Aqui, alunos e professores de diversas áreas trabalham juntos no desenvolvimento de soluções inovadoras, explorando robótica, inteligência artificial, realidade virtual, aplicativos, simuladores e protótipos. Com um ambiente moderno e equipamentos de última geração – como servidores avançados, impressoras 3D, cortadoras a laser e óculos de realidade virtual –, oferecemos tudo o que você precisa para pesquisar, experimentar e criar o futuro.</h2>
      </div>
      <button onClick={handleClick} className='button'>Agende uma visita agora!</button>
      <div className='container-inovacao'>
        <h1 className='text-white'>Inovação a serviço da sociedade</h1>
        <img className='foto-membros' src={require('../../assets/imgs/MembrosRobotica.jpg')} />
        <h2 className='h2-text-white'>O Centro de Inovação Tecnológica do Cesmac é o lugar onde ideias ganham vida. Aqui, alunos e professores de diversas áreas trabalham juntos no desenvolvimento de soluções inovadoras, explorando robótica, inteligência artificial, realidade virtual, aplicativos, simuladores e protótipos. Com um ambiente moderno e equipamentos de última geração – como servidores avançados, impressoras 3D, cortadoras a laser e óculos de realidade virtual –, oferecemos tudo o que você precisa para pesquisar, experimentar e criar o futuro.</h2>
      </div>
      <div>
        <h1 className='text-blue'>Tecnologia que transforma vidas</h1>
      </div>
    </div> 
  )
}

export default Home