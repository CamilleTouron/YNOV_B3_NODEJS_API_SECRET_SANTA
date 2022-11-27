const { Sequelize } = require('sequelize');
const configuration = require('../configurations/database');

const instance = new Sequelize({
    dialect: configuration.dialect,
    storage: configuration.storage,
    dialectOptions: {
        dateStrings: true
      },
});

module.exports = {
    instance,
    member: require('./member')(instance),
    event: require('./event')(instance),
    participation: require('./participation')(instance)
};