import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { Login } from './Login';
import { AuthProvider } from '../contexts/AuthContext';
import { describe, it, expect, vi } from 'vitest';

// Mock react-router
const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component', () => {
  it('renders login form properly', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByRole('heading', { name: /Welcome Back/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username@university.edu/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
  });

  it('can switch user types', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
    
    const driverButton = screen.getByRole('button', { name: 'Driver' });
    const studentButton = screen.getByRole('button', { name: 'Student' });
    
    expect(studentButton).toHaveClass('bg-blue-600'); // Selection class
    
    await userEvent.click(driverButton);
    expect(driverButton).toHaveClass('bg-blue-600');
  });

  it('navigates to student dashboard after submitting as student', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
    
    await userEvent.type(screen.getByPlaceholderText(/username@university.edu/i), 'student@test.com');
    await userEvent.type(screen.getByPlaceholderText(/••••••••/i), 'password123');
    
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
    expect(mockNavigate).toHaveBeenCalledWith('/student');
  });
});
