const { DataTypes } = require('sequelize');
const sequelize = require('./_database');

const Tags = sequelize.define('Tags', {
    tag: {
        type: DataTypes.STRING
    }
})

module.exports = Tags;