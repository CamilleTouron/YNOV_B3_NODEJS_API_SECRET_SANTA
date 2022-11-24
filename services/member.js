const dataBase = require('../models');

exports.getMembers = () => {
    return dataBase.member.findAll();
}

exports.getMemberByPseudo = (pseudo) => {
    return dataBase.member.findAll({
        where: {
            pseudo
        }
    });
}
exports.getMemberById = (id) => {
    return dataBase.member.findAll({
        where: {
            id
        }
    });
}

exports.addMember = (lastname, firstname, mail, pseudo, isAdmin, password) => {
    return dataBase.member.create({ lastname, firstname, mail, pseudo, isAdmin, password});
}

exports.deleteMemberById = (id) => {
    return dataBase.member.destroy({
        where: {
            id
        }
    });
}