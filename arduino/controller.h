#ifndef _CONTROLLER_H_
#define _CONTROLLER_H_

#include "wheels.h"
#include "bluetooth.h"
#include "lift.h"
#include "acceleration.h"

#define BASE_ROTATION_SPEED 20
#define MAX_ROTATION_PRECISION 5
#define MIN_ROTATION_PRECISION 1

#define BASE_MOVING_SPEED 30
#define MOVING_PRECISION 1
#define MOVING_UP_ANGLE_THRESHOLD 10

#define PIXEL_DISTANCE_IN_CM 2.0
#define ONE_CM_IN_MS 300.0 / 1.8 // empirically measured
#define ANGLE_WHEN_MOVING_TO_NEXT_ROW 30.0

void setMoveTimes(float moveTimes[3], int spacing);

class Controller {
    private:
        Wheels *wheels;
        Acceleration *acc;
        Bluetooth *bt;
        Lift *lift;
    
    public:
        Controller(Wheels *wheels_p, Acceleration *acc_p, Bluetooth *bt_p, Lift *lift_ps);
        void init(void);
        void listenForCommands(void);
        void parseCommand(String command);
        bool rotateToAngle(float angle, int precision, int speed_decay, bool *newCommandReceived);
        void controlRotation(float angle, bool withDecay);
        void controlMovement(float angle, bool forward);
        void moveForTimeInMs(bool forward, int timeInMs);
        void printPoint(void);
        void printSquare(int size, int spacing);
};

#endif
