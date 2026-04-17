import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Root } from './Root';
import { describe, it, expect, vi, afterEach } from 'vitest';
import * as AuthContext from '../contexts/AuthContext';

describe('Root Navigation', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders unauthenticated navigation', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: false,
      isAdmin: false,
    });

    render(
      <MemoryRouter>
        <Root />
      </MemoryRouter>
    );

    // Using getAllByRole because there might be mobile and desktop links
    expect(screen.getAllByRole('link', { name: /UniBus/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Login/i }).length).toBeGreaterThan(0);
  });

  it('renders authenticated user menu and can logout', () => {
    const logoutMock = vi.fn();
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { id: '1', name: 'John Doe', email: 'john@test.com', type: 'student' },
      login: vi.fn(),
      logout: logoutMock,
      isAuthenticated: true,
      isAdmin: false,
    });

    render(
      <MemoryRouter>
        <Root />
      </MemoryRouter>
    );

    const userButton = screen.getByRole('button', { name: /John Doe/i });
    expect(userButton).toBeInTheDocument();
    
    fireEvent.click(userButton);
    const logoutBtn = screen.getByRole('button', { name: 'Logout' });
    fireEvent.click(logoutBtn);
    
    expect(logoutMock).toHaveBeenCalled();
  });
});
