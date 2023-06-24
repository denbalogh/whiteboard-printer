import React from 'react';
import {Box} from 'native-base';
import Joystick from '../../components/Joystick';
import useBluetoothContext from '../../contexts/bluetoothContext';
import NotConnedtedToDevice from '../../components/NotConnectedToDevice';

const ControlScreen = () => {
  const {isConnected} = useBluetoothContext();

  if (!isConnected) {
    return <NotConnedtedToDevice />;
  }

  return (
    <Box alignSelf="center">
      <Joystick />
    </Box>
  );
};

export default ControlScreen;
