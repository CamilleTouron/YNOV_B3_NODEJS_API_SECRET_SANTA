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
            type: DataTypes.STRING,
            allowNull: false
        },
        end: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        priceLimit: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        theme: {
            type: DataTypes.INTEGER
        }

    }, {
        timestamps: false,
        freezeTableName: true
    });
}