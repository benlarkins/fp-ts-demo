import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value = pipe(
        O.some(state.value),
        O.map(n => n + 1),
        O.getOrElse(() => state.value)
      );
    },
    decrement: (state) => {
      state.value = pipe(
        O.some(state.value),
        O.map(n => n - 1),
        O.getOrElse(() => state.value)
      );
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value = pipe(
        O.some(state.value),
        O.map(n => n + action.payload),
        O.getOrElse(() => state.value)
      );
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
