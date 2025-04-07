import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

   // inicio autenticação
  const authenticate = async (evento) => {
    evento.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      navigate("/usuario");
    } catch (err) {
      // inicio alerta estilizado erro de login
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Email ou senha inválidos!',
        confirmButtonColor: '#0d6efd',
        background: '#fff',
        color: '#212529',
        customClass: {
          confirmButton: 'btn btn-primary'
        }
      });
      // fim alerta estilizado erro de login
    }
  };
  // fim autenticação

  return (
     // inicio div centralizada
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg" style={{ width: "400px" }}>
        <div className="card-body p-4">
          {/* inicio title login */}
          <h2 className="card-title text-center mb-4 fw-bold">Login</h2>
          {/* fim title login */}

          {/* inicio formulario */}
          <form onSubmit={authenticate}>
            {/* inicio input email*/}
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold">E-mail</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {/* fim input email */}

            {/* inicio input senha */}
            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-bold">Senha</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* fim input senha */}

            {/* inicio button entrar */}
            <div className="d-grid">
              <button type="submit" className="btn btn-primary btn-lg fw-bold">
                Entrar
              </button>
            </div>
            {/* fim button entrar */}
          </form>
           {/* fim formulario */}
        </div>
      </div>
    </div>
     // fim div centralizada
  );
}