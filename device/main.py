import network
import machine
from machine import ADC
from machine import Timer
import urequests
import os

secret = os.environ['SECRET']

def get_device():
    device_id = machine.unique_id()
    ssid = ''
    password = ''
    timer = 3600000
    response = urequests.post("https://ahorta.herokuapp.com/sensor/new", params={"deviceId": device_id}, headers={"Authorization": "Basic %s" % secret})
    device_json = response.json()
    print(device_json)
    result = device_json.get('result')
    print(result)
    ssid = result.ssid
    password = result.password
    timer = result.timer
    response.close()
    return { "ssid": ssid, "password": password, "timer": timer }

def send_sensor_values():
    adc = ADC(0)
    adc_value = adc.read()
    response = urequests.get("https://ahorta.herokuapp.com/sensor?humidity=%d" % adc_value, headers={"Authorization": "Basic %s" % secret})
    response.close()

sta_if = network.WLAN(network.STA_IF)
get_device_data = get_device()
if not sta_if.isconnected():
    print("connecting to the network...")
    sta_if.active(True)
    sta_if.connect(get_device_data["ssid"], get_device_data["password"])
    while not sta_if.isconnected():
        pass

print("network config:", sta_if.ifconfig())

send_sensor_values()

tim = Timer(-1)
tim.init(period=get_device_data["timer"] or 3600000, mode=Timer.PERIODIC, callback=lambda t:send_sensor_values())

print("finished")
