import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { AdminAnalytics } from './AdminAnalytics';
import { describe, it, expect } from 'vitest';

describe('AdminAnalytics', () => {
  it('renders analytics headers and sections', () => {
    render(
      <BrowserRouter>
        <AdminAnalytics />
      </BrowserRouter>
    );
    expect(screen.getByText('Analytics & Reports')).toBeInTheDocument();
    expect(screen.getByText('Weekly Performance')).toBeInTheDocument();
    expect(screen.getByText('Route Performance')).toBeInTheDocument();
    expect(screen.getByText('Top Performing Drivers')).toBeInTheDocument();
  });
});
