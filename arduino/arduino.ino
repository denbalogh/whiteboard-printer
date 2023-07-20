#include "wheels.h"
#include "acceleration.h"
#include "bluetooth.h"
#include "lift.h"
#include "controller.h"

Wheels wheels(A1, A0);
Acceleration acc;
Bluetooth bt(10, 7);
Lift lift(A2);

Controller controller(&wheels, &acc, &bt, &lift);

void setup() {
  Serial.begin(9600);
  controller.init();
}

void loop() {
  controller.listenForCommands();
}
