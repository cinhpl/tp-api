const { DataTypes } = require('sequelize');
const sequelize = require('./_database');

const UserOrder = sequelize.define('UserOrder', {})

module.exports = UserOrder;