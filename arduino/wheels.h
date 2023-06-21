#ifndef _WHEELS_H_
#define _WHEELS_H_

#include <Servo.h>
#include <Arduino.h>

#define MIN_SPEED 0
#define MAX_SPEED 90

bool isInSpeedLimit(int speed);
void printSpeedError(char direction[], int pin);

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
        void goLeft(int speed);
        void goRight(int speed);
        void turnLeft(int speed);
        void turnRight(int speed);
};

#endif
