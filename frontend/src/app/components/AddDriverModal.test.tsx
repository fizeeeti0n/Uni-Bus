import { render, screen, fireEvent } from '@testing-library/react';
import { AddDriverModal } from './AddDriverModal';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('AddDriverModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(<AddDriverModal isOpen={false} onClose={vi.fn()} onAdd={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('can submit the form', async () => {
    const handleAdd = vi.fn();
    render(<AddDriverModal isOpen={true} onClose={vi.fn()} onAdd={handleAdd} />);
    
    expect(screen.getByText('Add New Driver')).toBeInTheDocument();
    
    await userEvent.type(screen.getByLabelText('Full Name'), 'Jane Doe');
    await userEvent.type(screen.getByLabelText('Email Address'), 'jane@test.com');
    await userEvent.type(screen.getByLabelText('Phone Number'), '1234567890');
    await userEvent.type(screen.getByLabelText('License Number'), 'DL-1234');
    
    fireEvent.submit(screen.getByRole('button', { name: 'Add Driver' }).closest('form') as HTMLFormElement);
    
    expect(handleAdd).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Jane Doe',
      email: 'jane@test.com',
      phone: '1234567890',
      licenseNumber: 'DL-1234',
    }));
  });
});
