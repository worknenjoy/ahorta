const models = require('./models')

models.User.findAll({limit: 10}).then(users => {
    console.log(users.map(u => console.log(u.dataValues)))
  })

models.Device.create({deviceId: 'foo', name: 'bar', timer: 3000, UserId: 5}).then(device => {
    console.log(device)
  })