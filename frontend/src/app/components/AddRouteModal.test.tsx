import { render, screen, fireEvent } from '@testing-library/react';
import { AddRouteModal } from './AddRouteModal';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('AddRouteModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(<AddRouteModal isOpen={false} onClose={vi.fn()} onAdd={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('can submit the form with proper stops parsing', async () => {
    const handleAdd = vi.fn();
    render(<AddRouteModal isOpen={true} onClose={vi.fn()} onAdd={handleAdd} />);
    
    expect(screen.getByText('Create New Route')).toBeInTheDocument();
    
    await userEvent.type(screen.getByLabelText('Route Name'), 'New Route X');
    await userEvent.type(screen.getByLabelText('Bus Stops'), 'Stop 1, Stop 2, Stop 3');
    await userEvent.type(screen.getByLabelText('Average Trip Time'), '30 min');
    
    fireEvent.submit(screen.getByRole('button', { name: 'Create Route' }).closest('form') as HTMLFormElement);
    
    expect(handleAdd).toHaveBeenCalledWith(expect.objectContaining({
      name: 'New Route X',
      stops: 3,
      avgTime: '30 min'
    }));
  });
});
