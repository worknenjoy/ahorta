import network
import machine
from machine import ADC
from machine import Timer
import urequests
import os

#machine.unique_id()

def send_sensor_values():
    adc = ADC(0)
    adc_value = adc.read()
    print("Humidity read %d", adc_value)
    response = urequests.get("https://ahorta.herokuapp.com/sensor?humidity=%d" % (adc_value),headers={"Authorization": "Basic afe346c2n25cen4f9dn917dn287a8e54e5d6"})
    print("response %s", response)
    response.close()

sta_if = network.WLAN(network.STA_IF)

if not sta_if.isconnected():
    print("connecting to the network...")
    sta_if.active(True)
    sta_if.connect("Telia-729B89", "8CB2DF196C")
    while not sta_if.isconnected():
        pass

print("network config:", sta_if.ifconfig())

send_sensor_values()

tim = Timer(-1)
tim.init(period=3600000, mode=Timer.PERIODIC, callback=lambda t:send_sensor_values())

print("finished")
