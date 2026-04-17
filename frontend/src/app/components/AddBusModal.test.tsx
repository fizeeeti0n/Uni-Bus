import { render, screen, fireEvent } from '@testing-library/react';
import { AddBusModal } from './AddBusModal';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('AddBusModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(<AddBusModal isOpen={false} onClose={vi.fn()} onAdd={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('can fill and submit the form', async () => {
    const handleAdd = vi.fn();
    render(<AddBusModal isOpen={true} onClose={vi.fn()} onAdd={handleAdd} />);
    
    expect(screen.getByText('Add New Bus')).toBeInTheDocument();
    
    await userEvent.type(screen.getByLabelText('Bus ID'), 'BUS-999');
    
    fireEvent.change(screen.getByLabelText('Assigned Driver'), { target: { value: 'Driver #101' } });
    fireEvent.change(screen.getByLabelText('Route Assignment'), { target: { value: 'Route A' } });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: 'Add Bus' }));
    
    expect(handleAdd).toHaveBeenCalledWith(expect.objectContaining({
      id: 'BUS-999',
      driver: 'Driver #101',
      route: 'Route A',
    }));
  });
});
