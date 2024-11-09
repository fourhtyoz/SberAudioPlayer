// Header.test.js
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';


jest.mock('../hooks/useIsMobile');
jest.mock('alertifyjs', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe('Header Component', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the title and username if user is logged in', () => {
    const user = { username: 'Test User' };
    
    render(<Header user={user} logout={mockLogout} />);
    
    expect(screen.getByText('Тестовое задание в Robotics Center')).toBeInTheDocument();
    expect(screen.getByText('Добро пожаловать, Test User')).toBeInTheDocument();
  });

  test('renders the logout button and handles logout', async () => {
    const user = { username: 'Test User' };
    
    render(<Header user={user} logout={mockLogout} />);
    
    const logoutButton = screen.getByText('Выйти');
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test('does not render the logout button if no user is logged in', () => {
    render(<Header user={null} logout={mockLogout} />);
    
    expect(screen.queryByText('Выйти')).toBeNull();
  });

  test('handles mobile view', () => {
    const user = { username: 'Test User' };
    
    render(<Header user={user} logout={mockLogout} />);
    
    expect(screen.getByText('Тестовое задание в Robotics Center')).toBeInTheDocument();
    expect(screen.getByText('Добро пожаловать, Test User')).toBeInTheDocument();
    expect(screen.getByText('Выйти')).toBeInTheDocument();
  });
});
