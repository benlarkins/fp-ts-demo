import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import counterReducer from '../../store/features/counterSlice';
import { Counter } from '../Counter';

const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

describe('Counter', () => {
  it('renders counter with initial value', () => {
    render(
      <Provider store={store}>
        <Counter />
      </Provider>
    );
    expect(screen.getByText(/Count: 0/i)).toBeInTheDocument();
  });

  it('increments value on button click', () => {
    render(
      <Provider store={store}>
        <Counter />
      </Provider>
    );
    fireEvent.click(screen.getByText(/increment/i));
    expect(screen.getByText(/Count: 1/i)).toBeInTheDocument();
  });

  it('decrements value on button click', () => {
    render(
      <Provider store={store}>
        <Counter />
      </Provider>
    );
    fireEvent.click(screen.getByText(/decrement/i));
    expect(screen.getByText(/Count: 0/i)).toBeInTheDocument();
  });
});
