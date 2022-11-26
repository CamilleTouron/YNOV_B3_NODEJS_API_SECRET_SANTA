const { Sequelize } = require('sequelize');
const configuration = require('../configurations/database');

const instance = new Sequelize({
    dialect: configuration.dialect,
    storage: configuration.storage
});

module.exports = {
    instance,
    member: require('./member')(instance)
};