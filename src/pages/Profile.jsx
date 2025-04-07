import React, { useEffect, useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [productCount, setProductCount] = useState(0);


  // inicio alerta estilizado centralizado
  const centerAlert = (icon, title, text) => {
      Swal.fire({
        position: 'center',
        icon,
        title,
        text,
        showConfirmButton: true,
        confirmButtonColor: '#3085d6',
      });
    };
    // fim alerta estilizado centralizado

  // inicio alerta deslogar 
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
          centerAlert(
            'success',
            'Desconectado!',
            'Você foi desconectado com sucesso.'
          );
        }
      });
    };
    // fim alerta deslogar 

  // inicio verifica autenticação
  useEffect(() => {
    api.post("/auth/me")
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  
    // Buscar produtos para contar
    api.post("/product/list")
      .then((res) => setProductCount(res.data.data.length))
      .catch((err) => console.error(err));
  }, []);
  
  // fim verifica autenticação


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
      {/*Inicio titulo */}
      <h2 className="fw-bold">Bem-vindo {user.name}</h2>
      {/*fim titulo */}
      <h5 className="mb-5">Gerencie seus produtos, controle seu estoque e muito mais, <br/> de forma fácil e rápida.</h5>

      {/* Card Total de Produtos */}
      <div className="card shadow text-center mb-4 w-50 mx-auto">
        <div className="card-body">
          <h5 className="card-title fw-bold">Total de Produtos</h5>
          <p className="fs-3 m-0">{productCount}</p>
        </div>
      </div>


      {/*Inicio button */}
      <div>
        <button type="submit" className="btn btn-primary btn-lg fw-bold" onClick={() => navigate("/produtos")}>
          <i className="bi bi-bag me-2"></i>Acessar Produtos
        </button>
      </div>
      {/*fim button */}
    </div>
    {/*Fim Conteúdo centralizado */}
  </div>
  ) : (
    <p className="container d-flex justify-content-center align-items-center vh-100">Carregando...</p>
  );
}
