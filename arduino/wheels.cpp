#include "wheels.h"

// WHEEL definitions 

void Wheel::setPin(int num){
    pin = num;
}

void Wheel::init(){
    servo.attach(pin);
}

void Wheel::stop(){
    servo.write(90);
}

int Wheel::checkSpeed(int speed){
    int checkedSpeed = max(speed, 0); // speed can't be negative
    return min(checkedSpeed, 90); // speed can't be greater than 90
}

void Wheel::forward(int speed){
    int finalSpeed = checkSpeed(speed);
    servo.write(90 + finalSpeed);
}

void Wheel::backward(int speed){
    int finalSpeed = checkSpeed(speed);
    servo.write(90 - finalSpeed);
}

// WHEELS definitions 

Wheels::Wheels(int topPin, int bottomPin){
    top.setPin(topPin);
    bottom.setPin(bottomPin);
}

void Wheels::init(){
    top.init();
    bottom.init();
}

void Wheels::stop(){
    top.stop();
    bottom.stop();
}

Wheel Wheels::getTopWheel(){
    return top;
}

Wheel Wheels::getBottomWheel(){
    return bottom;
}

void Wheels::moveForward(int speed, int offset_top, int offset_bottom){
    top.forward(speed + offset_top);
    bottom.backward(speed + offset_bottom);
}

void Wheels::moveBackward(int speed, int offset_top, int offset_bottom){
    top.backward(speed + offset_top);
    bottom.forward(speed + offset_bottom);
}

void Wheels::rotateCounterClockwise(int speed){
    top.backward(speed);
    bottom.backward(speed);
}

void Wheels::rotateClockwise(int speed){
    top.forward(speed);
    bottom.forward(speed);
}
