'use strict'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Notify = require('../mail')

const expect = require('chai').expect
var nock = require('nock')

var mock_sg = nock('https://api.sendgrid.com')
  .post('/v3/mail/send')
  .reply(200, {
    message: 'success'
  });

describe('SendGrid', done => {
  it('should send an email', () => {
    Notify.sensor({humidity: 23}).then(response => {
      console.log('response', response)
      expect(mail.statusCode).to.equal(200)
      done()
    })
  })
})