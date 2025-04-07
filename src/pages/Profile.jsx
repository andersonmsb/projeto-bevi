import React, { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const showCenteredAlert = (icon, title, text) => {
      Swal.fire({
        position: 'center',
        icon,
        title,
        text,
        showConfirmButton: true,
        confirmButtonColor: '#3085d6',
      });
    };

  const handleLogout = () => {
      Swal.fire({
        position: 'center',
        title: 'Tem certeza?',
        text: "Você será desconectado do sistema",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("token");
          navigate("/");
          showCenteredAlert(
            'success',
            'Desconectado!',
            'Você foi desconectado com sucesso.'
          );
        }
      });
    };

  useEffect(() => {
    api.post("/auth/me")
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);


  return user ? (

   
    <div className="container position-relative d-flex justify-content-center align-items-center vh-100 flex-column">
    {/* Inicio Botão Sair no topo direito */}
    <div className="position-absolute top-0 end-0 p-3">
      <button onClick={handleLogout} className="btn btn-outline-danger">
        <i className="bi bi-box-arrow-right me-1"></i>Sair
      </button>
    </div>
    {/* Fim Botão Sair no topo direito */}
  
    {/*Inicio Conteúdo centralizado */}
    <div className="text-center">
      <h2 className="fw-bold mb-4">Bem-vindo, {user.name}</h2>
      <div>
        <button type="submit" className="btn btn-primary btn-lg fw-bold" onClick={() => navigate("/produtos")}>
          <i className="bi bi-bag me-1"></i>Acessar Produtos
        </button>
      </div>
    </div>
    {/*Fim Conteúdo centralizado */}
  </div>
  ) : (
    <p className="container d-flex justify-content-center align-items-center vh-100">Carregando...</p>
  );
}
