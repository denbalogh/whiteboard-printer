#ifndef _UTILS_H_
#define _UTILS_H_

#include <Arduino.h>

float calculateAngularDistance(float targetAngle, float currentAngle, bool *clockwise);
bool isImageCodeValid(String code);

#endif
