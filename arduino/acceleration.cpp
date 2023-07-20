#include "acceleration.h"

void Acceleration::init(void) { 
    if (!mpu.begin()) {
    Serial.println(F("Acceleration sensor init failed"));
    while (1)
        yield();
    }

    mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
    mpu.setGyroRange(MPU6050_RANGE_500_DEG);
    mpu.setFilterBandwidth(MPU6050_BAND_5_HZ);
}

// float Acceleration::getAccX(void){
//     sensors_event_t a, g, temp;
//     mpu.getEvent(&a, &g, &temp);

//     return a.acceleration.x;
// }

// float Acceleration::getAccY(void){
//     sensors_event_t a, g, temp;
//     mpu.getEvent(&a, &g, &temp);

//     return a.acceleration.y;
// }

// float Acceleration::getAccZ(void){
//     sensors_event_t a, g, temp;
//     mpu.getEvent(&a, &g, &temp);

//     return a.acceleration.z;
// }


float Acceleration::getAngle(void){
    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);

    float angle = atan2(a.acceleration.y, a.acceleration.z) * 180 / PI; // Range -180 to 180
    angle += 180; // Shift the range to 0 to 360
    
    if (angle >= 360) {
        angle -= 360; // Wrap around if angle exceeds 360
    }

    return angle;
}
