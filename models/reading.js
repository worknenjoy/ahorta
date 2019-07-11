'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reading = sequelize.define('Reading', {
    value: DataTypes.STRING
  }, {});
  Reading.associate = function(models) {
    Reading.belongsTo(models.Device, { foreignKey: 'DeviceId' })
  };
  return Reading;
};