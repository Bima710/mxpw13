// counter.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
  successCount: number;
  failureCount: number;
}

const initialState: CounterState = {
  value: 0,
  successCount: 0,
  failureCount: 0,
};

interface IncrementAction {
  type: string;
}

interface DecrementAction {
  type: string;
}

interface IncrementByAmountAction {
  type: string;
  payload: number;
}

interface IncrementSuccessAction {
  type: string;
}

interface IncrementFailureAction {
  type: string;
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state: CounterState, action: IncrementAction) => {
      state.value += 1;
    },
    decrement: (state: CounterState, action: DecrementAction) => {
      state.value -= 1;
    },
    incrementByAmount: (state: CounterState, action: IncrementByAmountAction) => {
      state.value += action.payload;
    },
    incrementSuccess: (state: CounterState, action: IncrementSuccessAction) => {
      state.successCount += 1;
    },
    incrementFailure: (state: CounterState, action: IncrementFailureAction) => {
      state.failureCount += 1;
    },
  },
});





















export const { increment, decrement, incrementByAmount, incrementSuccess, incrementFailure } = counterSlice.actions;
export default counterSlice.reducer;
