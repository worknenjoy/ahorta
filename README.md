# ahorta
Plant as a service

This is the server that receive the data from the IOT Device that reads the soil humidity from a plant.

The full article of how it was built you can find here: https://alexandremagno.net/en/2018/12/developing-iot-device-humidity-sensor-for-plants-using-arduino/

In Portuguese: https://alexandremagno.net/2018/12/desenvolvendo-um-projeto-com-internet-das-coisas-sensor-de-humidade-para-plantas-com-arduino/

## Create database


#### Install postgres
1. install: `brew install postgres` (mac)
2. start the service: `brew services start postgresql`
3. create postgres user: `createuser postgres -s`
4. Login into postgres cli: `psql -U postgres`
5. Create test database: `create database ahorta_test;`
6. Create a dev database: `create database ahorta_dev;`
7. Exit: `\q`
