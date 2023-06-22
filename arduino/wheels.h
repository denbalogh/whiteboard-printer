#ifndef _WHEELS_H_
#define _WHEELS_H_

#include <Servo.h>
#include <Arduino.h> // for max and min

class Wheel {
    private:
        int pin;
        Servo servo;
        int checkSpeed(int speed);

    public:
        void setPin(int num);
        void init();
        void stop();
        void forward(int speed);
        void backward(int speed);
};

class Wheels {
    private:
        Wheel top;
        Wheel bottom;

    public:
        Wheels(int topPin, int bottomPin);
        void init();
        void stop();
        Wheel getTopWheel();
        Wheel getBottomWheel();
        void moveForward(int speed, int offset_top, int offset_bottom);
        void moveBackward(int speed, int offset_top, int offset_bottom);
        void rotateClockwise(int speed);
        void rotateCounterClockwise(int speed);
};

#endif
