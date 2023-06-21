#include "wheels.h"

bool isInSpeedLimit(int speed){
    return speed >= MIN_SPEED && speed <= MAX_SPEED;
}

void printSpeedError(char direction[], int pin){
    Serial.print("Exceeded speed limit. ");
    Serial.print(direction);
    Serial.print(" on pin number ");
    Serial.println(pin);
}

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
    if(!isInSpeedLimit(speed)){
        printSpeedError("Forward", pin);
        stop();
        return;
    }
    
    servo.write(90 + speed);
}

void Wheel::backward(int speed){
    if(!isInSpeedLimit(speed)){
        printSpeedError("Backward", pin);
        stop();
        return;
    }
    
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

void Wheels::goLeft(int speed){
    top.forward(speed);
    bottom.backward(speed);
}

void Wheels::goRight(int speed){
    top.backward(speed);
    bottom.forward(speed);
}

void Wheels::turnLeft(int speed){
    top.forward(speed);
    bottom.forward(speed);
}

void Wheels::turnRight(int speed){
    top.backward(speed);
    bottom.backward(speed);
}
