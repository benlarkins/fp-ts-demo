import React from 'react';
import { Button, VStack, Text } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { increment, decrement } from '@/store/features/counterSlice';

export const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <VStack spaceX={4}>
      <Text fontSize="2xl">Count: {count}</Text>
      <Button onClick={() => dispatch(increment())}>Increment</Button>
      <Button onClick={() => dispatch(decrement())}>Decrement</Button>
    </VStack>
  );
};
