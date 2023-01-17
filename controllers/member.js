const memberService = require('../services/member');
const passwordService = require('../services/password');
const participation = require('../services/participation');
const administrationService = require('./administration');
require('dotenv').config();

exports.getMembers = async (req, res) => {
    const members = await memberService.getMembers();
    let data = [];
    for (var member of members) {
        data.push(manageContent(member));
    }
    if (data[0]) {
        res.status(200).json({ data: data });
        return;
    } else {
        res.status(404).json({ message: "There is no participation." });
        return;
    }
};

exports.getMemberById = async (req, res) => {
    try {
        let member = await memberService.getMemberById(parseInt(req.params.id));
        if (member) {
            const participations = await participation.getParticipationByMemberId(parseInt(req.params.id));
            res.status(200).json({ data: manageContent(member), participations: (participations[0] != undefined ? participations : "none") });
            return true;
        } else {
            res.status(404).json({ message: "Member does not exist." });
            return false;
        }
    } catch (error) {
        if (res != null) {
            res.status(400).json({ message: "Error getting member.", error: error.message });
        }
        return false;
    }
};

exports.createMember = async (req, res) => {
    try {
        if (req.body && req.body.firstname && /^[a-zA-Z]+$/.test(req.body.firstname) && req.body.firstname != (process.env.ADMIN_FIRSTNAME || "admin")
            && req.body.lastname && /^[a-zA-Z]+$/.test(req.body.lastName) && req.body.firstname != (process.env.ADMIN_LASTNAME || "admin")
            && req.body.mail && req.body.mail.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            && (req.body.isAdmin === true || req.body.isAdmin === false)
            && req.body.password && !/\s/.test(req.body.password)) {
            let member = await memberService.getMemberByMail(req.body.mail.toLowerCase());
            if (member && member.mail) {
                res.status(400).json({ message: "Member with this mail already exist." });
                return;
            }
            await memberService.addMember(req.body.lastname, req.body.firstname, req.body.mail.toLowerCase(), false, passwordService.crypt(req.body.password));
            member = await memberService.getMemberByMail(req.body.mail.toLowerCase());
            if (!member.mail) {
                res.status(400).json({ message: "Member not created." });
                return;
            }
            if (req.body.isAdmin === true) {
                const isRequest = await administrationService.create(member.id, "Request to be admin.");
                res.status(201).json({ message: "Member well created, request to be admin has been send." });
            } else {
                res.status(201).json({ message: "Member well created." });
            }
        } else {
            res.status(400).json({ message: "Wrong parameters." });
        }
    } catch (error) {
        res.status(400).json({ message: "Member not created.", error: error.message });
    }

};

exports.deleteMemberByIdAdmin = async (req, res) => {
    if (req.params.id) {
        const member = await memberService.getMemberById(req.params.id);
        if (member && member.isAdmin == false) {
            await memberService.deleteMemberById(req.params.id);
            await participation.deleteParticipationByMemberId(req.params.id)
            res.json({ message: "Member well deleted." });
        } else {
            res.status(404).json({ message: "Member not found or cannot delete admin." });
        }
    } else {
        res.status(400).json({ message: "Wrong parameters." });
    }
};

exports.deleteMemberById = async (req, res) => {
    if (req.params.id) {
        const member = await memberService.getMemberById(req.params.id);
        if (member && member.isAdmin == false) {
            const request = administrationService.create(req.params.id, "Delete my account.");
            if (request) {
                res.json({ message: "A request to delete account has been send." });
            } else {
                res.status(400).json({ message: "Deletion did not work." });
            }
        } else {
            res.status(404).json({ message: "Member not found or cannot delete admin." });
        }
    } else {
        res.status(400).json({ message: "Wrong parameters." });
    }
};

exports.doAdminExist = async () => {
    try {
        const admin = await memberService.getMainAdmin();
        if (admin.dataValues.mail != null) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
};

exports.createAdmin = async () => {
    let admin = await memberService.getMainAdmin();
    try {
        if (admin && admin.dataValues != null && admin.dataValues.mail != null) {
            return;
        } else {
            memberService.addMember((process.env.ADMIN_LASTNAME || "admin"), (process.env.ADMIN_FIRSTNAME || "admin"), (process.env.ADMIN_MAIL || "touroncamille@icloud.com"), true, passwordService.crypt((process.env.ADMIN_PWD || "admin")));
            admin = await memberService.getMainAdmin();
            if (!admin.dataValues && !admin.dataValues.mail) {
                throw new Error("Failed to create Admin so server cannot start.");
            }
        }
    } catch (error) {
        throw new Error("Failed to create Admin so server cannot start." + error);
    }
};

exports.updateMember = async (req, res) => {
    try {
        let member = await memberService.getMemberById(parseInt(req.params.id));
        if (member) {
            if (req.body) {
                let changes = [];
                if (req.body.firstname && /^[a-zA-Z]+$/.test(req.body.firstname) && req.body.firstname != (process.env.ADMIN_FIRSTNAME || "admin")) {
                    await memberService.updateFirstname(req.params.id, req.body.firstname);
                    changes.push("firstname");
                }
                if (req.body.lastname && /^[a-zA-Z]+$/.test(req.body.lastName) && req.body.firstname != (process.env.ADMIN_LASTNAME || "admin")) {
                    await memberService.updateLastname(req.params.id, req.body.lastname);
                    changes.push("lastname");
                }
                if (req.body.mail && req.body.mail.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                    await memberService.updateMail(req.params.id, req.body.mail);
                    changes.push("mail");
                }
                if (req.body.isAdmin && (req.body.isAdmin === true || req.body.isAdmin === false)) {
                    await administrationService.create(req.params.id, "Request to be admin.");
                    changes.push("A request has been send to admins to change admin status for this member.");
                }
                if (req.body.password && !/\s/.test(req.body.password)) {
                    await memberService.updatePassword(req.params.id, passwordService.crypt(req.body.password));
                    changes.push("password");
                }
                res.status(200).json({ message: "Update well done.", changes });
            } else {
                res.status(400).json({ message: "Wrong parameters." });
            }
        } else {
            res.status(404).json({ message: "Member not found." });
        }
    } catch (error) {
        res.status(400).json({ message: "Error creating member.", error: error.message });
    }
};

function manageContent(member) {
    return {
        "id": member.id,
        "firstname": member.firstname,
        "lastname": member.lastname,
        "isAdmin": member.isAdmin,
        "mail": member.mail
    }
};