#ifndef _WHEELS_H_
#define _WHEELS_H_

#include <Servo.h>
#include <Arduino.h>

class Wheel {
    private:
        int pin;
        Servo servo;

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
        void goLeft(int speed, int angle);
        void goRight(int speed, int angle);
        void rotateClockwise(int speed);
        void rotateCounterClockwise(int speed);
};

#endif
