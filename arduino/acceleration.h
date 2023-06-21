#ifndef _ACCELERATION_H_
#define _ACCELERATION_H_

#include <Adafruit_MPU6050.h>

class Acceleration {
    private:
        Adafruit_MPU6050 mpu;

    public:
        void init(void);
        double getAngle(void);
};

#endif
