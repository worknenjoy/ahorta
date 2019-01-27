import machine
from machine import ADC
from machine import Timer
import wifimgr
import urequests
import os
import network

adc = ADC(0)
adc_value = adc.read()

wlan = wifimgr.get_connection()

if wlan is None:
    print("could not connect")
    while True:
        pass

print("connection started")

def send_sensor_values():
    print("Humidity read %d" % adc_value)
    response = urequests.get("https://ahorta.herokuapp.com/sensor?humidity=%d" % adc_value,headers={"Authorization": ""})
    print("response %s", response)
    response.close()

send_sensor_values()

tim = machine.Timer(-1)
tim.init(period=3600000, mode=Timer.PERIODIC, callback=lambda t:send_sensor_values())

print("finished")