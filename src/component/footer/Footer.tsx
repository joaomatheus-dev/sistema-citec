import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <div className='footer-style'>
      <div className='footer-column'>
        <h3>Contato<br/><br/></h3>
        <img/>
        <h4>(82) 98835-9601<br/><br/></h4>
        <img/>
        <h4>mozart.melo@cesmac.edu.br</h4>
      </div>
      <div className='footer-column'>
        <img className='small-logo' src={require('../../assets/imgs/logoCitec.png')} />
        <h4 className='adress-font'>Rua Alto da Vitória, 609-Farol,<br/>Maceió-AL, CEP: 57051-165</h4>
      </div>
      <div className='footer-column'>
        <h3>Redes Sociais<br/><br/></h3>
        <img/>
        <h4>Robotica & CITEC Cesmac<br/><br/></h4>
        <img/>
        <h4>@roboticacesmac</h4>
      </div>
    </div>
  )
}

export default Footer