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

void Controller::controlRGBLed(String commandValue) {
    if(commandValue == "R"){
        rgb_led->turnOn(255, 0, 0);
    }
    if(commandValue == "G"){
        rgb_led->turnOn(0, 255, 0);
    }
    if(commandValue == "B"){
        rgb_led->turnOn(0, 0, 255);
    }
    if(commandValue == "OFF"){
        rgb_led->turnOff();
    }
}

bool Controller::rotateToAngle(double targetAngle, int precision, int speed_decay) {
    bool clockwise;
    double currentAngle = acc->getAngle();
    double angularDistance = calculateAngularDistance(targetAngle, currentAngle, &clockwise);

    if(angularDistance < precision){
        return true;
    }

    if (clockwise) {
        wheels->rotateClockwise(rotation_speed - speed_decay);
    } else {
        wheels->rotateCounterClockwise(rotation_speed - speed_decay);
    }

    for(int i = 0; i < 1000; i++){
        currentAngle = acc->getAngle();
        angularDistance = calculateAngularDistance(targetAngle, currentAngle, &clockwise);

        if(angularDistance < precision){
            break;
        }    
        
        delay(10);  
    }
    
    while(angularDistance > precision){
        currentAngle = acc->getAngle();
        angularDistance = calculateAngularDistance(targetAngle, currentAngle, &clockwise);
        delay(10);
    }

    wheels->stop();
    return false;
}

void Controller::controlRotation(double targetAngle) {
    int precision = MAX_ROTATION_PRECISION;

    for(int decay = 0; decay < rotation_speed; decay += 3){
        if(rotateToAngle(targetAngle, precision, decay) && precision == MIN_ROTATION_PRECISION){
            break;
        }

        if(precision > MIN_ROTATION_PRECISION){
            precision -= 1;
        }

        delay(500);
    }
}

void Controller::setRotationSpeed(int speed) {
    this->rotation_speed = speed;
}

void Controller::setMovingSpeed(int speed) {
    this->moving_speed = speed;
}

void Controller::parseCommand(String command) {
    int sepIndex = command.indexOf(':');
    if(sepIndex == -1)
        return;

    String commandName = command.substring(0, sepIndex);
    String commandValue = command.substring(sepIndex + 1, command.length() - 1); // -1 to remove the \n character

    if(commandName == "LED"){
        controlRGBLed(commandValue);
    }

    if(commandName == "SPEED"){
        int speed = commandValue.toInt();
        rgb_led->turnOn(0, 0, 255);
        setRotationSpeed(speed);
        setMovingSpeed(speed);
        delay(1000);
        rgb_led->turnOff();
    }

    if(commandName == "ROT_SPEED"){
        int speed = commandValue.toInt();
        rgb_led->turnOn(0, 0, 255);
        setRotationSpeed(speed);
        delay(1000);
        rgb_led->turnOff();
    }

    if(commandName == "MOV_SPEED"){
        int speed = commandValue.toInt();
        rgb_led->turnOn(0, 0, 255);
        setMovingSpeed(speed);
        delay(1000);
        rgb_led->turnOff();
    }

    if(commandName == "ROTATE"){
        int angle = commandValue.toInt();
        rgb_led->turnOn(0, 255, 0);
        controlRotation(angle);
        rgb_led->turnOff();
    }
}
