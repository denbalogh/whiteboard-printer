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

void Wheel::forward(int speed){
    servo.write(90 + speed);
}

void Wheel::backward(int speed){
    servo.write(90 - speed);
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

void Wheels::goLeft(int speed, int angle){
    top.forward(speed);
    bottom.backward(speed);
}

void Wheels::goRight(int speed, int angle){
    top.backward(speed);
    bottom.forward(speed);
}

void Wheels::rotateCounterClockwise(int speed){
    top.backward(speed);
    bottom.backward(speed);
}

void Wheels::rotateClockwise(int speed){
    top.forward(speed);
    bottom.forward(speed);
}
