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
#define MOVING_PRECISION 1
#define MOVING_OFFSET_BOUND 10

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
        int moving_offset_bound;
    
    public:
        Controller(Wheels *wheels_p, Acceleration *acc_p, Distance *dist_left_p, Distance *dist_bottom_p, RGBLed *rgb_led_p, Bluetooth *bt_p);
        void init(void);
        void listenForCommands(void);
        void parseCommand(String command);
        void controlRGBLed(String commandValue);
        bool rotateToAngle(float angle, int precision, int speed_decay, bool *newCommandReceived);
        void controlRotation(float angle, bool withDecay);
        void controlMovement(float angle);
};

#endif
