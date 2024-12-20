// rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import counterReducer from './counter.slice';

const rootReducer = combineReducers({
  counter: counterReducer,
});

export default rootReducer;
