import React, { useState, useEffect } from "react";

export default function ProductForm({ onSubmit, product, show, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    status: 1,
    stock_quantity: ""
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e) => {
    const status = Number(e.target.value);
    setFormData(prev => ({
      ...prev,
      status,
      stock_quantity: status === 1 ? prev.stock_quantity : 0
    }));
  };

  const validate = () => {
    if (!formData.name) return alert("Nome é obrigatório");
    if (isNaN(Number(formData.price))) return alert("Preço inválido");
    if (formData.status === 1 && (isNaN(Number(formData.stock_quantity)) || formData.stock_quantity === "")) {
      return alert("Quantidade inválida");
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const payload = {
        ...formData,
        stock_quantity: formData.status === 1 ? Number(formData.stock_quantity) : 0
      };
      onSubmit(payload);
    }
  };

  return (
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
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {product ? "Editar Produto" : "Novo Produto"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nome*</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Nome do produto" 
                  required 
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">Descrição</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  placeholder="Descrição do produto" 
                />
              </div>

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
                    onChange={handleChange} 
                    placeholder="0.00" 
                    required 
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleStatusChange}
                >
                  <option value={1}>Em estoque</option>
                  <option value={2}>Em reposição</option>
                  <option value={3}>Em falta</option>
                </select>
              </div>

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
                  onChange={handleChange}
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

              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary btn-lg">
                  {product ? "Atualizar" : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}