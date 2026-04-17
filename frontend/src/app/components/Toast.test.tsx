import { render, screen, act } from '@testing-library/react';
import { Toast } from './Toast';
import { describe, it, expect, vi } from 'vitest';

describe('Toast', () => {
  it('renders correctly and auto-closes', () => {
    vi.useFakeTimers();
    const handleClose = vi.fn();
    
    render(<Toast message="Test toast message" type="success" onClose={handleClose} duration={3000} />);
    
    expect(screen.getByText('Test toast message')).toBeInTheDocument();
    
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    expect(handleClose).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
