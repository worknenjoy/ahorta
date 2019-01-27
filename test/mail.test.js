'use strict'

const mail = require('../mail')

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

describe('SendGrid', () => {
  it('should send an email', done => {
    Notify.sensor('foo@example', 23).then(response => {
      expect(response[0].body.message).to.equal('success')
      done()
    }).catch(e => done(e))
  })
})