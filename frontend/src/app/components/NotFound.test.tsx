import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { NotFound } from './NotFound';
import { describe, it, expect } from 'vitest';

describe('NotFound', () => {
  it('renders 404 text and links', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to Homepage' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Track Bus' })).toBeInTheDocument();
  });
});
