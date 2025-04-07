// __tests__/Products.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Products from '../pages/Products';
import { BrowserRouter } from 'react-router-dom';
import api from '../services/api';

jest.mock('../services/api');

jest.mock('sweetalert2', () => ({
    fire: jest.fn(() => Promise.resolve({ isConfirmed: true }))
  }));
  

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Página de Produtos', () => {
  const mockProducts = [
    {
      id: 1,
      name: 'Produto Teste',
      description: 'Descrição do produto',
      price: 50,
      status: 1,
      stock_quantity: 10
    }
  ];

  beforeEach(() => {
    api.post.mockResolvedValueOnce({ data: { data: mockProducts } });
  });

  test('renderiza lista de produtos', async () => {
    renderWithRouter(<Products />);
    expect(await screen.findByText('Produto Teste')).toBeInTheDocument();
  });

  test('abre e fecha modal de novo produto', async () => {
    renderWithRouter(<Products />);
    const btnNovo = await screen.findByText(/novo produto/i);
    fireEvent.click(btnNovo);
    expect(await screen.findByText(/salvar/i)).toBeInTheDocument();

    const btnFechar = screen.getByLabelText('Fechar');
    fireEvent.click(btnFechar);
    await waitFor(() => {
      expect(screen.queryByText(/salvar/i)).not.toBeInTheDocument();
    });
  });

  test('exclui produto com confirmação', async () => {
    window.confirm = jest.fn(() => true);
    api.delete.mockResolvedValueOnce();
    renderWithRouter(<Products />);
    const btnExcluir = await screen.findByRole('button', { name: /excluir/i });
    fireEvent.click(btnExcluir);
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/product/delete', { data: { id: 1 } });
    });
  });

  test('logout remove token e redireciona', async () => {
    Storage.prototype.removeItem = jest.fn();
    renderWithRouter(<Products />);
    const btnLogout = await screen.findByRole('button', { name: /sair/i });
    fireEvent.click(btnLogout);
    // Espera a confirmação do SweetAlert e continua
    await waitFor(() => {
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });
});
