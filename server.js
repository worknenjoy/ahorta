const express = require('express')
const app = express()
const Notify = require('./mail')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.set('port', (process.env.PORT || 3000))

app.get('/sensor', (req, res) => {
  if(req.query.secret === process.env.SECRET) {
    const response = req.query.humidity ? { humidity: req.query.humidity } : {}
    if(response.length) {
      Notify.sensor(response.humidity)
    }
    return res.json(response).end()
  }
  throw new Error('You cannot access this resource')
})

app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log('Node app is running on port', app.get('port'))
})

module.exports = app