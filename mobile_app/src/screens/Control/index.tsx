import React from 'react';
import {Center} from 'native-base';
import Joystick from '../../components/Joystick';
// import useBluetoothContext from '../../contexts/bluetoothContext';
// import NotConnedtedToDevice from '../../components/NotConnectedToDevice';

const ControlScreen = () => {
  // const {isConnected} = useBluetoothContext();

  // if (!isConnected) {
  //   return <NotConnedtedToDevice />;
  // }

  const onMove = ({x, y}: {x: number; y: number}) => {
    console.log({x, y});
  };

  return (
    <Center flex={1}>
      <Joystick onMove={onMove} />
    </Center>
  );
};

export default ControlScreen;
