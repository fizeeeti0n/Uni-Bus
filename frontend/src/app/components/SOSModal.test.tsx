import { render, screen, fireEvent } from '@testing-library/react';
import { SOSModal } from './SOSModal';
import { describe, it, expect, vi } from 'vitest';

describe('SOSModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(<SOSModal isOpen={false} onClose={vi.fn()} userType="student" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders and can select an emergency', async () => {
    render(<SOSModal isOpen={true} onClose={vi.fn()} userType="student" />);
    
    expect(screen.getByText('Emergency SOS')).toBeInTheDocument();
    
    // Send button should be disabled initially
    const sendButton = screen.getByRole('button', { name: 'Send SOS Alert' });
    expect(sendButton).toBeDisabled();
    
    // Select medical emergency
    fireEvent.click(screen.getByText('Medical Emergency'));
    
    // Send button should be enabled
    expect(sendButton).not.toBeDisabled();
  });
});
