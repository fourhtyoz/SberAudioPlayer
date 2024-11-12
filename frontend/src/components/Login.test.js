import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { register } from '../utils/api';
import alertify from 'alertifyjs';


jest.mock('../utils/api', () => ({ register: jest.fn() }));
jest.mock('alertifyjs', () => ({
    success: jest.fn(),
    error: jest.fn(),
}));

describe('Login Component', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input fields and buttons when not authenticated', () => {
    render(<Login isAuthenticated={false} login={mockLogin} />);
    
    expect(screen.getByPlaceholderText('Имя (минимум 3 символа)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Пароль (минимум 6 символов)')).toBeInTheDocument();
    expect(screen.getByText('Вход')).toBeInTheDocument();
    expect(screen.getByText('Регистрация')).toBeInTheDocument();
  });

  test('updates state on input change', () => {
    render(<Login isAuthenticated={false} login={mockLogin} />);

    const usernameInput = screen.getByPlaceholderText('Имя (минимум 3 символа)');
    const passwordInput = screen.getByPlaceholderText('Пароль (минимум 6 символов)');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpassword');
  });

  test('calls handleLogin on "Вход" button click', async () => {
    render(<Login isAuthenticated={false} login={mockLogin} />);

    const usernameInput = screen.getByPlaceholderText('Имя (минимум 3 символа)');
    const passwordInput = screen.getByPlaceholderText('Пароль (минимум 6 символов)');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    fireEvent.click(screen.getByText('Вход'));

    expect(mockLogin).toHaveBeenCalledWith('testuser', 'testpassword');
    await waitFor(() => {
        expect(alertify.success).toHaveBeenCalledWith('Вы вошли в свой аккаунт');
    });
  });

  test('calls handleRegister and shows alertify on "Регистрация" button click', async () => {
    register.mockResolvedValueOnce({});

    render(<Login isAuthenticated={false} login={mockLogin} />);

    const usernameInput = screen.getByPlaceholderText('Имя (минимум 3 символа)');
    const passwordInput = screen.getByPlaceholderText('Пароль (минимум 6 символов)');

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } });
    fireEvent.click(screen.getByText('Регистрация'));

    expect(register).toHaveBeenCalledWith('newuser', 'newpassword');
    await waitFor(() => {
        expect(alertify.success).toHaveBeenCalledWith('Регистрация прошла успешно');
    });
  });

  test('shows error alertify when registration fails', async () => {
    register.mockRejectedValueOnce({ response: { data: { detail: 'Registration error' } } });

    render(<Login isAuthenticated={false} login={mockLogin} />);

    const usernameInput = screen.getByPlaceholderText('Имя (минимум 3 символа)');
    const passwordInput = screen.getByPlaceholderText('Пароль (минимум 6 символов)');

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } });
    fireEvent.click(screen.getByText('Регистрация'));

    await waitFor(() => {
        expect(alertify.error).toHaveBeenCalledWith('Ошибка при регистрации: Registration error');
    });
  });
});
