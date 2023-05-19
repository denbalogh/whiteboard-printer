import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PrintScreen from '../Print';
import ControlScreen from '../Control';
import {Box} from 'native-base';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={({navigation, route}) => ({
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';

          if (route.name === 'Print') {
            iconName = focused ? 'print' : 'print-outline';
          } else if (route.name === 'Control') {
            iconName = focused ? 'move' : 'move-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () => (
          <Box mr={4}>
            <Ionicons.Button
              name="bluetooth"
              // eslint-disable-next-line react-native/no-inline-styles
              iconStyle={{marginRight: 0}}
              onPress={() => navigation.navigate('BluetoothSetup')}
            />
          </Box>
        ),
      })}>
      <Tab.Screen name="Print" component={PrintScreen} />
      <Tab.Screen name="Control" component={ControlScreen} />
    </Tab.Navigator>
  );
}

export default HomeScreen;
