const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./models')
const bodyParser = require('body-parser')
const models = require('./models')
const Notify = require('./mail')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
  app.use(cors())
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('port', (process.env.PORT || 3000))

app.get('/sensor', (req, res) => {
  if(req.headers.authorization === `Basic ${process.env.SECRET}`) {
    const response = req.query.humidity ? { humidity: req.query.humidity } : {}
    if(response.humidity) {
      Notify.sensor(response.humidity)
    }
    return res.json(response).end()
  }
  return res.status(500).end()
})

app.post('/sensor/new', async (req, res) => {
  if(req.headers.authorization === `Basic ${process.env.SECRET}`) {
    console.log('requisition', req)
    console.log('response', res)
    const response = res.req.body
    const deviceId = response.deviceId
    const name = response.name
    try {
      const user = await models.Device.findOne({
        where: {
          deviceId
        }
      })
      if(user) {
        return res.status(200).json(user).end()
      } else {
        const newUser = await models.Device.create({
          deviceId, name
        })
        return res.status(201).json(newUser).end()
      }  
    } catch (e) {
      console.log('error', e)
      return res.status(500).end()
    }
  }
  return res.status(401).end()
})

db.sequelize.sync().then(() => {
  app.listen(app.get('port'), () => {
    // eslint-disable-next-line no-console
    console.log('Node app is running on port', app.get('port'))
  })
})
module.exports = app