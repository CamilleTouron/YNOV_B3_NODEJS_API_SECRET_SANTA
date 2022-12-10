const dataBase = require('../models');
exports.getEvents = () => {
    return dataBase.event.findAll();
};

exports.getEventById = (id) => {
    return dataBase.event.findOne({
        where: {
            id
        }
    });
};

exports.getEventByName = (name) => {
    return dataBase.event.findAll({
        where: {
            name
        }
    });
};

exports.addEvent = (name, end, location, priceLimit, theme) => {
    return dataBase.event.create({ name, end, location, priceLimit, theme });
};

exports.deleteEventById = (id) => {
    return dataBase.event.destroy({
        where: {
            id
        }
    });
};

exports.updateName = (id, name) => {
    return dataBase.event.update(
        { name: name },
        {
            where: {
                id: id
            }
        })
};
exports.updateDate = (id, date) => {
    return dataBase.event.update(
        { end: date },
        {
            where: {
                id: id
            }
        })
};
exports.updateLocation = (id, location) => {
    return dataBase.event.update(
        { location: location },
        {
            where: {
                id: id
            }
        })
};

exports.updatePriceLimit = (id, priceLimit) => {
    return dataBase.event.update(
        { priceLimit: priceLimit },
        {
            where: {
                id: id
            }
        })
};

exports.updateTheme = (id, theme) => {
    return dataBase.event.update(
        { theme: theme },
        {
            where: {
                id: id
            }
        })
};