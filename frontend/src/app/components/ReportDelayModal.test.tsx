import { render, screen, fireEvent } from '@testing-library/react';
import { ReportDelayModal } from './ReportDelayModal';
import { describe, it, expect, vi } from 'vitest';

describe('ReportDelayModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(<ReportDelayModal isOpen={false} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('can submit the delay form', async () => {
    render(<ReportDelayModal isOpen={true} onClose={vi.fn()} />);
    
    expect(screen.getByRole('heading', { level: 2, name: 'Report Delay' })).toBeInTheDocument();
    
    // Change delay minutes
    fireEvent.change(screen.getByLabelText('Expected Delay (minutes)'), { target: { value: '15' } });
    
    // Change reason
    fireEvent.change(screen.getByLabelText('Reason for Delay'), { target: { value: 'Heavy Traffic' } });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: 'Report Delay' }).closest('form') as HTMLFormElement);
    
    expect(screen.getByText(/Sending Notification/i)).toBeInTheDocument();
  });
});
