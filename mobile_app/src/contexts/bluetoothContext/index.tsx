import React, {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
} from 'react';
import {PermissionsAndroid} from 'react-native';
import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';

const requestBluetoothPermissions = async () => {
  await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
  ]);
};

type BluetoothContextType = {
  isBluetoothEnabled: boolean;
  enableBluetooth: () => void;
  isScanning: boolean;
  startScan: () => void;
  stopScan: () => void;
  device: BluetoothDevice | null;
  deviceNotFound: boolean;
  connect: () => void;
  disconnect: () => void;
  isConnecting: boolean;
  isConnected: boolean;
  writeToDevice: (message: string) => void;
  readFromDevice: () => Promise<String | undefined>;
};

const BluetoothContext = createContext<BluetoothContextType>({
  isBluetoothEnabled: false,
  enableBluetooth: () => {},
  isScanning: false,
  startScan: () => {},
  stopScan: () => {},
  device: null,
  deviceNotFound: false,
  connect: () => {},
  disconnect: () => {},
  isConnecting: false,
  isConnected: false,
  writeToDevice: () => {},
  readFromDevice: () => Promise.resolve(''),
});

const BluetoothContextProvider = ({children}: {children: ReactNode}) => {
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [deviceNotFound, setDeviceNotFound] = useState(false);

  useEffect(() => {
    const getBluetoothState = async () => {
      try {
        const enabled = await RNBluetoothClassic.isBluetoothEnabled();
        setIsBluetoothEnabled(enabled);
      } catch (err) {
        console.log(err);
      }
    };

    getBluetoothState();
  }, []);

  useEffect(() => {
    const subscription = RNBluetoothClassic.onStateChanged(
      (event: {enabled: boolean}) => {
        setIsBluetoothEnabled(event.enabled);
      },
    );
    return () => subscription.remove();
  }, []);

  const startScan = async () => {
    await requestBluetoothPermissions();
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

  const enableBluetooth = async () => {
    try {
      await RNBluetoothClassic.requestBluetoothEnabled();
    } catch (error) {
      console.log(error);
    }
  };

  const writeToDevice = async (message: string) => {
    try {
      await device?.write(`${message}\n`);
    } catch (error) {
      console.log(error);
    }
  };

  const readFromDevice = async () => {
    try {
      const message = await device?.read();
      return message;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <BluetoothContext.Provider
      value={{
        isBluetoothEnabled,
        enableBluetooth,
        isScanning,
        startScan,
        stopScan,
        device,
        deviceNotFound,
        connect,
        disconnect,
        isConnecting,
        isConnected,
        writeToDevice,
        readFromDevice,
      }}>
      {children}
    </BluetoothContext.Provider>
  );
};

export {BluetoothContextProvider};

export default () => useContext(BluetoothContext);
