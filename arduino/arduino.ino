#include "wheels.h"
#include "distance.h"
#include "acceleration.h"
#include "bluetooth.h"
#include "rgb_led.h"
#include "controller.h"

Wheels wheels(A1, A0);
Distance dist_left(4, 9);
Distance dist_bottom(2, 3);
Acceleration acc;
Bluetooth bt(10, 7);
RGBLed rgb_led(5, 6, 11);

Controller controller(&wheels, &acc, &dist_left, &dist_bottom, &rgb_led, &bt);

void setup() {
  Serial.begin(9600);
  controller.init();
}

void loop() {
  controller.listenForCommands();
}
