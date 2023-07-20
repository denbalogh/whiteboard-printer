#ifndef _ANGLE_AND_TEMP_H_
#define _ANGLE_AND_TEMP_H_

#include <Adafruit_MPU6050.h>

class Acceleration {
    private:
        Adafruit_MPU6050 mpu;

    public:
        void init(void);
        float getAngle(void);
        // float getAccX(void);
        // float getAccY(void);
        // float getAccZ(void);
};

#endif
