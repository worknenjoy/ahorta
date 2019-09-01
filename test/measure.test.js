'use strict'

const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server')
const agent = request.agent(api)
const models = require('../models')
const Helpers = require('./helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

describe('sensor', () => {
  beforeEach(() => {
    models.Device.destroy({where: {}, truncate: true, cascade: true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
      if(rowDeleted === 1){
        console.log('Deleted successfully');
      }
    }, function(err){
      console.log(err);
    });
    models.User.destroy({where: {}, truncate: true, cascade: true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
      if(rowDeleted === 1){
        console.log('Deleted successfully');
      }
    }, function(err){
      console.log(err);
    });
  })
  it('should return an empty object', done => {
    agent
      .get('/sensor')
      .set('Authorization', `Basic ${process.env.SECRET}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.exist
        expect(res.body).to.deep.equal({})
        done()
      })
  })
  it('should return an error when no right secret defined', done => {
    agent
      .get('/sensor')
      .set('Authorization', `Basic 1234`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).to.equal(500)
        done()
      })
  })
  it('should return the humidity sent', done => {
    agent
      .get(`/sensor?humidity=23`)
      .set('Authorization', `Basic ${process.env.SECRET}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.exist
        expect(res.body).to.deep.equal({humidity: '23'})
        done()
      })
  })
  it('should register a new device', done => {
    Helpers.register(agent).then(user => {
      agent
        .post(`/sensor`)
        .send({
          deviceId: 'device-alpha-rocks',
          name: 'my new device',
          UserId: user.body.id
        })
        .set('Authorization', `Basic ${process.env.SECRET}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(201)
          expect(res.body).to.exist
          expect(res.body.deviceId).to.deep.equal('device-alpha-rocks')
          done()
        })
    })
  })
  it('should add a new device with humidity', done => {
    Helpers.register(agent).then(user => {
      agent
        .post(`/sensor`)
        .send({
          deviceId: 'device-alpha-rocks',
          name: 'my new device',
          humidity: 50,
          UserId: user.body.id
        })
        .set('Authorization', `Basic ${process.env.SECRET}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(201)
          expect(res.body).to.exist
          expect(res.body.reading.value).to.deep.equal(50)
          done()
        })
    })
  })
  it('should list devices', done => {
    Helpers.register(agent).then(user => {
      agent
        .post(`/sensor`)
        .send({
          deviceId: 'device-alpha-rocks-1',
          name: 'my new device',
          UserId: user.body.id
        })
        .set('Authorization', `Basic ${process.env.SECRET}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          agent
            .get(`/devices`)
            .set('Authorization', `Basic ${process.env.SECRET}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200)
              expect(res.body).to.exist
              console.log('body', res.body)
              expect(res.body[0].deviceId).to.deep.equal('device-alpha-rocks-1')
              done()
            })
        })
    })
  })
  it('should get device', done => {
    Helpers.register(agent).then(user => {
      agent
        .post(`/sensor`)
        .send({
          deviceId: 'device-alpha-rocks-2',
          name: 'my new device',
          UserId: user.body.id
        })
        .set('Authorization', `Basic ${process.env.SECRET}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          agent
            .get(`/devices/${res.body.id}`)
            .set('Authorization', `Basic ${process.env.SECRET}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200)
              expect(res.body).to.exist
              expect(res.body.deviceId).to.deep.equal('device-alpha-rocks-2')
              done()
            })
        })
    })
  })
  it('should update device', done => {
    Helpers.register(agent).then(user => {
      agent
        .post(`/sensor`)
        .send({
          deviceId: 'device-alpha-rocks-2',
          name: 'my new device',
          UserId: user.body.id
        })
        .set('Authorization', `Basic ${process.env.SECRET}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          agent
            .put(`/devices/${res.body.id}`)
            .send({
              timer: 7200
            })
            .set('Authorization', `Basic ${process.env.SECRET}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200)
              expect(res.body).to.exist
              expect(res.body.timer).to.equal(7200)
              done()
            })
        })
    })
  })
  it('should retrieve a registry if exist already', done => {
    Helpers.register(agent).then(user => {
      models.Device.create({deviceId: 'foo', name: 'bar', UserId: user.body.id}).then(device => {
        agent
        .post(`/sensor`)
        .send({
          deviceId: device.deviceId,
          name: device.name,
          UserId: user.body.id
        })
        .set('Authorization', `Basic ${process.env.SECRET}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.exist
          expect(res.body.deviceId).to.deep.equal('foo')
          done()
        }) 
      })
    })
  })
  
})