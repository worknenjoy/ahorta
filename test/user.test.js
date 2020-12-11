'use strict'

const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server');
const agent = request.agent(api);
const models = require('../models');
const Helpers = require('./helpers');

describe("Users", () => {

  beforeEach(() => {

    models.User.destroy({where: {}, truncate: true, cascade: true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
      if(rowDeleted === 1){
        console.log('Deleted successfully');
      }
    }, function(err){
      console.log(err);
    });
  })

  describe('findAll User', () => {
    it('should find user', (done) => {
      agent
        .get('/users')
        .set('Authorization', `Basic ${process.env.SECRET}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          done();
        })
    })
  })

  describe('User', () => {
    it('should update', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'test_update@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, user) => {
          agent
            .put(`/users/${user.body.id}`)
            .send({name: 'Jonh Doe'})
            .set('Authorization', `Basic ${process.env.SECRET}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              expect(res.body).to.exist;
              done();
            })
        })
    })
  })

  describe('register User', () => {
    it('should register', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'teste@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.exist;
          done();
        })
    })
    it('dont allow register with the same user', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'teste43434343@gmail.com', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          agent
            .post('/auth/register')
            .send({email: 'teste43434343@gmail.com', password: 'teste'})
            .expect('Content-Type', /json/)
            .expect(403)
            .end((err, res) => {
              expect(res.statusCode).to.equal(403);
              expect(res.body.error).to.equal('This user already exist, please try to login into your account');
              done();
            })
        })
    })
  })

  describe('login User Local', () => {
    Helpers.register(agent).then(user => {
      it('should user local', (done) => {
        agent
          .post('/authorize/local')
          .send({email: 'teste@gmail.com', password: 'teste'})
          .expect('Content-Type', /json/)
          .expect(302)
          .end((err, res) => {
            expect(res.statusCode).to.equal(302);
            done();
          })
      })
    })
  })

  describe('login User social networks', () => {
    it('should user authenticated', (done) => {
      agent
        .get('/authenticated')
        .set('authorization', 'Bearer token-123') // 1) using the authorization header
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          done();
        })
    })

    it('should user google', (done) => {
      agent
        .get('/authorize/google')
        .send({email: 'teste@gmail.com', password: 'teste'})
        .expect(302)
        .end((err, res) => {
          expect(res.statusCode).to.equal(302);
          expect(res.headers.location).to.include('https://accounts.google.com/o/oauth2/v2/auth?access_type=')
          done();
        })
    })
  })
});