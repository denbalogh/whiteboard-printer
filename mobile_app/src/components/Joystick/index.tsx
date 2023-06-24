import React, {useRef} from 'react';
import {Animated, PanResponder, StyleSheet, View} from 'react-native';
import _ from 'lodash';

const Joystick = ({
  onMove,
  throttleMs = 300,
}: {
  onMove: ({x, y}: {x: number; y: number}) => void;
  throttleMs?: number;
}) => {
  const throttleFn = _.throttle(onMove, throttleMs);
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      Animated.event(
        [
          null,
          {
            dx: pan.x, // x,y are Animated.Value
            dy: pan.y,
          },
        ],
        {useNativeDriver: false},
      )(e, gestureState);

      throttleFn({x: gestureState.dx, y: gestureState.dy});
    },
    onPanResponderRelease: () => {
      Animated.spring(
        pan, // Auto-multiplexed
        {toValue: {x: 0, y: 0}, useNativeDriver: true}, // Back to zero
      ).start();

      throttleFn.cancel();
      onMove({x: 0, y: 0});
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          {
            transform: [
              {
                translateX: pan.x.interpolate({
                  inputRange: [-50, 0, 50],
                  outputRange: [-50, 0, 50],
                  extrapolate: 'clamp',
                }),
              },
              {
                translateY: pan.y.interpolate({
                  inputRange: [-50, 0, 50],
                  outputRange: [-50, 0, 50],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
          styles.box,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 150,
    backgroundColor: 'lightgray',
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: 'gray',
    width: 80,
    height: 80,
    borderRadius: 50,
  },
});

export default Joystick;
