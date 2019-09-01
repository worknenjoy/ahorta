'use strict'
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const api = require('../server');
const request = require('supertest')
const agent = request.agent(api);
const expect = require('chai').expect
const models = require('../models')
const Helpers = require('./helpers')

describe('Device', () => {

  beforeEach(() => {

    models.User.destroy({where: {}, truncate: true, cascade: true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
      if(rowDeleted === 1){
        console.log('Deleted successfully');
      }
    }, function(err){
      console.log(err);
    });
  })

  it('should add a new device', done => {
    Helpers.register(agent).then(user => {
      models.Device.create({deviceId: 'foo', name: 'bar', UserId: user.body.id}).then(device => {
        expect(device.deviceId).to.deep.equal('foo')
        expect(device.name).to.deep.equal('bar')
        done()
      })
    })
  })

  it('should add a new device with timer', done => {
    Helpers.register(agent).then(user => {
      models.Device.create({deviceId: 'foo', name: 'bar', timer: 3000, UserId: user.body.id}).then(device => {
        expect(device.deviceId).to.deep.equal('foo')
        expect(device.name).to.deep.equal('bar')
        expect(device.timer).to.deep.equal(3000)
        done()
      })
    })
  })

  it('should add a new device and create a humitidy from it', done => {
    Helpers.register(agent).then(user => {
      models.Device.create({deviceId: 'foo', name: 'bar', timer: 3000, UserId: user.body.id}).then(device => {
        device.createReading({value: 20}).then(reading => {
          expect(reading.value).to.equal(20)
          done()
        })
      })
    })
  })
  
})