import { render, screen, fireEvent } from '@testing-library/react';
import { DriverInterface } from './DriverInterface';
import { describe, it, expect, vi } from 'vitest';

describe('DriverInterface', () => {
  it('renders driver info correctly', () => {
    render(<DriverInterface />);
    expect(screen.getByText('Driver #101')).toBeInTheDocument();
    expect(screen.getByText('BUS-101')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start Trip' })).toBeInTheDocument();
  });

  it('can build a trip and display controls', () => {
    render(<DriverInterface />);
    const startButton = screen.getByRole('button', { name: 'Start Trip' });
    
    // Start the trip
    fireEvent.click(startButton);
    
    expect(screen.getByRole('button', { name: 'End Trip' })).toBeInTheDocument();
    expect(screen.getByText('GPS Transmitting')).toBeInTheDocument();
    
    // Stop the trip
    const endButton = screen.getByRole('button', { name: 'End Trip' });
    fireEvent.click(endButton);
    
    expect(screen.getByRole('button', { name: 'Start Trip' })).toBeInTheDocument();
  });
});
