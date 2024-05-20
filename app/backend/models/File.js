const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const File = sequelize.define('File', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

File.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(File, { foreignKey: 'userId' });

module.exports = File;
