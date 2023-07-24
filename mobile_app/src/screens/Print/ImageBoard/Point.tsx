import {TouchableOpacity} from 'react-native';
import {Box} from 'native-base';
import React, {memo} from 'react';

export const ButtonSize = 20;

type Props = {
  isFilled: boolean;
  onPress: (row: number, col: number) => void;
  row: number;
  col: number;
};

const Point = memo(
  ({isFilled, onPress, row, col}: Props) => {
    return (
      <TouchableOpacity onPress={() => onPress(row, col)}>
        <Box
          style={{
            width: ButtonSize,
            height: ButtonSize,
          }}
          borderRadius={ButtonSize / 2}
          backgroundColor={isFilled ? 'primary.900' : 'primary.100'}
        />
      </TouchableOpacity>
    );
  },
  (oldProps, newProps) =>
    oldProps.isFilled === newProps.isFilled &&
    oldProps.onPress === newProps.onPress,
);

export default Point;
