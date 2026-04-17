import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { Register } from './Register';
import { describe, it, expect, vi } from 'vitest';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Register Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders registration form', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
  });

  it('navigates when register is clicked', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    fireEvent.submit(screen.getByRole('button', { name: 'Create Account' }).closest('form')!);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
