'use strict'
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const expect = require('chai').expect
const models = require('../models')

describe('Device', () => {
  it('should add a new device', done => {
    models.Device.create({deviceId: 'foo', name: 'bar'}).then(device => {
      expect(device.deviceId).to.deep.equal('foo')
      expect(device.name).to.deep.equal('bar')
      done()
    })
  })

  it('should add a new device with timer', done => {
    models.Device.create({deviceId: 'foo', name: 'bar', timer: 3000}).then(device => {
      expect(device.deviceId).to.deep.equal('foo')
      expect(device.name).to.deep.equal('bar')
      expect(device.timer).to.deep.equal(3000)
      done()
    })
  })

  it('should add a new device and create a humitidy from it', done => {
    models.Device.create({deviceId: 'foo', name: 'bar', timer: 3000}).then(device => {
      device.createReading({value: 20}).then(reading => {
        expect(reading.value).to.equal(20)
        done()
      })
    })
  })
  
})