#include "utils.h"

#include <Arduino.h>

float calculateAngularDistance(float targetAngle, float currentAngle, bool *clockwise){
    float clockwiseDistance = 0;
    float counterclockwiseDistance = 0;

    if (targetAngle > currentAngle) {
      clockwiseDistance = targetAngle - currentAngle;
      counterclockwiseDistance = 360 - targetAngle + currentAngle;
    } else {
      clockwiseDistance = 360 - currentAngle + targetAngle;
      counterclockwiseDistance = currentAngle - targetAngle;
    }

    *clockwise = clockwiseDistance < counterclockwiseDistance;
    return min(clockwiseDistance, counterclockwiseDistance);
}
