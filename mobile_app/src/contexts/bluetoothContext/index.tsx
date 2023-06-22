import React, {useState, createContext, ReactNode, useContext} from 'react';
import {PermissionsAndroid} from 'react-native';
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';

const requestPermissions = async () => {
  await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
  ]);
};

type BluetoothContextType = {
  isScanning: boolean;
  startScan: () => void;
  stopScan: () => void;
  device: BluetoothDevice | null;
  deviceNotFound: boolean;
  connect: () => void;
  disconnect: () => void;
  isConnecting: boolean;
  isConnected: boolean;
};

const BluetoothContext = createContext<BluetoothContextType>({
  isScanning: false,
  startScan: () => {},
  stopScan: () => {},
  device: null,
  deviceNotFound: false,
  connect: () => {},
  disconnect: () => {},
  isConnecting: false,
  isConnected: false,
});

const BluetoothContextProvider = ({children}: {children: ReactNode}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [deviceNotFound, setDeviceNotFound] = useState(false);

  const startScan = async () => {
    await requestPermissions();
    setIsScanning(true);
    setDevice(null);

    try {
      const devices = await RNBluetoothClassic.startDiscovery();
      const wp = devices.find(d => d.name === 'WhiteboardPrinter');
      if (wp) {
        setDevice(wp);
        setDeviceNotFound(false);
      } else {
        setDeviceNotFound(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsScanning(false);
    }
  };

  const stopScan = async () => {
    try {
      await RNBluetoothClassic.cancelDiscovery();
      setIsScanning(false);
    } catch (error) {
      console.log(error);
    }
  };

  const connect = async () => {
    setIsConnecting(true);

    try {
      await device?.connect();
      setIsConnected(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await device?.disconnect();
      setIsConnected(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <BluetoothContext.Provider
      value={{
        isScanning,
        startScan,
        stopScan,
        device,
        deviceNotFound,
        connect,
        disconnect,
        isConnecting,
        isConnected,
      }}>
      {children}
    </BluetoothContext.Provider>
  );
};

export {BluetoothContextProvider};

export default () => useContext(BluetoothContext);
