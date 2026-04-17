import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { StudentProfile } from './StudentProfile';
import { describe, it, expect } from 'vitest';

describe('StudentProfile', () => {
  it('renders profile and can switch tabs', () => {
    render(
      <BrowserRouter>
        <StudentProfile />
      </BrowserRouter>
    );
    
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    
    // Switch to history tab
    fireEvent.click(screen.getByRole('button', { name: 'history' }));
    expect(screen.getByText('Trip History')).toBeInTheDocument();
    
    // Switch to settings
    fireEvent.click(screen.getByRole('button', { name: 'settings' }));
    expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
  });
});
