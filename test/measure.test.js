'use strict'

const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server')
const agent = request.agent(api)
const models = require('../models')

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
    agent
      .post(`/sensor/new`)
      .send({
        deviceId: 'device-alpha-rocks',
        name: 'my new device'
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
  it('should retrieve a registry if exist already', done => {
    models.Device.create({deviceId: 'foo', name: 'bar'}).then(device => {
      agent
      .post(`/sensor/new`)
      .send({
        deviceId: device.deviceId,
        name: device.name
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