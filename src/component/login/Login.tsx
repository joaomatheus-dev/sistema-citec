import React, { useState } from 'react'
import Swal from 'sweetalert2'

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [passwrod, setPassword] = useState<string>("");

  return (
    <div>Login</div>
  )
}

export default Login