const {DataTypes} = require('sequelize');

module.exports = (instance) => {
    return instance.define('participation', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        memberId: {
            type: DataTypes.INTEGER
        },
        memberAttributedId: {
            type: DataTypes.INTEGER
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        isOrganizer: {
            type: DataTypes.BOOLEAN
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
}