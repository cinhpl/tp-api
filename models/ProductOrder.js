const { DataTypes } = require('sequelize');
const sequelize = require('./_database');

const ProductOrder = sequelize.define('ProductOrder', {
    quantity: {
        type: DataTypes.FLOAT
    },
    price: {
        type: DataTypes.FLOAT
    }
})

module.exports = ProductOrder;