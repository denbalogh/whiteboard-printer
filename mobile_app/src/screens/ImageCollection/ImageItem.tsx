import React from 'react';
import {Flex, Box, ScrollView} from 'native-base';
import {TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type {ImageItemType} from '../../types';

const PointSize = 10;

type Props = {
  onPress: () => void;
  onDeletePress: () => void;
} & ImageItemType;

const ImageItem = ({rows, cols, boardState, onPress, onDeletePress}: Props) => {
  const getBoardIndex = (row: number, col: number) => {
    return row * cols + col;
  };

  return (
    <Flex flex={1} alignItems="center" backgroundColor="primary.50">
      <ScrollView horizontal={true} style={{height: rows * PointSize}}>
        <TouchableOpacity onPress={onPress}>
          <Flex direction="column">
            {[...Array(rows).keys()].map(i => (
              <Flex key={i} direction="row">
                {[...Array(cols).keys()].map(j => (
                  <Box
                    key={`${i}-${j}`}
                    style={{
                      width: PointSize,
                      height: PointSize,
                    }}
                    borderRadius={PointSize / 2}
                    backgroundColor={
                      boardState[getBoardIndex(i, j)]
                        ? 'primary.900'
                        : 'primary.100'
                    }
                  />
                ))}
              </Flex>
            ))}
          </Flex>
        </TouchableOpacity>
      </ScrollView>
      <Box position="absolute" right={4} bottom={2}>
        <TouchableOpacity onPress={onDeletePress}>
          <Ionicons name="trash" size={20} />
        </TouchableOpacity>
      </Box>
    </Flex>
  );
};

export default ImageItem;
