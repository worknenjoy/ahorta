import network
from machine import ADC
from machine import Timer
import urequests
import os

secret = os.environ['SECRET']

def send_sensor_values():
    adc = ADC(0)
    adc_value = adc.read()
    response = urequests.get("https://ahorta.herokuapp.com/sensor?secret=%s&humidity=%d" % secret, adc_value)
    response.close()

sta_if = network.WLAN(network.STA_IF)

if not sta_if.isconnected():
    print("connecting to the network...")
    sta_if.active(True)
    sta_if.connect("[SSID]", "[PASSWORD]")
    while not sta_if.isconnected():
        pass

print("network config:", sta_if.ifconfig())

send_sensor_values()

tim = Timer(-1)
tim.init(period=3600000, mode=Timer.PERIODIC, callback=lambda t:send_sensor_values())

print("finished")
