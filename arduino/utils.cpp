#include "utils.h"

#include <Arduino.h>

double calculateAngularDistance(double targetAngle, double currentAngle, bool *clockwise){
    double clockwiseDistance = 0;
    double counterclockwiseDistance = 0;

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
