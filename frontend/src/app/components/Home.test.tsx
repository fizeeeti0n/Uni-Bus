import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { Home } from './Home';
import { describe, it, expect } from 'vitest';

describe('Home Component', () => {
  it('renders main heading', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: /Track Your Bus/i })).toBeInTheDocument();
  });

  it('renders track now and learn more buttons', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByRole('link', { name: /Track Now/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Learn More/i })).toBeInTheDocument();
  });
});
