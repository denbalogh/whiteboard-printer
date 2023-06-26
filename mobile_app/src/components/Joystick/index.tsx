import React, {useRef} from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  Vibration,
} from 'react-native';
import _ from 'lodash';

const Joystick = ({
  onMove,
  onStop,
  throttleMs = 300,
}: {
  onMove: ({x, y}: {x: number; y: number}) => void;
  onStop: () => void;
  throttleMs?: number;
}) => {
  const fn = (coords: {x: number; y: number}) => {
    onMove(coords);

    const x_abs = Math.abs(coords.x);
    const y_abs = Math.abs(coords.y);

    if (x_abs > 50 || y_abs > 50) {
      Vibration.vibrate(50);
    }
  };
  const throttleFn = _.throttle(fn, throttleMs);
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

      throttleFn({x: gestureState.dx, y: -1 * gestureState.dy});
    },
    onPanResponderRelease: () => {
      Animated.spring(
        pan, // Auto-multiplexed
        {toValue: {x: 0, y: 0}, useNativeDriver: true}, // Back to zero
      ).start();

      throttleFn.cancel();
      onStop();
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
