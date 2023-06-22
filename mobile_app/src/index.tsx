import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './screens/Home';
import BluetoothSetupScreen from './screens/BluetoothSetup';

import {BluetoothContextProvider} from './contexts/bluetoothContext';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <BluetoothContextProvider>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="BluetoothSetup"
              component={BluetoothSetupScreen}
              options={{title: 'Bluetooth Setup'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </BluetoothContextProvider>
  );
}

export default App;
