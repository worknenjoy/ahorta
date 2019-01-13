'use strict';
module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('Device', {
    deviceId: DataTypes.STRING,
    name: DataTypes.STRING,
    ssid: DataTypes.STRING,
    password: DataTypes.STRING,
    timer: DataTypes.INTEGER
  }, {});
  Device.associate = function(models) {
    // associations can be defined here
  };
  return Device;
};