import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { AdminDashboard } from './AdminDashboard';
import { describe, it, expect } from 'vitest';

describe('AdminDashboard', () => {
  it('renders dashboard with stats', () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.getAllByText('Active Buses')[0]).toBeInTheDocument();
    expect(screen.getByText('Total Trips Today')).toBeInTheDocument();
  });

  it('can switch tabs successfully', () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    
    // Overview tab content should be visible initially
    expect(screen.getByText('Fleet Status')).toBeInTheDocument();
    
    // Click on buses tab
    fireEvent.click(screen.getByRole('button', { name: 'buses' }));
    
    // Buses content should be visible
    expect(screen.getByText('Bus Fleet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Bus' })).toBeInTheDocument();
    
    // Click on Drivers tab
    fireEvent.click(screen.getByRole('button', { name: 'drivers' }));
    expect(screen.getByRole('button', { name: 'Add Driver' })).toBeInTheDocument();
  });
});
