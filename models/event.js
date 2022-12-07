const { DataTypes } = require('sequelize');

module.exports = (instance) => {
    return instance.define('event', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING
        },
        end: {
            type: DataTypes.DATEONLY
        },
        location: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
}