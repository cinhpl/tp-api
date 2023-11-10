const { DataTypes } = require('sequelize');
const sequelize = require('./_database');

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.FLOAT
    },
    description: {
        type: DataTypes.STRING
    },
    stocks: {
        type: DataTypes.FLOAT
    },
})

module.exports = Product