#ifndef _LIFT_H_
#define _LIFT_H_

#include <Servo.h>

class Lift {
    private:
        int pin;
        Servo servo;

    public:
        Lift(int num);
        void init();
        void up(void);
        void down(void);
};

#endif
