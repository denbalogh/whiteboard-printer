#ifndef _CONTROLLER_H_
#define _CONTROLLER_H_

#include "wheels.h"
#include "acceleration.h"
#include "distance.h"
#include "rgb_led.h"
#include "bluetooth.h"

#define BASE_ROTATION_SPEED 30
#define MAX_ROTATION_PRECISION 5
#define MIN_ROTATION_PRECISION 1

#define BASE_MOVING_SPEED 30

class Controller {
    private:
        Wheels *wheels;
        Acceleration *acc;
        Distance *dist_left;
        Distance *dist_bottom;
        RGBLed *rgb_led;
        Bluetooth *bt;
        int rotation_speed;
        int moving_speed;
    
    public:
        Controller(Wheels *wheels_p, Acceleration *acc_p, Distance *dist_left_p, Distance *dist_bottom_p, RGBLed *rgb_led_p, Bluetooth *bt_p);
        void init(void);
        void setRotationSpeed(int speed);
        void setMovingSpeed(int speed);
        void listenForCommands(void);
        void parseCommand(String command);
        void controlRGBLed(String commandValue);
        bool rotateToAngle(double angle, int precision, int speed_decay, bool *newCommandReceived);
        void controlRotation(double angle);
        void controlMovement(double angle);
};

#endif
