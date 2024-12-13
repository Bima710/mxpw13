// Counter.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { increment, decrement, incrementByAmount, incrementSuccess, incrementFailure } from '../redux/counter.slice';

const Counter = () => {
  const dispatch = useAppDispatch();
  const count = useAppSelector((state) => state.counter.value);
  const successCount = useAppSelector((state) => state.counter.successCount);
  const failureCount = useAppSelector((state) => state.counter.failureCount);

  const handleIncrement = () => {
    dispatch(increment());
  };

  const handleDecrement = () => {
    dispatch(decrement());
  };

  const handleSuccess = () => {
    dispatch(incrementSuccess());
  };

  const handleFailure = () => {
    dispatch(incrementFailure());
  };

  return (
    <View>
      <Text>Count: {count}</Text>
      <Text>Success Count: {successCount}</Text>
      <Text>Failure Count: {failureCount}</Text>
      <Button title="Increment" onPress={handleIncrement} />
      <Button title="Decrement" onPress={handleDecrement} />
      <Button title="Increment by 5" onPress={() => dispatch(incrementByAmount(5))} />
      <Button title="Success" onPress={handleSuccess} />
      <Button title="Failure" onPress={handleFailure} />
    </View>
  );
};

export default Counter;
