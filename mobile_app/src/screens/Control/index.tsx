import React, {useState} from 'react';
import {Button, Flex, Text, Divider, Switch, useTheme} from 'native-base';
import useBluetoothContext from '../../contexts/Bluetooth';
import NotConnedtedToDevice from '../../components/NotConnectedToDevice';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ControlScreen = () => {
  const {isConnected, writeToDevice} = useBluetoothContext();

  const [isRotationOnly, setIsRotationOnly] = useState(false);
  const [liftPosition, setLiftPosition] = useState<'Up' | 'Down' | null>(null);

  const {colors} = useTheme();

  if (!isConnected) {
    return <NotConnedtedToDevice />;
  }

  const getCommand = (angle: number) => {
    if (isRotationOnly) {
      return `ROTATE:${angle}`;
    }

    return `MOVE:${angle}`;
  };

  const commonDirButtonProps = {
    m: 3,
    variant: 'solid',
  };

  const commonDirIconProps = {
    color: 'white',
    size: 30,
  };

  return (
    <Flex flex={1} flexDirection="column" alignItems="center">
      <Divider />
      {/* LIFT BLOCK - BEGIN */}
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        alignSelf="stretch"
        alignItems="center"
        p={5}>
        <Button
          onPress={() => {
            writeToDevice('LIFT:UP');
            setLiftPosition('Up');
          }}
          flex={1}
          mr={2}
          variant={liftPosition === 'Up' ? 'solid' : 'outline'}
          leftIcon={
            <Ionicons
              name="arrow-up"
              color={liftPosition === 'Up' ? 'white' : colors.primary['900']}
            />
          }>
          Lift up
        </Button>
        <Button
          onPress={() => {
            writeToDevice('LIFT:DOWN');
            setLiftPosition('Down');
          }}
          flex={1}
          ml={2}
          variant={liftPosition === 'Down' ? 'solid' : 'outline'}
          leftIcon={
            <Ionicons
              name="arrow-down"
              color={liftPosition === 'Down' ? 'white' : colors.primary['900']}
            />
          }>
          Lift Down
        </Button>
      </Flex>
      {/* LIFT BLOCK - END */}
      <Divider />
      {/* ROTATION BLOCK - BEGIN */}
      <Flex
        flexDirection="row"
        alignSelf="stretch"
        justifyContent="flex-start"
        alignItems="center"
        p={5}>
        <Flex flexDirection="row" alignItems="center">
          <Switch
            isChecked={isRotationOnly}
            onToggle={() => setIsRotationOnly(!isRotationOnly)}
          />
          <Text ml={3}>Rotation only</Text>
        </Flex>
      </Flex>
      {/* ROTATION BLOCK - END */}
      {/* DIRECTION CONTROL BLOCK - BEGIN */}
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        flex={1}
        alignItems="center">
        <Flex flex={1} justifyContent="center" alignItems="center">
          <Flex flexDirection="row">
            <Button
              {...commonDirButtonProps}
              leftIcon={
                <Ionicons
                  name="arrow-up"
                  style={{transform: [{rotateZ: '-45deg'}]}}
                  {...commonDirIconProps}
                />
              }
              onPress={() => writeToDevice(getCommand(315))}
            />
            <Button
              {...commonDirButtonProps}
              leftIcon={<Ionicons name="arrow-up" {...commonDirIconProps} />}
              onPress={() => writeToDevice(getCommand(0))}
            />
            <Button
              {...commonDirButtonProps}
              leftIcon={
                <Ionicons
                  name="arrow-up"
                  style={{transform: [{rotateZ: '45deg'}]}}
                  {...commonDirIconProps}
                />
              }
              onPress={() => writeToDevice(getCommand(45))}
            />
          </Flex>
          <Flex flexDirection="row">
            <Button
              {...commonDirButtonProps}
              leftIcon={<Ionicons name="arrow-back" {...commonDirIconProps} />}
              onPress={() => writeToDevice(getCommand(270))}
            />
            <Button
              {...commonDirButtonProps}
              colorScheme={'error'}
              leftIcon={<Ionicons name="stop" {...commonDirIconProps} />}
              onPress={() => writeToDevice('STOP')}
            />
            <Button
              {...commonDirButtonProps}
              leftIcon={
                <Ionicons name="arrow-forward" {...commonDirIconProps} />
              }
              onPress={() => writeToDevice(getCommand(90))}
            />
          </Flex>
          <Flex flexDirection="row">
            <Button
              {...commonDirButtonProps}
              leftIcon={
                <Ionicons
                  name="arrow-down"
                  style={{transform: [{rotateZ: '45deg'}]}}
                  {...commonDirIconProps}
                />
              }
              onPress={() => writeToDevice(getCommand(225))}
            />
            <Button
              {...commonDirButtonProps}
              leftIcon={<Ionicons name="arrow-down" {...commonDirIconProps} />}
              onPress={() => writeToDevice(getCommand(180))}
            />
            <Button
              {...commonDirButtonProps}
              leftIcon={
                <Ionicons
                  name="arrow-down"
                  style={{transform: [{rotateZ: '-45deg'}]}}
                  {...commonDirIconProps}
                />
              }
              onPress={() => writeToDevice(getCommand(135))}
            />
          </Flex>
        </Flex>
      </Flex>
      {/* DIRECTION CONTROL BLOCK - END */}
    </Flex>
  );
};

export default ControlScreen;
