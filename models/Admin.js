const { DataTypes } = require('sequelize');
const sequelize = require('./_database');

const Admin = sequelize.define('Admin', {
    email: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        required: true,
      }, 
      
    }, {
      indexes: [
        {'unique': true, fields: ['email']}
      ]
    },
)

module.exports = Admin;