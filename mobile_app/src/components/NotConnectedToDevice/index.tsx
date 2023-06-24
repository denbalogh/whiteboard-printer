import React from 'react';
import {Center, Text} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const NotConnedtedToDevice = () => {
  const navigation = useNavigation();

  return (
    <Center flex={1}>
      <Text fontSize="xl" mb={3}>
        Not Connected to device
      </Text>
      <Ionicons.Button
        name="bluetooth"
        // eslint-disable-next-line react-native/no-inline-styles
        iconStyle={{marginRight: 0}}
        // @ts-ignore
        onPress={() => navigation.navigate('BluetoothSetup')}
      />
    </Center>
  );
};

export default NotConnedtedToDevice;
