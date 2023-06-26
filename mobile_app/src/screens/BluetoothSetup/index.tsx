import React, {useEffect} from 'react';
import {Center, Box, Button, Text, Spinner, useTheme} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useBluetoothContext from '../../contexts/bluetoothContext';
import {useNavigation} from '@react-navigation/native';
import {StatusBar} from 'react-native';

const BluetoothSetupScreen = () => {
  const {
    isBluetoothEnabled,
    enableBluetooth,
    startScan,
    stopScan,
    isScanning,
    device,
    deviceNotFound,
    isConnected,
    isConnecting,
    connect,
    disconnect,
  } = useBluetoothContext();
  const navigation = useNavigation();
  const {colors} = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerStyle: isConnected && {
        backgroundColor: colors.blue[600],
      },
      headerTitleStyle: isConnected && {
        color: colors.white,
      },
      headerTintColor: isConnected ? colors.white : undefined,
    });

    if (isConnected) {
      StatusBar.setBackgroundColor(colors.blue[600]);
      StatusBar.setBarStyle('light-content');
    } else {
      StatusBar.setBackgroundColor(colors.white);
      StatusBar.setBarStyle('dark-content');
    }
  }, [isConnected, navigation, colors.blue, colors.white]);

  if (!isBluetoothEnabled) {
    return (
      <Center flex={1}>
        <Text fontSize="xl" mb={3}>
          Bluetooth is disabled
        </Text>
        <Button onPress={enableBluetooth}>Enable</Button>
      </Center>
    );
  }

  const renderScanButton = () =>
    isScanning ? (
      <Box>
        <Spinner />
        <Text>Scanning for the printer...</Text>
        <Button mt={5} variant="ghost" colorScheme="error" onPress={stopScan}>
          Stop scanning
        </Button>
      </Box>
    ) : (
      <Button variant={device ? 'ghost' : 'solid'} onPress={startScan}>
        Scan for the printer
      </Button>
    );

  return (
    <Center flex={1}>
      {device && (
        <Center mb={20}>
          <Ionicons
            name="print"
            size={30}
            color={isConnected ? colors.primary[600] : colors.muted[600]}
          />
          {isConnected ? (
            <Text fontSize="xl" fontWeight="bold" color="primary">
              Connected to the printer!
            </Text>
          ) : deviceNotFound ? (
            <Text fontSize="xl" color="error">
              Printer wasn't found!
            </Text>
          ) : (
            <Text fontSize="xl">Found the printer!</Text>
          )}
          {isConnected ? (
            <Button
              variant="outline"
              colorScheme="error"
              mt={5}
              onPress={disconnect}>
              Disconnect
            </Button>
          ) : (
            <Button
              mt={5}
              onPress={connect}
              isLoading={isConnecting}
              isLoadingText="Connecting...">
              Connect
            </Button>
          )}
        </Center>
      )}

      {!isConnecting && !isConnected && renderScanButton()}
    </Center>
  );
};

export default BluetoothSetupScreen;
