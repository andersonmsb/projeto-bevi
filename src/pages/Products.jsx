import React, { useEffect, useState } from "react";
import api from "../services/api";
import ProductForm from "../components/ProductForm";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // inicio buscar lista de produtos
  const fetchProducts = () => {
    api.post("/product/list")
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.error(err));
  };
  // fim buscar lista de produtos

  // inicio carregar dados
  useEffect(() => {
    fetchProducts();
  }, []);
  // fim carregar dados

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

  // inicio função deslogar usuario e alerta
  const userLogout = () => {
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
  // fim função deslogar usuario e alerta

  // inicio função criar produto e alerta
  const productCreate = (data) => {
    const nomeExiste = products.some(
      (p) => p.name.trim().toLowerCase() === data.name.trim().toLowerCase()
    );
  
    if (nomeExiste) {
      centerAlert(
        'warning',
        'Nome duplicado!',
        'Já existe um produto com esse nome.'
      );
      return;
    }
  
    api.post("/product/create", data)
      .then(() => {
        centerAlert(
          'success',
          'Sucesso!',
          'Produto criado com sucesso!'
        );
        fetchProducts();
        setShowModal(false);
      })
      .catch(() => {
        centerAlert(
          'error',
          'Erro',
          'Falha ao criar produto'
        );
      });
  };
  // fim função criar produto e alerta

  // inicio função atualiza produto e alerta
  const productUpdate = (data) => {
    const nomeExiste = products.some(
      (p) =>
        p.name.trim().toLowerCase() === data.name.trim().toLowerCase() &&
        p.id !== data.id // Ignora o próprio produto que está sendo editado
    );
  
    if (nomeExiste) {
      centerAlert(
        'warning',
        'Nome duplicado!',
        'Já existe outro produto com esse nome.'
      );
      return;
    }
  
    api.put("/product/update", data)
      .then(() => {
        centerAlert(
          'success',
          'Sucesso!',
          'Produto atualizado com sucesso!'
        );
        setEditing(null);
        setShowModal(false);
        fetchProducts();
      })
      .catch(() => {
        centerAlert(
          'error',
          'Erro',
          'Falha ao atualizar produto'
        );
      });
  };  
  // fim função atualiza produto e alerta

  // inicio função deleta produto e alerta
  const productDelete = (id) => {
    Swal.fire({
      position: 'center',
      title: 'Tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete("/product/delete", { data: { id } })
          .then(() => {
            centerAlert(
              'success',
              'Excluído!',
              'O produto foi excluído.'
            );
            setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
          })
          .catch(() => {
            centerAlert(
              'error',
              'Erro',
              'Falha ao excluir produto'
            );
            fetchProducts();
          });
      }
    });
  };
  // fim função deleta produto e alerta

  // inicio função atualizar quantidade do estoque
  const updateStock = (product, newQuantity) => {
    const updatedProduct = { ...product, stock_quantity: newQuantity };

    api.put("/product/update", updatedProduct)
      .then(() => {
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === product.id ? { ...p, stock_quantity: newQuantity } : p
          )
        );
      })
      .catch(() => {
        centerAlert("error", "Erro", "Falha ao atualizar estoque");
      });
  };
// fim função atualizar quantidade do estoque


  // inicio abre modal
  const openModal = (product = null) => {
    setEditing(product);
    setShowModal(true);
  };
  // fim abre modal

  // inicio fecha modal
  const closeModal = () => {
    setEditing(null);
    setShowModal(false);
  };
  // fim fecha modal

  return (
    <div className="container-fluid d-flex flex-column min-vh-100 px-0">
      {/*inicio Cabeçalho */}
      <div className="container d-flex justify-content-end gap-2 my-2 px-3">
        <button onClick={() => navigate("/usuario")} className="btn btn-outline-primary btn-sm">
          <i className="bi bi-person me-1"></i>Início
        </button>
        <button onClick={userLogout} className="btn btn-outline-danger btn-sm">
          <i className="bi bi-box-arrow-right me-1"></i>Sair
        </button>
      </div>
      {/*fim Cabeçalho */}

      {/* inicio titulo*/}
      <header className="text-center my-3 px-3">
        <h1 className="fw-bold">Gestão de Produtos</h1>
      </header>
       {/* fim titulo*/}

     
      <main className="flex-grow-1 d-flex flex-column justify-content-center px-3">
       
        <div className=" container container-fluid px-0">
          {/* inicio botão novo produto */}
          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <div className="d-flex gap-2">
              <button onClick={() => openModal()} className="btn btn-primary btn-sm">
                <i className="bi bi-plus-lg me-1"></i>Novo Produto
              </button>
            </div>
          </div>
          {/* fim botão novo produto*/}

          {/*inicio tabela */}
          <div className="card shadow">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover m-0">
                  {/* inicio cabeçalho*/}
                  <thead>
                    <tr className="text-center">
                      <th>Nome</th>
                      <th className="d-none d-sm-table-cell">Descrição</th>
                      <th>Preço</th>
                      <th>Status</th>
                      <th className="d-none d-sm-table-cell">Estoque</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  {/* fim cabeçalho*/}
                  <tbody>
                    {products.length > 0 ? (
                      products.map((p) => (
                        <tr className="text-center" key={p.id}>
                          <td><strong>{p.name}</strong></td>
                          <td className="d-none d-sm-table-cell">{p.description}</td>
                          <td>R$ {p.price}</td>
                          {/* inicio status e muda de cor*/}
                          <td>
                            <span style={{
                                color: 
                                p.status === 1 ? 'green' :
                                p.status === 2 ? '#FFA500' : 
                                'red',
                                fontWeight: 'bold'
                                }}>
                              {p.status === 1 ? 'Em estoque' : p.status === 2 ? 'Em reposição' : 'Em falta'}
                            </span>
                          </td>
                          {/* fim status e muda de cor*/}
                          
                          {/* inicio estoque */}
                          <td className="d-none d-sm-table-cell">
                            {p.status === 1 ? (
                              <div className="d-flex justify-content-center align-items-center gap-1">
                                {/* inicio botão decremento */}
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => updateStock(p, p.stock_quantity - 1)}
                                  disabled={p.stock_quantity <= 0}
                                >
                                  <i className="bi bi-dash"></i>
                                </button>
                                {/* fim botão decremento */}
                                <span className="mx-2 fw-bold">{p.stock_quantity}</span>
                                {/* inicio botão incremento */}
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => updateStock(p, p.stock_quantity + 1)}
                                >
                                  <i className="bi bi-plus"></i>
                                </button>
                                {/* fim botão incremento */}
                              </div>
                            ) : (
                              <span className="text-muted">0</span>
                            )}
                          </td>
                          {/* fim estoque*/}

                          {/* inicio botões de ação*/}
                          <td>
                            <div className="d-flex justify-content-center gap-1">
                              <button onClick={() => openModal(p)} className="btn btn-sm btn-warning">
                                <i className="bi bi-pencil"></i>
                                <span className="d-none d-sm-inline ms-1">Editar</span>
                              </button>
                              <button onClick={() => productDelete(p.id)} className="btn btn-sm btn-danger">
                                <i className="bi bi-trash"></i>
                                <span className="d-none d-sm-inline ms-1">Excluir</span>
                              </button>
                            </div>
                          </td>
                          {/* fim botões de ação*/}
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
          {/* fim tabela */}
        </div>
      </main>

      {/*inicio Modal */}
      <ProductForm
        show={showModal}
        onClose={closeModal}
        onSubmit={editing ? productUpdate : productCreate}
        product={editing}
      />
      {/*fim Modal */}
    </div>
  )
}