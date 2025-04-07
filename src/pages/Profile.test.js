import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Profile from './Profile';
import { BrowserRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../services/api';

// Mock da API e navegação
jest.mock('../services/api');
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Profile Component', () => {
  beforeEach(() => {
    Swal.fire.mockClear();
    mockNavigate.mockClear();
  });

  it('exibe "Carregando..." inicialmente', () => {
    api.post.mockReturnValue(new Promise(() => {})); // nunca resolve
    renderWithRouter(<Profile />);
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
  });

  it('exibe dados do usuário após carregamento', async () => {
    api.post.mockResolvedValue({ data: { name: 'João' } });
    renderWithRouter(<Profile />);
    expect(await screen.findByText(/Bem-vindo João/i)).toBeInTheDocument();
    expect(screen.getByText(/Gerencie seus produtos/i)).toBeInTheDocument();
  });

  it('navega para /produtos ao clicar em "Acessar Produtos"', async () => {
    api.post.mockResolvedValue({ data: { name: 'Maria' } });
    renderWithRouter(<Profile />);
    const button = await screen.findByRole('button', { name: /Acessar Produtos/i });
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/produtos');
  });

  it('exibe alerta de confirmação ao clicar em "Sair"', async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    api.post.mockResolvedValue({ data: { name: 'Carlos' } });
    renderWithRouter(<Profile />);
    const logoutButton = await screen.findByRole('button', { name: /Sair/i });
    fireEvent.click(logoutButton);
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Tem certeza?',
          icon: 'warning',
        })
      );
    });
  });

  it('remove token e redireciona após confirmação de logout', async () => {
    localStorage.setItem('token', 'fakeToken');
    Swal.fire
      .mockResolvedValueOnce({ isConfirmed: true }) // primeiro alerta (confirmação)
      .mockResolvedValueOnce(); // segundo alerta (desconectado)

    api.post.mockResolvedValue({ data: { name: 'Ana' } });
    renderWithRouter(<Profile />);
    const logoutButton = await screen.findByRole('button', { name: /Sair/i });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
