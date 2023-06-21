#ifndef _BLUETOOTH_H_
#define _BLUETOOTH_H_

#include "SoftwareSerial.h"

class Bluetooth {
    private:
        SoftwareSerial bt;

    public:
        Bluetooth(int rx, int tx);
        void init(void);
        bool hasReceivedData(void);
        String readString(void);
};

#endif
