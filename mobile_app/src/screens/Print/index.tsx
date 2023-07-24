import useBluetoothContext from '../../contexts/Bluetooth';
import NotConnedtedToDevice from '../../components/NotConnectedToDevice';

import {Flex, ScrollView, Button, useToast, Fab} from 'native-base';
import React, {useState, useRef, useCallback} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import RowsColsInput from './RowsColsInput';
import Point, {ButtonSize} from './Point';
import type {ImageItemType} from '../../types';
import useImageCollectionContext from '../../contexts/ImageCollection';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../..';

import SaveToCollectionDialog from './SaveToCollectionDialog';
import PrintDialog from './PrintDialog';

const PrintScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Print'>) => {
  const {isConnected} = useBluetoothContext();

  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [isSaveToCollectionDialogOpen, setIsSaveToCollectionDialogOpen] =
    useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const toast = useToast();

  const {saveImage} = useImageCollectionContext();

  const handleSaveToCollectionDialogOpen = () => {
    setIsSaveToCollectionDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsSaveToCollectionDialogOpen(false);
  };

  const handlePrintDialogOpen = () => {
    setIsPrintDialogOpen(true);
  };

  const handlePrintDialogClose = () => {
    setIsPrintDialogOpen(false);
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

  const cancelSaveToCollectionRef = useRef(null);
  const cancelPrintRef = useRef(null);

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

  const handlePrint = () => {
    console.log('PRINTING');
    handlePrintDialogClose();
  };

  if (!isConnected) {
    return <NotConnedtedToDevice />;
  }

  return (
    <Flex flex={1}>
      <ScrollView flex={1}>
        <Flex flex={1} pb={20}>
          <RowsColsInput
            rows={rows}
            cols={cols}
            onChange={handleOnChangeSize}
          />
          <Flex
            flex={1}
            mt={2}
            alignItems="center"
            backgroundColor="primary.50">
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
              <Button
                variant="outline"
                onPress={handleSaveToCollectionDialogOpen}>
                Save to collection
              </Button>
            </Flex>
            <SaveToCollectionDialog
              isDialogOpen={isSaveToCollectionDialogOpen}
              handleDialogClose={handleDialogClose}
              saveImageToCollection={saveImageToCollection}
              cancelRef={cancelSaveToCollectionRef}
            />
            <Flex flex={1} ml={1}>
              <Button
                variant="outline"
                onPress={() =>
                  navigation.navigate('ImageCollection', {
                    load: handleLoadImageFromCollection,
                  })
                }>
                Open collection
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </ScrollView>
      <Fab
        renderInPortal={false}
        shadow={2}
        label="Print"
        icon={<Ionicons name="print" size={20} color="white" />}
        onPress={handlePrintDialogOpen}
      />
      <PrintDialog
        isDialogOpen={isPrintDialogOpen}
        handleDialogClose={handlePrintDialogClose}
        cancelRef={cancelPrintRef}
        print={handlePrint}
      />
    </Flex>
  );
};

export default PrintScreen;
