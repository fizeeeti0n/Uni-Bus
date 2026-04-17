import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { About } from './About';
import { describe, it, expect } from 'vitest';

describe('About Component', () => {
  it('renders main heading', () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { name: /About UniBus/i })).toBeInTheDocument();
  });

  it('renders key features', () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );
    expect(screen.getAllByText(/Live GPS Tracking/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Smart Notifications/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Accurate ETAs/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Seat Availability/i)[0]).toBeInTheDocument();
  });
});
