const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const Notify = require('./mail')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

if (process.env.NODE_ENV !== 'production') {
  app.use(cors())
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('port', (process.env.PORT || 3000))

app.get('/sensor', (req, res) => {
  if(req.query.secret === process.env.SECRET) {
    const response = req.query.humidity ? { humidity: req.query.humidity } : {}
    if(response.humidity) {
      Notify.sensor(response.humidity)
    }
    return res.json(response).end()
  }
  return res.status(500).end()
})

app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log('Node app is running on port', app.get('port'))
})

module.exports = app