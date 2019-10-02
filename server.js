if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./models')
const bodyParser = require('body-parser')
const session = require('express-session')
const models = require('./models')
const Notify = require('./mail')
const passport = require('passport')
require('./passport')
const jwt = require('jsonwebtoken')



if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
  //app.use(cors())
}

app.use(cors())
//app.options('localhost:3000', cors());
app.use(session({
  secret: process.env.SECRET_PHRASE || '1234'
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('port', (process.env.PORT || app.get('port') || 3000))

app.use(passport.initialize())
app.use(passport.session())

app.get('/sensor', (req, res) => {
  if(req.headers.authorization === `Basic ${process.env.SECRET}`) {
    const response = req.query.humidity ? { humidity: req.query.humidity } : {}
    if(response.humidity) {
      Notify.sensor(response.humidity)
    }
    res.json(response).end()
  }
  res.status(500).end()
})

app.get('/devices', async (req, res, next) => {
  if(req.headers.authorization === `Basic ${process.env.SECRET}`) {
    try {
      const devices = await models.Device.findAll({
        order: [
          ['id', 'DESC'],
          [models.Reading, 'id', 'DESC']
        ],
        limit: 20,
        include: [
          {
            model: models.Reading
          },
          {
            model: models.User
          }
        ]
      })
      console.log('response from devices', devices);
      return res.json(devices)
    } catch (e) {
      console.log('error', e)
      return res.status(500).end()
    }
  }
})

app.get('/users', async (req, res, next) => {
  if(req.headers.authorization === `Basic ${process.env.SECRET}`) {
    try {
      const users = await models.User.scope('withoutPassword').findAll({
        order: [
          ['id', 'DESC']
        ],
        limit: 20
      })
      return res.json(users)
    } catch (e) {
      console.log('error', e)
      return res.status(500).end()
    }
  }
})

app.get('/users/:id', async (req, res, next) => {
  if(req.headers.authorization === `Basic ${process.env.SECRET}`) {
    try {
      const user = await models.User.scope('withoutPassword').findOne({
        where: {
          id: req.params.id
        }
      })
      return res.json(user)
    } catch (e) {
      console.log('error', e)
      return res.status(404).end()
    }
  }
})

app.put('/users/:id', async (req, res, next) => {
  if(req.headers.authorization === `Basic ${process.env.SECRET}`) {
    try {
      const user = await models.User.update(req.body, {
        where: {
          id: req.params.id
        }
      })
      return res.json(user)
    } catch (e) {
      console.log('error', e)
      return res.status(404).end()
    }
  }
})

app.post('/users', (req, res, next) => {
  if(req.headers.authorization === `Basic ${process.env.SECRET}`) {
    if(!req.body.email && !req.body.password) res.status(403).send('missing parameters')
    models.User.findOne({where: 
      { email: req.body.email }
    }).then(user => {
      if (user && user.dataValues && user.dataValues.email) {
        res.status(403).send({ error: 'user.exist' })
        return
      }
      models.User.build(req.body)
        .save()
        .then(data => {
          res.send(data)
        }).catch(error => {
          // eslint-disable-next-line no-console
          console.log(error)
          res.status(403).send(error)
        })
    }).catch(e => {
      console.log('no user', e)
    })
  }
})

app.get('/devices/:id', (req, res) => {
  if(req.headers.authorization === `Basic ${process.env.SECRET}`) {
    return models.Device.findById(req.params.id, {
      order: [
        ['id', 'DESC'],
        [models.Reading, 'id', 'DESC']
      ],
      include: [models.Reading, models.User]
    }).then(device => {
      return res.json(device).end()
    }).catch(e => {
      console.log('error', e)
      return res.status(500).end()
    })
    
  }
  res.status(500).end()
})

app.put('/devices/:id', (req, res) => {
  if(req.headers.authorization === `Basic ${process.env.SECRET}`) {
    return models.Device.update(req.body, {
        where: {
          id: req.params.id
        },
        returning: true
      }).then(device => {
        const deviceData = device[1][0].dataValues
        return res.json(deviceData).end()
    }).catch(e => {
      console.log('error', e)
      return res.status(500).end()
    })
    
  }
  res.status(500).end()
})

app.post('/sensor', async (req, res) => {
  if(req.headers.authorization === `Basic ${process.env.SECRET}`) {
    const response = res.req.body
    const deviceId = response.deviceId
    const humidity = response.humidity
    const newUserMail = response.email
    const UserId = response.UserId
    const name = response.name
    try {
      const device = await models.Device.findOne({
        where: {
          deviceId
        },
        order: [
          ['id', 'DESC'],
          [models.Reading, 'id', 'DESC']
        ],
        include: [ models.Reading ]
      })
      if(device) {
        if(humidity) {
          console.log('device readings last with humidity', device.Readings[0], humidity)
          if(device.Readings && device.Readings.length && parseInt(humidity) === parseInt(device.Readings[0].dataValues.value)) return res.status(200).json({timer: device.timer}).end()
          Notify.sensor(device.email, humidity)
          const userReading = await device.createReading({value: humidity})
          //return res.status(200).json({user, ...{reading: userReading}}).end()
          return res.status(200).json({timer: device.timer}).end()
        }
        return res.status(200).json(device).end()
      } else {
        const newUser = await models.Device.create({
          deviceId, name, UserId
        })
        if(humidity) {
          Notify.sensor(newUserMail, humidity)
          const userReading = await newUser.createReading({value: humidity})
          return res.status(201).json({newUser, ...{reading: userReading}}).end()
        }
        return res.status(201).json(newUser).end()
      }  
    } catch (e) {
      console.log('error', e)
      return res.status(500).end()
    }
  }
  return res.status(401).end()
})

app.post('/auth/register', (req, res) => {
  models.User.findOne({where: 
    { email: req.body.email }
  }).then(user => {
    if (user && user.dataValues && user.dataValues.email) {
      res.status(403).send({ error: 'This user already exist, please try to login into your account' })
      return
    }
    req.body.password = models.User.generateHash(req.body.password)
    models.User.build(req.body)
      .save()
      .then(data => {
        res.send(data)
      }).catch(error => {
        // eslint-disable-next-line no-console
        console.log(error)
        res.status(401).send(error)
      })
  }).catch(e => {
    console.log('no user', e)
    res.status(401).send(error)
  })
})

app.post('/authorize/local', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(401).send({ 'reason': 'Invalid credentials' })
    }
    if (!user) {
      return res.status(401).send({ 'reason': 'Invalid credentials' })
    }
    else {
      req.logIn(user, { session: false }, (err) => {
        if (err) {
          return res.status(500).send({ 'error': 'Server error' })
        }
        res.set('Authorization', 'Bearer ' + user.token).status(200).json({token: user.token})
      })
    }
  })(req, res, next)
})

app.get('/authenticated', (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]

  if (token) {
    return jwt.verify(token, process.env.SECRET_PHRASE || '123', (err, decoded) => {
      // the 401 code is for unauthorized status
      if (err) {
        return res.status(401).end()
      }

      const userData = decoded
      console.log('userData', userData)
      // check if a user exists
      return models.User.findOne({where: {email: userData.email}}).then(user => {
        return res.send({ authenticated: true, user: user })
      }).catch(e => {
        // eslint-disable-next-line no-console
        console.log('error to sign user')
        return res.status(401).end()
      })
    })
  }
  return next()
})

app.get('/authorize/google', passport.authenticate('google', {scope: ['email'], accessType: 'offline'}))
app.get('/callback/google', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/signin'
}))


db.sequelize.sync().then(() => {
  app.listen(app.get('port'), () => {
    // eslint-disable-next-line no-console
    console.log('Node app is running on port', app.get('port'))
  })
})
module.exports = app
