
'use strict'

const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server')
const agent = request.agent(api)

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

describe('sensor', () => {
  it('should return an empty object', done => {
    agent
      .get(`/sensor?secret=${process.env.SECRET}`)
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
      .get(`/sensor?secret=1234`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).to.equal(500)
        done()
      })
    })
  it('should return the humidity sent', done => {
    agent
      .get(`/sensor?secret=${process.env.SECRET}&humidity=23`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.exist
        expect(res.body).to.deep.equal({humidity: '23'})
        done()
      })
    })
})