const { DataTypes } = require('sequelize');
const sequelize = require('./_database');

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        required: true,
      }, 
      address: {
        type: DataTypes.STRING,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, 
    },
    }, {
      indexes: [
        {'unique': true, fields: ['email']}
      ]
    }, 
   
    
);

module.exports = User;