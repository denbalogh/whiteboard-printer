#include "bluetooth.h"

Bluetooth::Bluetooth(int rx, int tx) : bt(rx, tx) { }

void Bluetooth::init(void){
    bt.begin(9600);
}

bool Bluetooth::hasReceivedData(void){
    return bt.available() > 0;
}

String Bluetooth::readString(void){
    char c;
    String str = "";
    while(true){
        if(!hasReceivedData()){
            continue;
        }

        c = bt.read();
        str += c;
        
        if(c == '\n'){
            break;
        }
    }
    return str;
}
