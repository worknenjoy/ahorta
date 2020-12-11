#include <ESP8266WiFi.h>          //https://github.com/esp8266/Arduino
#include <ESP8266HTTPClient.h>

//needed for library
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>         //https://github.com/tzapu/WiFiManager

#define SensorPin A0
String DevideId = WiFi.macAddress();
String serverName = "http://ahorta.herokuapp.com/sensor";

const long oneSecond = 1000;  // a second is a thousand milliseconds
const long oneMinute = oneSecond * 60;
const long oneHour   = oneMinute * 60;
const long oneDay    = oneHour * 24;

void setup() {
    // put your setup code here, to run once:
    Serial.begin(9600);

    //WiFiManager
    //Local intialization. Once its business is done, there is no need to keep it around
    WiFiManager wifiManager;
    //reset saved settings
    //wifiManager.resetSettings();
    
    //set custom ip for portal
    //wifiManager.setAPStaticIPConfig(IPAddress(10,0,1,1), IPAddress(10,0,1,1), IPAddress(255,255,255,0));

    //fetches ssid and pass from eeprom and tries to connect
    //if it does not connect it starts an access point with the specified name
    //here  "AutoConnectAP"
    //and goes into a blocking loop awaiting configuration
    wifiManager.autoConnect("Ahorta device wifi");
    //or use this for auto generated name ESP + ChipID
    //wifiManager.autoConnect();

    
    //if you get here you have connected to the WiFi
    Serial.println("connected...yeey :)");
}

void loop() {
    // put your main code here, to run repeatedly:  
    int sensorValue = analogRead(SensorPin);
    Serial.println("Sensor value");
    Serial.println(sensorValue);

    Serial.println("Sensor ID");
    Serial.println(DevideId);

    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", "secret");
    int httpResponseCode = http.POST("{\"deviceId\":\"" + DevideId + "\",\"humidity\":\"" + sensorValue + "\"}");
    Serial.println("Response CODE:");
    Serial.println(httpResponseCode);
    http.end();

    // DISPLAY DATA
    //Serial.println("delay for 1 millisecond");
    //delay(1);
    //Serial.println("delay for 1 second");
    //delay(oneSecond);
    //Serial.println("delay for 1 minute");
    //delay(oneMinute);
    Serial.println("delay for 1 hour");
    delay(oneHour);
}
