'use strict';
module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('Device', {
    deviceId: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    ssid: DataTypes.STRING,
    password: DataTypes.STRING,
    timer: DataTypes.INTEGER,
    threshold: DataTypes.INTEGER
  }, {});
  Device.associate = function(models) {
    Device.hasMany(models.Reading, { foreignKey: 'DeviceId' })
    Device.belongsTo(models.User)
  };
  return Device;
};