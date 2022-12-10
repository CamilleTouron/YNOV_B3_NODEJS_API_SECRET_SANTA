const dataBase = require('../models');

exports.getAdministrations = () => {
    return dataBase.administration.findAll();
};

exports.getAdministrationById = (id) => {
    return dataBase.administration.findOne({
        where: {
            id
        }
    });
};

exports.getAdministrationByIdAdmin = (idAdmin) => {
    return dataBase.administration.findAll({
        where: {
            idAdmin
        }
    });
};

exports.getAdministrationByIdApplicant = (idApplicant) => {
    return dataBase.administration.findAll({
        where: {
            idApplicant
        }
    });
};

exports.addAdministration = (idApplicant, application) => {
    return dataBase.administration.create({ idAdmin: null, idApplicant:idApplicant, isDone: false,application:application });
};

exports.deleteAdministrationById= (id) => {
    return dataBase.administration.destroy({
        where: {
            id
        }
    });
};

exports.deleteAdministrationByIdAdmin = (idAdmin) => {
    return dataBase.administration.destroy({
        where: {
            idAdmin
        }
    });
};

exports.deleteAdministrationByIdApplicant = (idApplicant) => {
    return dataBase.administration.destroy({
        where: {
            idApplicant
        }
    });
};

exports.updateIdAdmin = (id, idAdmin) => {
    return dataBase.administration.update(
        { idAdmin: idAdmin },
        {
            where: {
                id: id
            }
        })
};

exports.updateIsDone = (id, isDone) => {
    return dataBase.administration.update(
        { isDone: isDone },
        {
            where: {
                id: id
            }
        })
};