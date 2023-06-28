#include "rgb_led.h"

RGBLed::RGBLed(int r, int g, int b){
    r_pin = r;
    g_pin = g;
    b_pin = b;
}

void RGBLed::init(void){
    pinMode(r_pin, OUTPUT);
    pinMode(g_pin, OUTPUT);
    pinMode(b_pin, OUTPUT);
}

void RGBLed::turnOn(int r, int g, int b){
    analogWrite(r_pin, r);
    analogWrite(g_pin, g);
    analogWrite(b_pin, b);
}

void RGBLed::turnGreen(void){
    turnOn(0, 255, 0);
}

void RGBLed::turnRed(void){
    turnOn(255, 0, 0);
}

void RGBLed::turnBlue(void){
    turnOn(0, 0, 255);
}

void RGBLed::turnMagenta(void){
    turnOn(255, 0, 255);
}

void RGBLed::turnYellow(void){
    turnOn(255, 255, 0);
}

void RGBLed::turnCyan(void){
    turnOn(0, 255, 255);
}

void RGBLed::turnWhite(void){
    turnOn(255, 255, 255);
}

void RGBLed::turnOff(void){
    turnOn(0, 0, 0);
}
