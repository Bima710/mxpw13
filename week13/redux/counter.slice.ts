// counter.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: CounterState = {
  value: 0,
  status: 'idle',
  error: null,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    fetchPostsCount: (state) => {
      state.status = 'loading';
    },
    fetchPostsSuccess: (state, action: PayloadAction<number>) => {
      state.status = 'idle';
      state.value = action.payload;
    },
    fetchPostsFailure: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const {
  increment,
  decrement,
  incrementByAmount,
  fetchPostsCount,
  fetchPostsSuccess,
  fetchPostsFailure,
} = counterSlice.actions;

export default counterSlice.reducer;
