import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { StudentDashboard } from './StudentDashboard';
import { describe, it, expect, vi } from 'vitest';
import * as AuthContext from '../contexts/AuthContext';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('StudentDashboard', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when unauthenticated', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: false,
      isAdmin: false,
    });

    render(
      <BrowserRouter>
        <StudentDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('Bus Tracking')).toBeInTheDocument();
    expect(screen.getByText('View bus locations (Login for full access)')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Login to Select Route/i })[0]).toBeInTheDocument();
  });

  it('renders correctly when authenticated', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { id: '1', name: 'John', email: 'john@test.com', type: 'student' },
      login: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: true,
      isAdmin: false,
    });

    render(
      <BrowserRouter>
        <StudentDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('Track your bus in real-time')).toBeInTheDocument();
    expect(screen.queryByText(/Login to Select Route/i)).not.toBeInTheDocument();
  });
});
