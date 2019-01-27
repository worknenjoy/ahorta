import wifimgr
import machine
from machine import ADC
from machine import Timer
import urequests
import os
import time

secret = ''
headers = {"Authorization": "Basic %s" % secret}

adc = ADC(0)
adc_value = adc.read()
device_id = machine.unique_id()

wlan = wifimgr.get_connection()

if wlan is None:
    print("could not connect")
    while True:
        pass

print("connection started")

def send_data():
    timer = 3600000
    response = urequests.post("https://ahorta.herokuapp.com/sensor", json={"deviceId": device_id, "humidity": adc_value}, headers=headers)
    device_json = response.json()
    response.close()
    timer = device_json.get('timer')
    return { "timer": timer }

data = send_data()

tim = Timer(-1)
tim.init(period=data["timer"] or 3600000, mode=Timer.PERIODIC, callback=lambda t:send_sensor_values())

print("finished")
