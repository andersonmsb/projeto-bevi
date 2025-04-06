import React, { useEffect, useState } from "react";
import api from "../services/api";
import ProductForm from "../components/ProductForm";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = () => {
    api.post("/product/list")
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.error(err)); // Removida a mensagem de erro
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      confirmButtonText: 'Sim, sair!',
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

  const handleCreate = (data) => {
    api.post("/product/create", data)
      .then(() => {
        showCenteredAlert(
          'success',
          'Sucesso!',
          'Produto criado com sucesso!'
        );
        fetchProducts();
        setShowModal(false);
      })
      .catch(() => {
        showCenteredAlert(
          'error',
          'Erro',
          'Falha ao criar produto'
        );
      });
  };

  const handleUpdate = (data) => {
    api.put("/product/update", data)
      .then(() => {
        showCenteredAlert(
          'success',
          'Sucesso!',
          'Produto atualizado com sucesso!'
        );
        setEditing(null);
        setShowModal(false);
        fetchProducts();
      })
      .catch(() => {
        showCenteredAlert(
          'error',
          'Erro',
          'Falha ao atualizar produto'
        );
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      position: 'center',
      title: 'Tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete("/product/delete", { data: { id } })
          .then(() => {
            showCenteredAlert(
              'success',
              'Excluído!',
              'O produto foi excluído.'
            );
            setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
          })
          .catch(() => {
            showCenteredAlert(
              'error',
              'Erro',
              'Falha ao excluir produto'
            );
            fetchProducts();
          });
      }
    });
  };

  const openModal = (product = null) => {
    setEditing(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditing(null);
    setShowModal(false);
  };

  return (
    <div className="container-fluid d-flex flex-column min-vh-100">
      {/* Cabeçalho */}
      {/* Botão Sair flutuante no topo direito */}
      <div className="position-absolute top-0 end-0 m-4">
        <button 
          onClick={handleLogout}
          className="btn btn-outline-danger"
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Sair
        </button>
      </div>
      <header className="text-center my-4 mt-4">
        <h1 className="display-6 fw-bold">Gestão de Produtos</h1>
      </header>

      {/* Área Principal */}
      <main className="flex-grow-1 d-flex flex-column justify-content-center">
        {/* Container da Tabela */}
        <div className="container">
          {/* Botões */}
          <div className="d-flex justify-content-between mb-3">
            <div></div> {/* Espaço vazio para alinhamento */}
            <div className="d-flex gap-2">
              <button 
                onClick={() => openModal()}
                className="btn btn-primary"
              >
                <i className="bi bi-plus-lg me-2"></i>
                Novo Produto
              </button>
            </div>
          </div>

          {/* Tabela */}
          <div className="card shadow">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-hover m-0">
                  <thead>
                    <tr className="text-center">
                      <th>Nome</th>
                      <th>Descrição</th>
                      <th>Preço</th>
                      <th>Status</th>
                      <th>Estoque</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map((p) => (
                        <tr className="text-center" key={p.id}>
                          <td><strong>{p.name}</strong></td>
                          <td>{p.description}</td>
                          <td>R$ {p.price}</td>
                          <td>{p.status === 1 ? 'Em estoque' : p.status === 2 ? 'Em reposição' : 'Em falta'}</td>
                          <td>{p.stock_quantity}</td>
                          <td>
                            <button 
                              onClick={() => openModal(p)}
                              className="btn btn-sm btn-warning me-2"
                            >
                              <i className="bi bi-pencil me-1"></i> Editar
                            </button>
                            <button 
                              onClick={() => handleDelete(p.id)}
                              className="btn btn-sm btn-danger"
                            >
                              <i className="bi bi-trash me-1"></i> Excluir
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <div className="text-muted">
                            Nenhum produto cadastrado
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      <ProductForm
        show={showModal}
        onClose={closeModal}
        onSubmit={editing ? handleUpdate : handleCreate}
        product={editing}
      />
    </div>
  );
}