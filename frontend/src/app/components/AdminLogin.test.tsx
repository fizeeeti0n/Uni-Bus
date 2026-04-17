import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { AdminLogin } from './AdminLogin';
import { AuthProvider } from '../contexts/AuthContext';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AdminLogin', () => {
  it('renders login form', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminLogin />
        </AuthProvider>
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { name: 'Administrator Access' })).toBeInTheDocument();
  });

  it('navigates to admin on success', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminLogin />
        </AuthProvider>
      </BrowserRouter>
    );
    
    await userEvent.type(screen.getByPlaceholderText('admin@university.edu'), 'admin@yopmail.com');
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'password');
    await userEvent.type(screen.getByPlaceholderText('Enter admin code'), 'ADMIN2026');
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign In as Admin' }));
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });
});
