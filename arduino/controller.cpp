#include "controller.h"
#include "utils.h"

Controller::Controller(Wheels *wheels_p, Acceleration *acc_p, Distance *dist_left_p, Distance *dist_bottom_p, RGBLed *rgb_led_p, Bluetooth *bt_p) {
    wheels = wheels_p;
    acc = acc_p;
    dist_left = dist_left_p;
    dist_bottom = dist_bottom_p;
    rgb_led = rgb_led_p;
    bt = bt_p;

    rotation_speed = BASE_ROTATION_SPEED;
    moving_speed = BASE_MOVING_SPEED;
    moving_offset_bound = MOVING_OFFSET_BOUND;
}

void Controller::init(void) {
    wheels->init();
    acc->init();
    rgb_led->init();
    bt->init();
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

void Controller::controlRotation(float targetAngle) {
    int precision = MAX_ROTATION_PRECISION;
    bool newCommandReceived = false;

    for(int decay = 0; decay < rotation_speed; decay += 3){
        bool isRotated = rotateToAngle(targetAngle, precision, decay, &newCommandReceived);

        if(newCommandReceived || (isRotated && precision == MIN_ROTATION_PRECISION)){
            break;
        }

        if(precision > MIN_ROTATION_PRECISION){
            precision -= 1;
        }

        delay(500);
    }
}

void Controller::controlMovement(float targetAngle) {
    controlRotation(targetAngle);

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
        if(offset_top > moving_offset_bound || offset_bottom > moving_offset_bound){
            offset_top = 0;
            offset_bottom = 0;
        }

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

void Controller::parseCommand(String command) {
    int sepIndex = command.indexOf(':');
    if(sepIndex == -1)
        return;

    String commandName = command.substring(0, sepIndex);
    String commandValue = command.substring(sepIndex + 1, command.length() - 1); // -1 to remove the \n character

    if(commandName == "SPEED"){
        int speed = commandValue.toInt();
        rgb_led->turnOn(0, 0, 255);
        rotation_speed = speed;
        moving_speed = speed;
        delay(1000);
        rgb_led->turnOff();
    }

    if(commandName == "ROT_SPEED"){
        int speed = commandValue.toInt();
        rgb_led->turnOn(0, 0, 255);
        rotation_speed = speed;
        delay(1000);
        rgb_led->turnOff();
    }

    if(commandName == "MOV_SPEED"){
        int speed = commandValue.toInt();
        rgb_led->turnOn(0, 0, 255);
        moving_speed = speed;
        delay(1000);
        rgb_led->turnOff();
    }

    if(commandName == "MOV_OFFSET"){
        int offset = commandValue.toInt();
        rgb_led->turnOn(0, 0, 255);
        moving_offset_bound = offset;
        delay(1000);
        rgb_led->turnOff();
    }

    if(commandName == "ROTATE"){
        if(commandValue == "STOP"){
            wheels->stop();
            return;
        }

        int angle = commandValue.toInt();
        rgb_led->turnOn(0, 255, 0);
        controlRotation(angle);
        rgb_led->turnOff();
    }

    if(commandName == "MOVE"){
        if(commandValue == "STOP"){
            wheels->stop();
            return;
        }

        int angle = commandValue.toInt();
        rgb_led->turnOn(0, 255, 0);
        controlMovement(angle);
        rgb_led->turnOff();
    }
}
