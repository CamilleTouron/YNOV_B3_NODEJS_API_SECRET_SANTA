const eventService = require('../services/event');
const cityService = require('../services/city');
const participationService = require('../services/participation');
const participationController = require('../controllers/participation');
const moment = require('moment');

exports.getEvents = async (req, res) => {
    const events = await eventService.getEvents();
    let data = [];
    for (var event of events) {
        data.push(manageContent(event));
    }
    if (data[0]) {
        res.status(200).json({ data: data });
        return;
    } else {
        res.status(404).json({ message: "There is no event." });
        return;
    }
};

exports.getEventById = async (req, res) => {
    try {
        let event = await eventService.getEventById(parseInt(req.params.id));
        if (event) {
            res.json({data: manageContent(event)});
            return true;
        } else {
            res.status(404).json({ message: "Event does not exist." });
            return false;
        }
    } catch (error) {
        if (res != null) {
            res.status(400).json({ message: "Wrong parameters.", error: error.message });
        }
        return false;
    }
};

exports.createEvent = async (req, res) => {
    try {
        let isOK = await cityService.isCityOk(req.body.location);
        if (req.body
            && req.body.name
            && req.body.location && /^[a-zA-Z]+$/.test(req.body.location) && isOK
            && req.body.end && isDateValid(req.body.end)) {
            let event = await eventService.getEventByName(req.body.name.toLowerCase());
            if (event[0] && event[0].name) {
                res.status(400).json({ message: "Event with this name already exist." });
                return;
            }
            await eventService.addEvent(req.body.name.toLowerCase(), req.body.end, req.body.location);
            event = await eventService.getEventByName(req.body.name.toLowerCase());
            if (!event[0].name) {
                res.status(400).json({ message: "Event not created." });
                return;
            }
            res.status(201).json({ message: "Event well created." });
        } else {
            res.status(400).json({ message: "Wrong parameters." });
        }
    } catch (error) {
        res.status(400).json({ message: "Event not created.", error: error.message });
    }

};

exports.deleteEventById = async (req, res) => {
    if (req.params.id) {
        const event = eventService.getEventById(req.params.id);
        if (event) {
            eventService.deleteEventById(req.params.id);
            res.status(200).json({ message: "Event well deleted." });
        } else {
            res.status(404).json({ message: "Event not found." });
        }
    } else {
        res.status(400).json({ message: "Wrong parameters." });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        let isOK = await cityService.isCityOk(req.body.location);
        let event = await eventService.getEventById(parseInt(req.params.id));
        if (event) {
            if (req.body) {
                let changes = [];
                if (req.body.name) {
                    eventService.updateName(req.params.id, req.body.name.toLowerCase());
                    changes.push("name");
                }
                if (req.body.location && /^[a-zA-Z]+$/.test(req.body.location) && isOK) {
                    eventService.updateLocation(req.params.id, req.body.location.toLowerCase());
                    changes.push("location");
                }
                if (req.body.end && isDateValid(req.body.end)) {
                    eventService.updateDate(req.params.id, req.body.end);
                    changes.push("end");
                }
                res.status(200).json({ message: "Update well done.", changes: changes });
            } else {
                res.status(400).json({ message: "Wrong parameters." });
            }
        } else {
            res.status(404).json({ message: "Event not found." });
        }
    } catch (error) {
        res.status(400).json({ message: "Event not updated.", error: error.message });
    }
};

exports.drawAssociationForEvent = async (req, res) => {
    try {
        if (parseInt(req.params.id)) {
            let participation = await participationService.getParticipationByEventId(parseInt(req.params.id));
            if (participation != null && participation[0] != null) {
                let participants = [];
                let k = 0
                while (participation[k]) {
                    participants.push(participation[k]);
                    k++;
                }
                if (participants.length < 3) {
                    res.status(400).json({ message: "Not enought participants." });
                } else {
                    let buffer = shuffleArray(participants);
                    let i = 0;
                    for (i = 0; i < buffer.length; i++) {
                        let memberAttributed = 0;
                        if (buffer[i + 1] && buffer[i + 1].dataValues && buffer[i + 1].dataValues.memberId) {
                            memberAttributed = buffer[i + 1].dataValues.memberId;
                        } else {
                            memberAttributed = buffer[0].dataValues.memberId;
                        }
                        await participationController.updateMemberAttributedId(parseInt(req.params.id), buffer[i].dataValues.memberId, memberAttributed);
                    }
                    const draw = await participationService.getParticipationByEventId(parseInt(req.params.id));
                    res.status(200).json({ message: "Draw well done.", draw: draw });
                }
            } else {
                res.status(404).json({ message: "There is no participation for this event, you cannot draw." });
            }
        } else {
            res.status(400).json({ message: "Wrong parameters." });
        }
    } catch (error) {
        res.status(400).json({ message: "Draw was not able to be made.", error: error.message });
    }
};

function manageContent(event) {
    return {
        "id": event.id,
        "name": event.name,
        "location": event.location,
        "end": event.end
    }
};

function isDateValid(date) {
    var regex = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
    const isValid = moment(date).isValid();
    return (isValid && regex.test(date));
};

function shuffleArray(a) {
    const array = a;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}