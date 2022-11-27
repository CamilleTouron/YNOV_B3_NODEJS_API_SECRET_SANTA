const eventService = require('../services/event');
const moment = require('moment');

exports.getEvents = async (req, res) => {
    const events = await eventService.getEvents();
    let data = [];
    for (var event of events) {
        data.push(manageContent(event));
    }
    res.status(200).json({ data: data });
};

exports.getEventById = async (req, res) => {
    try {
        let event = await eventService.getEventById(parseInt(req.params.id));
        if (event[0]) {
            res.json({ data: manageContent(event[0]) });
            return true;
        } else {
            res.status(404).json({ message: "Event does not exist." });
            return false;
        }
    } catch (e) {
        if (res != null) {
            res.status(400).json({ message: "Wrong parameters." , error: e.message});
        }
        return false;
    }
};

exports.createEvent = async (req, res) => {
    try {
        if (req.body
            && req.body.name
            && req.body.location && /^[a-zA-Z]+$/.test(req.body.location)
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
            res.json({ message: "Event well deleted." });
        } else {
            res.status(404).json({ message: "Event not found." });
        }
    } else {
        res.status(400).json({ message: "Wrong parameters." });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        let event = await eventService.getEventById(parseInt(req.params.id));
        if (event) {
            if (req.body) {
                let changes=[];
                if (req.body.name) {
                    eventService.updateName(req.params.id, req.body.name.toLowerCase());
                    changes.push("name");
                }
                if (req.body.location && /^[a-zA-Z]+$/.test(req.body.location)) {
                    eventService.updateLocation(req.params.id, req.body.location.toLowerCase());
                    changes.push("location");
                }
                if (req.body.end && isDateValid(req.body.end)) {
                    eventService.updateDate(req.params.id, req.body.end);
                    changes.push("end");
                }
                res.status(200).json({ message: "Update well done." , changes : changes});
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

function manageContent(event) {
    return {
        "id": event.id,
        "name": event.name,
        "location": event.location,
        "end":event.end
    }
};

function isDateValid(date) {
    var regex = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
    const isValid = moment(date).isValid();
    return (isValid &&  regex.test(date));
}