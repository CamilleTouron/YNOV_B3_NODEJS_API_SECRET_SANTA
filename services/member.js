const dataBase = require('../models');
require('dotenv').config();

exports.getMembers = () => {
    return dataBase.member.findAll();
};

exports.getAdmin = () => {
    return dataBase.member.findAll({
        limit: 1,
        where: {
            firstname: process.env.ADMIN_FIRSTNAME,
            lastname: process.env.ADMIN_LASTNAME,
        },
    });
};

exports.getMemberById = (id) => {
    return dataBase.member.findAll({
        where: {
            id
        }
    });
};

exports.addMember = (lastname, firstname, mail, isAdmin, password) => {
    return dataBase.member.create({ lastname, firstname, mail, isAdmin, password });
};

exports.deleteMemberById = (id) => {
    return dataBase.member.destroy({
        where: {
            id
        }
    });
};

exports.updateLastname = (id, lastname) => {
    return dataBase.member.update(
        { lastname: lastname },
        {
            where: {
                id: id
            }
        })
};
exports.updateFirstname = (id, firstname) => {
    return dataBase.member.update(
        { firstname: firstname },
        {
            where: {
                id: id
            }
        })
};
exports.updateFirstname = (id, firstname) => {
    return dataBase.member.update(
        { firstname: firstname },
        {
            where: {
                id: id
            }
        })
};
exports.updateAdminStatus = (id, isAdmin) => {
    return dataBase.member.update(
        { isAdmin: isAdmin },
        {
            where: {
                id: id
            }
        })
};
exports.updateMail = (id, mail) => {
    return dataBase.member.update(
        { mail: mail },
        {
            where: {
                id: id
            }
        })
};
exports.updatePassword = (id, password) => {
    return dataBase.member.update(
        { password: password },
        {
            where: {
                id: id
            }
        })
};