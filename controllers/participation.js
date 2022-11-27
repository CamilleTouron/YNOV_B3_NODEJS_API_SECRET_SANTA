const participationService = require('../services/participation');
const eventService = require('../services/event');
const memberService = require('../services/member');

exports.getParticipations = async (req, res) => {
    const participations = await participationService.getParticipations();
    let data = [];
    for (var participation of participations) {
        data.push(manageContent(participation));
    }
    if (data[0]) {
        res.status(200).json({ data: data });
        return;
    } else {
        res.status(404).json({ message: "There is no participation." });
        return;
    }

};

exports.getParticipationById = async (req, res) => {
    try {
        let participation = await participationService.getParticipationById(parseInt(req.params.id));
        if (participation[0]) {
            res.json({ data: manageContent(participation[0]) });
            return true;
        } else {
            res.status(404).json({ message: "Participation does not exist." });
            return false;
        }
    } catch (e) {
        if (res != null) {
            res.status(400).json({ message: "Wrong parameters.", error: e.message });
        }
        return false;
    }
};

exports.createParticipation = async (req, res) => {
    try {
        if (req.body && req.body.memberId && req.body.eventId && req.body.isOrganizer != null) {
            const member = await memberService.getMemberById(parseInt(req.body.memberId));
            const event = await eventService.getEventById(parseInt(req.body.eventId));
            const participation = await participationService.getParticipationByAssociation(parseInt(req.body.memberId), parseInt(req.body.eventId));

            if (member[0] == undefined) {
                res.status(404).json({ message: "Member does not exists." });
                return;
            }

            if (event[0] == undefined) {
                res.status(404).json({ message: "Event does not exists." });
                return;
            }
            if (!participation[0] == undefined) {
                res.status(400).json({ message: "Participation with this member already exist." });
                return;
            }
            console.log(participation)
            await participationService.addParticipation(req.body.memberId, req.body.eventId, req.body.isOrganizer);

            res.status(201).json({ message: "Participation well created." });

        } else {
            console.log(req.body.memberId, req.body.memberAttributedId, req.body.eventId, req.body.isOrganizer != null)
            res.status(400).json({ message: "Wrong parameters." });
        }
    } catch (error) {
        res.status(400).json({ message: "Participation not created.", error: error.message });
    }

};

exports.deleteParticipationById = async (req, res) => {
    if (req.params.id) {
        const participation = participationService.getParticipationById(req.params.id);
        if (participation) {
            participationService.deleteParticipationById(req.params.id);
            res.json({ message: "Participation well deleted." });
        } else {
            res.status(404).json({ message: "Participation not found." });
        }
    } else {
        res.status(400).json({ message: "Wrong parameters." });
    }
};

exports.updateParticipation = async (req, res) => {
    try {
        let participation = await participationService.getParticipationById(parseInt(req.params.id));
        if (participation) {
            if (req.body) {
                let changes = [];
                if (req.body.isOrganizer) {
                    this.updateOrganizer(parseInt(req.params.id), req.body.isOrganizer)
                    changes.push("isOrganizer");
                }
                if (req.body.memberAttributedId) {
                    this.updateMemberAttributedId(parseInt(req.params.id), req.body.memberAttributedId)
                    changes.push("memberAttributedId");
                }
                res.status(200).json({ message: "Update well done.", changes: changes });
            } else {
                res.status(400).json({ message: "Wrong parameters." });
            }
        } else {
            res.status(404).json({ message: "Participation not found." });
        }
    } catch (error) {
        res.status(400).json({ message: "Participation not updated.", error: error.message });
    }
};

exports.updateOrganizer = async (id, isOrganizer) => {
    await participationService.updateOrganizer(id, isOrganizer);
    return;
};

exports.updateMemberAttributedId = async (id, memberAttributedId) => {
    await participationService.updateMemberAttributedId(id, memberAttributedId);
    return;
};

function manageContent(participation) {
    return {
        "id": participation.id,
        "memberId": participation.memberId,
        "eventId": participation.eventId,
        "isOrganizer": participation.isOrganizer
    }
};
