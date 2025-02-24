import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as E from 'fp-ts/Either';

import { SignUp } from '@/components/SignUp';
import { toaster } from '@/components/ui/toaster';
import { Provider as ChakraProvider } from '@/components/ui/provider';

// Mock validations: valid input returns a Right; invalid input returns a Left.
jest.mock('@/utils/validation', () => ({
  validateLogin: jest.fn((val: string) => val.includes('@') ? E.right(true) : E.left('invalid')),
  validatePassword: jest.fn((val: string) => val.length >= 8 ? E.right(true) : E.left(['Password must be at least 8 characters']))
}));

describe('SignUp Component', () => {
  beforeEach(() => {
    jest.spyOn(toaster, 'create').mockImplementation(jest.fn());
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders form fields', () => {
    render(
      <ChakraProvider>
        <SignUp />
      </ChakraProvider>
    );
    expect(screen.getByPlaceholderText(/Enter your email or phone number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  test('shows validation errors on invalid input after submission', async () => {
    render(
      <ChakraProvider>
        <SignUp />
      </ChakraProvider>
    );
    const emailInput = screen.getByPlaceholderText(/Enter your email or phone number/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const button = screen.getByRole('button', { name: /Sign Up/i });

    // Enter invalid inputs
    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.submit(button);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email or phone number/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid data and shows success toaster', async () => {
    const createSpy = jest.spyOn(toaster, 'create');
    render(
      <ChakraProvider>
        <SignUp />
      </ChakraProvider>
    );
    const emailInput = screen.getByPlaceholderText(/Enter your email or phone number/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const button = screen.getByRole('button', { name: /Sign Up/i });

    // Enter valid inputs
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.submit(button);

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Sign Up Successful'
      }));
    });
  });
});
