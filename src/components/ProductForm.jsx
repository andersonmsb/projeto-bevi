import React, { useState, useEffect } from "react";

export default function ProductForm({ onSubmit, product, show, onClose }) {
  // inicio gerencia de dados formulario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    status: 1,
    stock_quantity: ""
  });
  // fim gerencia de dados formulario

  // inicio sincronização dados do formulario
  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        stock_quantity: product.status !== 1 ? 0 : product.stock_quantity
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        status: 1,
        stock_quantity: ""
      });
    }
  }, [product, show]);
  // fim sincronização dados do formulario

  // inicio atualização do formulario quando for alterado
  const makeChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  // fim atualização do formulario quando for alterado

  // inicio controla status do produto
  const statusChange = (e) => {
    const status = Number(e.target.value);
    setFormData(prev => ({
      ...prev,
      status,
      stock_quantity: status === 1 ? prev.stock_quantity : 0
    }));
  };
  // fim controla status do produto

  // inicio validação formulario
  const validate = () => {
    if (!formData.name) return alert("Nome é obrigatório");
    if (isNaN(Number(formData.price))) return alert("Preço inválido");
    if (formData.status === 1 && (isNaN(Number(formData.stock_quantity)) || formData.stock_quantity === "")) {
      return alert("Quantidade inválida");
    }
    return true;
  };
  // fim validação formulario

  // inicio verificação se dados estão corretos
  const makeSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const payload = {
        ...formData,
        stock_quantity: formData.status === 1 ? Number(formData.stock_quantity) : 0
      };
      onSubmit(payload);
    }
  };
  // fim verificação se dados estão corretos

  return (

    // inicio modal cadastrar produto
    <div className={`modal fade ${show ? "show d-block" : ""}`} style={{
      display: show ? 'flex' : 'none',       
      alignItems: 'center',                 
      justifyContent: 'center',             
      backgroundColor: 'rgba(0,0,0,0.5)',   
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1050
      }}>
      {/* inicio centraliza modal*/}
      <div className="modal-dialog modal-dialog-centered modal-lg">
        
        {/* inicio adiciona fundo do modal */}
        <div className="modal-content">

          {/* inicio header modal */}
          <div className="modal-header">
            {/* inicio titulo modal */}
            <h5 className="modal-title border-primary">
              {product ? "Editar Produto" : "Novo Produto"}
            </h5>
            {/* fim titulo modal */}

            {/* inicio botão fechar */}
            <button type="button" className="btn-close" onClick={onClose}></button>
            {/* fim botão fechar */}
          </div>
          {/* fim header modal */}
          
          <div className="modal-body">
            {/* inicio formulario */}
            <form onSubmit={makeSubmit}>
              {/* inicio nome formulario */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nome*</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={makeChange} 
                  placeholder="Nome do produto" 
                  required 
                />
              </div>
              {/* fim nome formulario */}

              {/* inicio descrição formulario */}
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Descrição</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={makeChange} 
                  placeholder="Descrição do produto" 
                />
              </div>
              {/* fim descrição formulario */}

              {/* inicio preço formulario */}
              <div className="mb-3">
                <label htmlFor="price" className="form-label">Preço*</label>
                <div className="input-group">
                  <span className="input-group-text">R$</span>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="price" 
                    name="price" 
                    value={formData.price} 
                    onChange={makeChange} 
                    placeholder="0.00" 
                    required 
                  />
                </div>
              </div>
              {/* fim preço formulario */}

              {/* inicio status produto */}
              <div className="mb-3">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={statusChange}
                >
                  <option value={1}>Em estoque</option>
                  <option value={2}>Em reposição</option>
                  <option value={3}>Em falta</option>
                </select>
              </div>
              {/* fim status produto */}

              {/* inicio quantidade do estoque */}
              <div className="mb-4">
                <label htmlFor="stock_quantity" className="form-label">
                  Quantidade em Estoque
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="stock_quantity"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={makeChange}
                  disabled={formData.status !== 1}
                  required={formData.status === 1}
                  min="0"
                />
                {formData.status !== 1 && (
                  <small className="text-muted">
                    Quantidade automaticamente definida como 0 para produtos em reposição ou em falta
                  </small>
                )}
              </div>
              {/* fim quantidade do estoque */}

              {/* inicio button atualizar/cadastrar */}
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary btn-lg">
                  {product ? "Atualizar" : "Cadastrar"}
                </button>
              </div>
              {/* fim button atualizar/cadastrar */}
            </form>
            {/* fim formulario */}
          </div>
        </div>
        {/* fim adiciona fundo do modal */}
      </div>
      {/* fim centraliza modal*/}
    </div>
     // fim modal cadastrar produto
  );
}