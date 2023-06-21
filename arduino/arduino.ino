
#include "wheels.h"
#include "distance.h"
#include "acceleration.h"
#include "bluetooth.h"

Wheels wheels(A0, A1);
Distance dist_left(4, 5);
Distance dist_bottom(2, 3);
Acceleration acc;
Bluetooth bt(6, 7);

void setup() {
  Serial.begin(9600);

  wheels.init();
  acc.init();
  bt.init();

  wheels.stop();
}

void loop() {
  if(bt.hasReceivedData()){
    String data = bt.readString();
    Serial.println(data);
  }
}
