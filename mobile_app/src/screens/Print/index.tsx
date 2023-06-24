import React from 'react';
import {Box} from 'native-base';
import useBluetoothContext from '../../contexts/bluetoothContext';
import NotConnedtedToDevice from '../../components/NotConnectedToDevice';

const PrintScreen = () => {
  const {isConnected} = useBluetoothContext();

  if (!isConnected) {
    return <NotConnedtedToDevice />;
  }

  return (
    <Box py={100} alignSelf="center">
      Print
    </Box>
  );
};

export default PrintScreen;
