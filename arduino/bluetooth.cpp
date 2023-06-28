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

    // Check for initial data to prevent infinite loop
    if(!hasReceivedData()){
        return "";
    }

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

void Bluetooth::writeString(String str){
    bt.print(str + "\n");
}
