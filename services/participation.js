const dataBase = require('../models');

exports.getParticipations = () => {
    return dataBase.participation.findAll();
};

exports.getParticipationById = (id) => {
    return dataBase.participation.findAll({
        where: {
            id
        }
    });
};

exports.getParticipationByAssociation = (memberId, eventId) => {
    return dataBase.participation.findOne({
        where: {
            memberId,
            eventId
        }
    });
};

exports.getParticipationByEventId = (eventId) => {
    return dataBase.participation.findAll({
        where: {
            eventId: eventId
        }
    });
};

exports.getParticipationByMemberId = (memberId) => {
    return dataBase.participation.findAll({
        where: {
            memberId
        }
    });
};

exports.getParticipationByMemberAttributedId = (memberAttributedId) => {
    return dataBase.participation.findAll({
        where: {
            memberAttributedId
        }
    });
};

exports.getParticipationByOrganizer = (isOrganizer) => {
    return dataBase.participation.findAll({
        where: {
            isOrganizer
        }
    });
};
exports.getParticipation = (memberId, id) => {
    console.log("get",id, memberId)
    return dataBase.participation.findOne({
        where: {
            memberId,
            id
        }
    });
};

exports.addParticipation = (memberId, memberAttributedId,eventId, isOrganizer) => {
    return dataBase.participation.create({ memberId, memberAttributedId, eventId, isOrganizer });
};

exports.deleteParticipationById = (id) => {
    return dataBase.participation.destroy({
        where: {
            id
        }
    });
};

exports.deleteParticipationByMemberId = (memberId) => {
    return dataBase.participation.destroy({
        where: {
            memberId
        }
    });
};

exports.deleteParticipationByMemberId = (memberId) => {
    return dataBase.participation.destroy({
        where: {
            memberId
        }
    });
};

exports.updateOrganizer = (id, isOrganizer) => {
    return dataBase.participation.update(
        { isOrganizer },
        {
            where: {
                id
            }
        })
};

exports.updateMemberAttributedId = async (eventId, memberId, memberAttributedId) => {
    return await dataBase.participation.update(
        { memberAttributedId: memberAttributedId },
        {
            where: {
                eventId: eventId,
                memberId: memberId
            }
        })
};