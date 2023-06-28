import React, {useState} from 'react';
import {Button, Flex, Text, Divider, Switch} from 'native-base';
import useBluetoothContext from '../../contexts/bluetoothContext';
import NotConnedtedToDevice from '../../components/NotConnectedToDevice';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ControlScreen = () => {
  const {isConnected, writeToDevice, readFromDevice} = useBluetoothContext();

  const [isRotationOnly, setIsRotationOnly] = useState(false);
  const [liftPosition, setLiftPosition] = useState<'Up' | 'Down' | null>(null);
  const [distanceLeft, setDistanceLeft] = useState<number | null>(null);
  const [distanceBottom, setDistanceBottom] = useState<number | null>(null);

  if (!isConnected) {
    return <NotConnedtedToDevice />;
  }

  const getDistance = async () => {
    writeToDevice('GET_DISTANCE');
    setTimeout(async () => {
      const distance = await readFromDevice();
      if (distance) {
        const [left, bottom] = distance.split(',');
        setDistanceLeft(parseInt(left, 10));
        setDistanceBottom(parseInt(bottom, 10));
      }
    }, 1000);
  };

  const getCommand = (angle: number) => {
    if (isRotationOnly) {
      return `ROTATE:${angle}`;
    }

    return `MOVE:${angle}`;
  };

  const commonDirButtonProps = {
    m: 3,
    backgroundColor: 'green.900',
  };

  const commonDirIconProps = {
    color: 'white',
    size: 30,
  };

  return (
    <Flex flex={1} flexDirection="column" alignItems="center">
      {/* DISTANCE BLOCK - BEGIN */}
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        alignSelf="stretch"
        p={5}>
        <Flex>
          <Flex flexDirection="row" alignSelf="stretch" alignItems="center">
            <Text>Distance left: </Text>
            <Text fontSize="lg" fontWeight="bold">
              {distanceLeft ?? 'unknown'} cm
            </Text>
          </Flex>
          <Flex flexDirection="row" alignItems="center" alignSelf="stretch">
            <Text>Distance bottom: </Text>
            <Text fontSize="lg" fontWeight="bold">
              {distanceBottom ?? 'unknown'} cm
            </Text>
          </Flex>
        </Flex>
        <Button onPress={getDistance}>Get distance</Button>
      </Flex>
      {/* DISTANCE BLOCK - END */}
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
          leftIcon={<Ionicons name="arrow-up" color="white" />}>
          Lift up
        </Button>
        <Flex flexDirection="row" alignItems="center">
          <Text>Current: </Text>
          <Text fontSize="lg" fontWeight="bold">
            {liftPosition ?? 'unknown'}
          </Text>
        </Flex>
        <Button
          onPress={() => {
            writeToDevice('LIFT:DOWN');
            setLiftPosition('Down');
          }}
          leftIcon={<Ionicons name="arrow-down" color="white" />}>
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
              backgroundColor="red.900"
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
