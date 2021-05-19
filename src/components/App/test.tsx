import React from 'react';

import { render, screen } from '@testing-library/react';

import App from './';

test('renders paragrah', () => {
  render(<App />);
  const pElement = screen.getByText(/welcome to babel chat!/i);
  expect(pElement).toBeInTheDocument();
});
