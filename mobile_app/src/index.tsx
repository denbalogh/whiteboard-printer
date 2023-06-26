import * as React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SystemNavigationBar from 'react-native-system-navigation-bar';

import HomeScreen from './screens/Home';
import BluetoothSetupScreen from './screens/BluetoothSetup';

import {BluetoothContextProvider} from './contexts/bluetoothContext';

StatusBar.setBarStyle('dark-content');
StatusBar.setBackgroundColor('#ffffff');

SystemNavigationBar.setNavigationColor('#ffffff', 'dark');

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
