const {DataTypes} = require('sequelize');

module.exports = (instance) => {
    return instance.define('member', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING
        },
        firstname: {
            type: DataTypes.STRING
        },
        mail: {
            type: DataTypes.STRING
        },
        isAdmin: {
            type: DataTypes.BOOLEAN
        },
        password: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
}