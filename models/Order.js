const { DataTypes } = require('sequelize');
const sequelize = require('./_database');

const Order = sequelize.define('Order', {
    totalAmount : {
        type: DataTypes.FLOAT
    }
})

module.exports = Order;