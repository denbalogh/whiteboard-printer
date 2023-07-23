import * as React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SystemNavigationBar from 'react-native-system-navigation-bar';

import HomeScreen from './screens/Home';
import BluetoothSetupScreen from './screens/BluetoothSetup';
import ImageCollectionScreen from './screens/ImageCollection';

import {BluetoothContextProvider} from './contexts/Bluetooth';
import {ImageCollectionContextProvider} from './contexts/ImageCollection';

StatusBar.setBarStyle('dark-content');
StatusBar.setBackgroundColor('#ffffff');

SystemNavigationBar.setNavigationColor('#ffffff', 'dark');

const Stack = createNativeStackNavigator();

function App() {
  return (
    <ImageCollectionContextProvider>
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
              <Stack.Screen
                name="ImageCollection"
                component={ImageCollectionScreen}
                options={{title: 'Image Collection'}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </NativeBaseProvider>
      </BluetoothContextProvider>
    </ImageCollectionContextProvider>
  );
}

export default App;
