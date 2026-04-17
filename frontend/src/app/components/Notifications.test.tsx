import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { Notifications } from './Notifications';
import { describe, it, expect } from 'vitest';

describe('Notifications', () => {
  it('renders notifications list', () => {
    render(
      <BrowserRouter>
        <Notifications />
      </BrowserRouter>
    );
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Bus Arriving Soon')).toBeInTheDocument();
  });

  it('can mark all as read', () => {
    render(
      <BrowserRouter>
        <Notifications />
      </BrowserRouter>
    );
    // At least one unread is present 
    const markAllReadBtn = screen.getByRole('button', { name: 'Mark all as read' });
    fireEvent.click(markAllReadBtn);
    expect(screen.queryByRole('button', { name: 'Mark all as read' })).not.toBeInTheDocument();
  });
});
