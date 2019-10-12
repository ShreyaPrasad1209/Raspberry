#include <Ultrasonic.h>
Ultrasonic ultrasonic(12,13);//(Trigger_Pin,Echo_Pin)
void setup() {
   Serial.begin(9600);
    }

void loop() {
  Serial.println(ultrasonic.distanceRead());
  delay(3000);
}
