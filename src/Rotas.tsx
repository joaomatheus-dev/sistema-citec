import React, { useEffect, useState } from 'react'
import { Navigate, Route, RouteProps, Routes } from 'react-router';
import Home from './component/home/Home';
import Login from './component/login/Login';
import Register from './component/register/Register';
import Projects from './component/projetos/Projects';
import Agendamento from './component/agendamento/Agendamento';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import RegisterProject from './component/registroProjeto/RegisterProject';
import EditarProjeto from './component/editarProjeto/EditarProjeto';

function PrivatesRoutes(props: RouteProps){

  const [loadingAuthentication, setLoadingAuthentication] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(()=>{
  const unsign = onAuthStateChanged(getAuth(), (user)=>{
    if(user === null){
      setAuthenticated(false);
    }else{
      setAuthenticated(true);
    }
    setLoadingAuthentication(false);
  });
    return () => {
      unsign();
    };
  }, []);

  if(loadingAuthentication === true){
    return null;
  }else if(authenticated === false){
    getAuth().signOut();
    return <Navigate to= '/'/>;
  }else{
    return<>{props.children}</>
  }
}

const Rotas = () => {
  return (
    <div>
      <Routes>
        <Route path= "/*" element={<Home />} />
        <Route path= "/login/" element ={<Login/>} />
        <Route path= "/projetos" element ={<Projects/>}/>
        <Route path= "/register" element ={<PrivatesRoutes><Register/></PrivatesRoutes>}/>
        <Route path= "/registerproject" element={<PrivatesRoutes><RegisterProject/></PrivatesRoutes>}/>
        <Route path='/editarprojeto/:id' element={<PrivatesRoutes><EditarProjeto/></PrivatesRoutes>}/>
        <Route path = "/agendamento" element={<Agendamento/>} />
      </Routes> 
    </div>
  )
}

export default Rotas