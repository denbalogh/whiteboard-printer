#ifndef _RGB_LED_H_
#define _RGB_LED_H_

#include <Arduino.h>

class RGBLed {
    private:
        int r_pin, g_pin, b_pin;

    public:
        RGBLed(int r_pin, int g_pin, int b_pin);
        void init(void);
        void turnOff(void);
        void turnOn(int r, int g, int b);
        void turnGreen(void);
        void turnRed(void);
        void turnBlue(void);
        void turnMagenta(void);
        void turnYellow(void);
        void turnCyan(void);
        void turnWhite(void);
};

#endif
