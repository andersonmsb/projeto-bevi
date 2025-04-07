// Login.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import api from '../services/api';
import Swal from 'sweetalert2';
import { BrowserRouter } from 'react-router-dom';

beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation((msg) => {
      if (
        msg.includes('React Router Future Flag Warning') ||
        msg.includes('Relative route resolution')
      ) {
        return;
      }
      console.warn(msg);
    });
  });
  

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

jest.mock('../services/api');

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Login Component', () => {
  it('renderiza campos de email e senha', () => {
    renderWithRouter(<Login />);
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  });

  it('chama a API e navega ao enviar credenciais válidas', async () => {
    const mockNavigate = jest.fn();
    const { useNavigate } = require('react-router-dom');
    useNavigate.mockReturnValue(mockNavigate);

    api.post.mockResolvedValue({
      data: { access_token: 'token_fake' },
    });

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'teste@email.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'teste@email.com',
        password: '123456',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/usuario');
    });
  });

  it('exibe alerta ao falhar no login', async () => {
    api.post.mockRejectedValue(new Error('Login inválido'));

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'teste@email.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'senhaerrada' },
    });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'error',
          title: 'Oops...',
          text: 'Email ou senha inválidos!',
        })
      );
    });
  });
});
