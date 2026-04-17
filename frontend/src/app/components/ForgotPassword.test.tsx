import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { ForgotPassword } from './ForgotPassword';
import { describe, it, expect } from 'vitest';

describe('ForgotPassword', () => {
  it('renders forgot password form', () => {
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { name: 'Reset Password' })).toBeInTheDocument();
  });
});
