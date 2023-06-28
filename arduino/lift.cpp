#include "lift.h"

Lift::Lift(int num){
    pin = num;
}

void Lift::init(){
    servo.attach(pin);
}

void Lift::up(){
    servo.write(180);
}

void Lift::down(){
    servo.write(0);
}
