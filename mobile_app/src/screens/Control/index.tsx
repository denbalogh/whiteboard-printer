import React from 'react';
import {Flex} from 'native-base';
import Joystick from '../../components/Joystick';
import useBluetoothContext from '../../contexts/bluetoothContext';
import NotConnedtedToDevice from '../../components/NotConnectedToDevice';

const ControlScreen = () => {
  const {isConnected, writeToDevice} = useBluetoothContext();
  let lastAngle = 0;

  if (!isConnected) {
    return <NotConnedtedToDevice />;
  }

  const onMove = ({x, y}: {x: number; y: number}) => {
    const angle = (Math.atan2(x, y) * 180) / Math.PI; // -180 to 180
    const angle360 = angle < 0 ? angle + 360 : angle; // 0 to 360
    const angle360Floored = Math.floor(angle360); // 0 to 359
    const commandToMove = `MOVE:${angle360Floored}`;

    if (lastAngle !== angle360Floored) {
      writeToDevice(commandToMove);
    }

    lastAngle = angle360Floored;
  };

  const onStop = () => {
    const commandToStop = 'MOVE:STOP';
    writeToDevice(commandToStop);
  };

  return (
    <Flex
      flex={1}
      justifyContent="flex-end"
      flexDirection="column"
      alignItems="center"
      pb={20}>
      <Joystick onMove={onMove} onStop={onStop} />
    </Flex>
  );
};

export default ControlScreen;
