#include "controller.h"
#include "utils.h"

Controller::Controller(Wheels *wheels_p, Acceleration *acc_p, Distance *dist_left_p, Distance *dist_bottom_p, RGBLed *rgb_led_p, Bluetooth *bt_p, Lift *lift_p) {
    wheels = wheels_p;
    acc = acc_p;
    dist_left = dist_left_p;
    dist_bottom = dist_bottom_p;
    rgb_led = rgb_led_p;
    bt = bt_p;
    lift = lift_p;

    rotation_speed = BASE_ROTATION_SPEED;
    moving_speed = BASE_MOVING_SPEED;
}

void Controller::init(void) {
    wheels->init();
    acc->init();
    rgb_led->init();
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
        wheels->rotateClockwise(rotation_speed - speed_decay);
    } else {
        wheels->rotateCounterClockwise(rotation_speed - speed_decay);
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

    for(int decay = 0; decay < rotation_speed; decay += 3){
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

void Controller::controlMovement(float targetAngle) {
    controlRotation(targetAngle, false);

    bool clockwise;
    float currentAngle, angularDistance;

    int offset_top = 0;
    int offset_bottom = 0;

    while(true){
        if(bt->hasReceivedData()){
            wheels->stop();
            break;
        }

        wheels->moveForward(moving_speed, offset_top, offset_bottom);
        
        currentAngle = acc->getAngle();
        angularDistance = calculateAngularDistance(targetAngle, currentAngle, &clockwise);

        if(angularDistance > MOVING_PRECISION){
            if(clockwise){
                offset_top++;
            } else {
                offset_bottom++;
            }
        } else{
            offset_top = 0;
            offset_bottom = 0;
        }

        delay(10);
    }
}

void Controller::reportDistance(void) {
    float distance_left = dist_left->measure();
    float distance_bottom = dist_bottom->measure();

    String message = "LEFT:" + String(distance_left) + ",BOTTOM:" + String(distance_bottom);
    bt->writeString(message);
}

void Controller::parseCommand(String command) {
    command = command.substring(0, command.length() - 1); // remove the \n character

    // Commands without values in format COMMAND
    if(command == "GET_DISTANCE"){
        reportDistance();
    }
    
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
        rgb_led->turnCyan();
        int angle = commandValue.toInt();
        controlRotation(angle, true);
        rgb_led->turnOff();
    }

    if(commandName == "MOVE"){
        rgb_led->turnGreen();
        int angle = commandValue.toInt();
        controlMovement(angle);
        rgb_led->turnOff();
    }

    if(commandName == "LIFT"){
        if(commandValue == "UP"){
            lift->up();
        }
        if(commandValue == "DOWN"){
            lift->down();
        }
    }

    if(commandName == "IS_IMAGE_VALID"){
        bool isValid = isImageCodeValid(commandValue);
        if(isValid){
            rgb_led->turnGreen();
            bt->writeString("IMAGE_VALID");
        } else {
            rgb_led->turnRed();
            bt->writeString("IMAGE_INVALID");
        }
        delay(1000);
        rgb_led->turnOff();
    }
}
