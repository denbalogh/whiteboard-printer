#ifndef _DISTANCE_H_
#define _DISTANCE_H_

#include <NewPing.h>

#define MAX_DISTANCE 100

class Distance {
    private:
        NewPing sonar;

    public:
        Distance(int echo, int trig);
        int measure();
};

#endif
