const { DataTypes } = require('sequelize');

module.exports = (instance) => {
    return instance.define('administration', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        idAdmin: {
            type: DataTypes.INTEGER
        },
        idApplicant: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isDone: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        application: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
}