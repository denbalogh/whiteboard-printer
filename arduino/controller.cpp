#include "controller.h"
#include "utils.h"

void setMoveTimes(float moveTimes[3], int spacing){
    moveTimes[0] = spacing * ONE_CM_IN_MS;

    float a = 1.0, b = 1.0, c = 1.0, d = 1.0;
    if(spacing == 1){
        a = 0.63;
        b = 0.6;
        c = 3.0;
        d = 0.31;
    }else if(spacing == 2){
        a = 0.63;
        b = 1.0;
        c = 1.50;
        d = 0.31;
    }

    moveTimes[1] = ((spacing - a) / b) * ONE_CM_IN_MS;
    moveTimes[2] = c * moveTimes[1] + d;
}

Controller::Controller(Wheels *wheels_p, Acceleration *acc_p, Bluetooth *bt_p, Lift *lift_p) {
    wheels = wheels_p;
    acc = acc_p;
    bt = bt_p;
    lift = lift_p;
}

void Controller::init(void) {
    wheels->init();
    acc->init();
    bt->init();
    lift->init();
}

void Controller::listenForCommands(void) {
    if(bt->hasReceivedData()){
        String data = bt->readString();
        parseCommand(data);
    }
}

bool Controller::rotateToAngle(float targetAngle, int precision, int speed_decay, bool *newCommandReceived) {
    bool clockwise;
    float currentAngle = acc->getAngle();
    float angularDistance = calculateAngularDistance(targetAngle, currentAngle, &clockwise);

    if(angularDistance < precision){
        return true;
    }

    if (clockwise) {
        wheels->rotateClockwise(BASE_ROTATION_SPEED - speed_decay);
    } else {
        wheels->rotateCounterClockwise(BASE_ROTATION_SPEED - speed_decay);
    }

    for(int i = 0; i < 1000; i++){
        if(bt->hasReceivedData()){
            *newCommandReceived = true;
            wheels->stop();
            return true;
        }

        currentAngle = acc->getAngle();
        angularDistance = calculateAngularDistance(targetAngle, currentAngle, &clockwise);

        if(angularDistance < precision){
            break;
        }    

        delay(10);  
    }

    wheels->stop();
    return false;
}

void Controller::controlRotation(float targetAngle, bool withDecay) {
    int precision = MAX_ROTATION_PRECISION;
    bool newCommandReceived = false;

    for(int decay = 0; decay < BASE_ROTATION_SPEED; decay += 1){
        bool isRotated = rotateToAngle(targetAngle, precision, decay, &newCommandReceived);

        if(newCommandReceived || !withDecay || (isRotated && precision == MIN_ROTATION_PRECISION)){
            break;
        }

        if(precision > MIN_ROTATION_PRECISION){
            precision -= 1;
        }

        delay(500);
    }
}

void Controller::controlMovement(float targetAngle, bool forward) {
    controlRotation(targetAngle, false);

    bool clockwise;
    float currentAngle, angularDistance;
    int counter = 0;

    int offsetTop = 0;
    int offsetBottom = 0;

    while(true){
        if(bt->hasReceivedData()){
            wheels->stop();
            break;
        }

        if(forward){
            wheels->moveForward(BASE_MOVING_SPEED, offsetTop, offsetBottom);
        } else {
            wheels->moveBackward(BASE_MOVING_SPEED, offsetTop, offsetBottom);
        }
        
        currentAngle = acc->getAngle();
        angularDistance = calculateAngularDistance(targetAngle, currentAngle, &clockwise);

        if(angularDistance > MOVING_PRECISION){
            if(clockwise){
                forward ? offsetTop++ : offsetBottom++;
            } else {
                forward ? offsetBottom++ : offsetTop++;
            }
        } else{
            offsetTop = 0;
            offsetBottom = 0;
        }

        // Check every +-1 second
        // If the robot is going straight up, control the rotation
        if(
            counter % 100 == 0 && 
            (
                (targetAngle == 0 && forward && (currentAngle < (360 - MOVING_UP_ANGLE_THRESHOLD) || currentAngle > MOVING_UP_ANGLE_THRESHOLD)) || 
                (targetAngle == 180 && !forward && (currentAngle < (180 - MOVING_UP_ANGLE_THRESHOLD) || currentAngle >  180 + MOVING_UP_ANGLE_THRESHOLD))
            )
        ){
            controlRotation(targetAngle, false);
            offsetTop = 0;
            offsetBottom = 0;
        }

        delay(10);
        counter++;
    }
}

void Controller::moveForTimeInMs(bool forward, int timeInMs) {
        if(forward){
            wheels->moveForward(BASE_MOVING_SPEED, 0, 0);
        } else {
            wheels->moveBackward(BASE_MOVING_SPEED, 0, 0);
        }

        delay(timeInMs);
        wheels->stop();
}

void Controller::printPoint(void){
    lift->down();
    delay(500);
    lift->up();
    delay(500);
}

void Controller::printImage(int spacing, String image){
    lift->up();
    delay(500);

    int angleRight = 82; // should be 90 but accelerometer sensor is giving 82
    int angleBottomRight = 90 + ANGLE_WHEN_MOVING_TO_NEXT_ROW;
    int angleTopRight = 90 - ANGLE_WHEN_MOVING_TO_NEXT_ROW;

    float moveTimes[3] = {0.0};
    setMoveTimes(moveTimes, spacing);

    int imageLength = image.length();
    int totalPoints = imageLength - getSemicolonsCount(image);
    int row = 1;

    for(int i = 0; i < imageLength; i++){
        if(bt->hasReceivedData()){
            wheels->stop();
            break;
        }

        if(image.charAt(i) == ';'){
            controlRotation(angleBottomRight, true);
            moveForTimeInMs(true, moveTimes[1]);
            controlRotation(angleRight, true);
            moveForTimeInMs(false, moveTimes[2]);
            row++;
            continue;
        }

        bool forward = row % 2 != 0;

        controlRotation(angleRight, true);

        if(image.charAt(i) == 't'){
            printPoint();
        }

        bt->writeString("PRINT_STATUS:" + String(i + 1) + "/" + String(totalPoints));

        if(i != imageLength - 1 && image.charAt(i + 1) != ';'){
            moveForTimeInMs(forward, moveTimes[0]);
        }
    }
}

void Controller::parseCommand(String command) {
    command = command.substring(0, command.length() - 1); // remove the \n character

    // Commands without values in format COMMAND
    if(command == "STOP"){
        wheels->stop();
    }

    // Commands with values in format COMMAND:VALUE
    int sepIndex = command.indexOf(':');
    if(sepIndex == -1)
        return;

    String commandName = command.substring(0, sepIndex);
    String commandValue = command.substring(sepIndex + 1);

    if(commandName == "ROTATE"){
        int angle = commandValue.toInt();
        controlRotation(angle, true);
    }

    if(commandName == "MOVE"){
        int angle = commandValue.toInt();
        controlMovement(angle, true);
    }

    if(commandName == "LIFT"){
        if(commandValue == "UP"){
            lift->up();
        }
        if(commandValue == "DOWN"){
            lift->down();
        }
    }

    if(commandName == "PRINT"){
        // Commands with values in format COMMAND:VALUE
        int sepIndex = commandValue.indexOf(':');
        if(sepIndex == -1)
            return;

        String spacing = commandValue.substring(0, sepIndex);
        String image = commandValue.substring(sepIndex + 1);

        bool isImageValid = isImageCodeValid(image);
        
        if(isImageValid){
            printImage(spacing.toInt(), image);
        }
    }
}
