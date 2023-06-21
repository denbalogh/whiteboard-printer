#include "distance.h"

Distance::Distance(int echo, int trig) : sonar(trig, echo, MAX_DISTANCE) { }

int Distance::measure(){
    return sonar.ping_cm();
}
