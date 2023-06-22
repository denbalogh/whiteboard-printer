import React from 'react';
import {Box} from 'native-base';
import Joystick from '../../components/Joystick';

const ControlScreen = () => {
  return (
    <Box alignSelf="center">
      <Joystick />
    </Box>
  );
};

export default ControlScreen;
