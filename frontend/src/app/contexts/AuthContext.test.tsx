import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { describe, it, expect } from 'vitest';

const TestComponent = () => {
  const { user, login, logout, isAuthenticated, isAdmin } = useAuth();
  
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'logged-in' : 'logged-out'}</span>
      <span data-testid="admin-status">{isAdmin ? 'admin' : 'not-admin'}</span>
      <span data-testid="user-name">{user?.name || 'none'}</span>
      <button onClick={() => login('test@test.com', 'password', 'student')}>Login Student</button>
      <button onClick={() => login('admin@test.com', 'password', 'admin')}>Login Admin</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  it('provides default logged out state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-out');
    expect(screen.getByTestId('user-name')).toHaveTextContent('none');
  });

  it('allows logging in as a student', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    act(() => {
      screen.getByText('Login Student').click();
    });
    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in');
    expect(screen.getByTestId('user-name')).toHaveTextContent('John Smith');
    expect(screen.getByTestId('admin-status')).toHaveTextContent('not-admin');
  });

  it('allows logging in as an admin', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    act(() => {
      screen.getByText('Login Admin').click();
    });
    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in');
    expect(screen.getByTestId('user-name')).toHaveTextContent('Admin User');
    expect(screen.getByTestId('admin-status')).toHaveTextContent('admin');
  });

  it('allows logging out', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    act(() => {
      screen.getByText('Login Student').click();
    });
    act(() => {
      screen.getByText('Logout').click();
    });
    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-out');
  });
});
