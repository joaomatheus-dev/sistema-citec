import React from 'react'
import './Home.css'
import { Link,  } from 'react-router';

const Home = () => {  
  return (  
    <div>
      <div className='container-conheca'>
        <div className='text-content'>
          <div>
              <h1 className='text-blue'>Conheça o CITEC</h1>
              <h2>O Centro de Inovação Tecnológica do Cesmac é o lugar onde ideias ganham vida. Aqui, alunos e professores de diversas áreas trabalham juntos no desenvolvimento de soluções inovadoras, explorando robótica, inteligência artificial, realidade virtual, aplicativos, simuladores e protótipos. Com um ambiente moderno e equipamentos de última geração – como servidores avançados, impressoras 3D, cortadoras a laser e óculos de realidade virtual –, oferecemos tudo o que você precisa para pesquisar, experimentar e criar o futuro.</h2>
            </div>
            <Link to="/agendamento">
              <button className='button-visita'>Agende uma visita agora!</button>
            </Link>
        </div>
        <img src={require('../../assets/imgs/RapazComputador.png')} />
      </div>
      <div className='container-inovacao'>
        <div className='text-content'>
          <h1 className='text-white'>Inovação a serviço da sociedade</h1>
          <h2 className='h2-text-white'>O Centro de Inovação Tecnológica do Cesmac já desenvolveu diversos projetos de impacto social, como a célula de descontaminação por ozônio, o simulador de centro cirúrgico em realidade virtual e próteses para animais. Também criamos simuladores para situações críticas, como pânico de voo, ressonância magnética e tribunal do júri, além de aplicativos voltados para saúde, educação, combate à violência e bioquímica.<br/> Na área de inteligência artificial, desenvolvemos soluções para medicina, educação e segurança, incluindo reconhecimento facial, de objetos e de voz. Um dos destaques é a chamada inteligente por reconhecimento facial, que identifica automaticamente os alunos em sala de aula.</h2>
          <Link to = "/projetos">
            <button className='button-projetos'>Conheça nossos projetos</button>
          </Link>
        </div>
          <img className='foto-membros' src={require('../../assets/imgs/MembrosRobotica.jpg')} />
      </div>
      <div>
        <h1 className='text-blue'>Tecnologia que transforma vidas</h1>
      </div>
    </div> 
  )
}

export default Home