import React from 'react';
import {ScrollView} from 'native-base';
import useBluetoothContext from '../../contexts/bluetoothContext';
import NotConnedtedToDevice from '../../components/NotConnectedToDevice';
import ImageBoard from './ImageBoard';

const PrintScreen = () => {
  const {isConnected} = useBluetoothContext();

  if (!isConnected) {
    return <NotConnedtedToDevice />;
  }

  return (
    <ScrollView flex={1}>
      <ImageBoard />
    </ScrollView>
  );
};

export default PrintScreen;
