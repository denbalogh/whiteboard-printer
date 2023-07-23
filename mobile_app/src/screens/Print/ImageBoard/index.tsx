import {Flex, ScrollView, Button, AlertDialog, useToast} from 'native-base';
import React, {useState, useRef, useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';

import RowsColsInput from './RowsColsInput';
import Point, {ButtonSize} from './Point';
import type {ImageItemType} from '../../../types';
import useImageCollectionContext from '../../../contexts/ImageCollection';

const ImageBoard = () => {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toast = useToast();
  const navigation = useNavigation();

  const {saveImage} = useImageCollectionContext();

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const [boardState, setBoardState] = useState(
    [...Array(rows * cols).keys()].map(() => false),
  );

  const saveImageToCollection = () => {
    const data = {
      rows,
      cols,
      boardState,
    };

    saveImage(data, () =>
      toast.show({
        description: 'Image was saved to collection',
        variant: 'solid',
      }),
    );

    handleDialogClose();
  };

  const cancelRef = useRef(null);

  const getBoardIndex = useCallback(
    (row: number, col: number) => {
      return row * cols + col;
    },
    [cols],
  );

  const handleOnChangeSize = (r: number, c: number) => {
    setRows(r);
    setCols(c);
    setBoardState([...Array(r * c).keys()].map(() => false));
  };

  const onPointPress = useCallback(
    (r: number, c: number) => {
      setBoardState(prevBoardState => {
        const newBoardState = [...prevBoardState];
        const index = getBoardIndex(r, c);
        newBoardState[index] = !newBoardState[index];
        return newBoardState;
      });
    },
    [getBoardIndex],
  );

  const handleLoadImageFromCollection = (item: ImageItemType) => {
    setRows(item.rows);
    setCols(item.cols);
    setBoardState(item.boardState);
  };

  return (
    <Flex flex={1}>
      <RowsColsInput rows={rows} cols={cols} onChange={handleOnChangeSize} />
      <Flex flex={1} mt={2} alignItems="center" backgroundColor="primary.50">
        <ScrollView horizontal={true} style={{height: rows * ButtonSize}}>
          <Flex direction="column">
            {[...Array(rows).keys()].map(i => (
              <Flex key={i} direction="row">
                {[...Array(cols).keys()].map(j => (
                  <Point
                    key={`${i}-${j}`}
                    isFilled={boardState[getBoardIndex(i, j)]}
                    onPress={onPointPress}
                    row={i}
                    col={j}
                  />
                ))}
              </Flex>
            ))}
          </Flex>
        </ScrollView>
      </Flex>
      <Flex direction="row" m={2} mt={4}>
        <Flex flex={1} mr={1}>
          <Button variant="outline" onPress={handleDialogOpen}>
            Save to collection
          </Button>
          <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={isDialogOpen}
            onClose={handleDialogClose}>
            <AlertDialog.Content>
              <AlertDialog.CloseButton />
              <AlertDialog.Header>Save image to collection</AlertDialog.Header>
              <AlertDialog.Body>
                This will add image to collection for later use.
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button.Group space={2}>
                  <Button
                    variant="unstyled"
                    colorScheme="coolGray"
                    onPress={handleDialogClose}
                    ref={cancelRef}>
                    Cancel
                  </Button>
                  <Button onPress={saveImageToCollection}>Save</Button>
                </Button.Group>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog>
        </Flex>
        <Flex flex={1} ml={1}>
          <Button
            variant="outline"
            // @ts-ignore
            onPress={() =>
              // @ts-ignore
              navigation.navigate('ImageCollection', {
                load: handleLoadImageFromCollection,
              })
            }>
            Open collection
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ImageBoard;
