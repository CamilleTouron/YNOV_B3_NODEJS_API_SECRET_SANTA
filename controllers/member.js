const memberService = require('../services/member');
const passwordService = require('../services/password')
require('dotenv').config();

exports.getMembers = async (req, res) => {
    const members = await memberService.getMembers();
    let data = [];
    for (var member of members) {
        data.push(manageContent(member));
    }
    res.status(200).json({ data: data });
};

exports.getMemberById = async (req, res) => {
    try {
        let member = await memberService.getMemberById(parseInt(req.params.id));
        if (member) {
            res.status(200).json({ data: manageContent(member[0]) });
            return true;
        } else {
            res.status(404).json({ message: "Member does not exist." });
            return false;
        }
    } catch (e) {
        if (res != null) {
            res.status(400).json({ message: "Error getting member.", error: e.message });
        }
        return false;
    }
};

exports.createMember = async (req, res) => {
    try {
        if (req.body && req.body.firstname && /^[a-zA-Z]+$/.test(req.body.firstname) && req.body.firstname != process.env.ADMIN_FIRSTNAME
            && req.body.lastname && /^[a-zA-Z]+$/.test(req.body.lastName) && req.body.firstname != process.env.ADMIN_LASTNAME
            && req.body.mail && req.body.mail.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            && req.body.isAdmin && (req.body.isAdmin === true || req.body.isAdmin === false)
            && req.body.password && !/\s/.test(req.body.password)) {
            let member = await memberService.getMemberByMail(req.body.mail.toLowerCase());
            if (member[0] && member[0].mail) {
                res.status(400).json({ message: "Member with this mail already exist." });
                return;
            }
            await memberService.addMember(req.body.lastname, req.body.firstname, req.body.mail.toLowerCase(), req.body.isAdmin, passwordService.crypt(req.body.password));
            member = await memberService.getMemberByMail(req.body.mail.toLowerCase());
            if (!member[0].mail) {
                res.status(400).json({ message: "Member not created." });
                return;
            }
            res.status(201).json({ message: "Member well created." });
        } else {
            res.status(400).json({ message: "Wrong parameters." });
        }
    } catch (error) {
        res.status(400).json({ message: "Member not created.", error: error.message });
    }

};

exports.deleteMemberById = async (req, res) => {
    if (req.params.id) {
        const member = memberService.getMemberById(req.params.id);
        if (member) {
            memberService.deleteMemberById(req.params.id);
            res.json({ message: "Member well deleted." });
        } else {
            res.status(404).json({ message: "Member not found." });
        }
    } else {
        res.status(400).json({ message: "Wrong parameters." });
    }
};

exports.doAdminExist = async () => {
    try {
        console.log("xtf")
        const admin = memberService.getAdmin();
        if (admin.dataValues.mail != null) {
            console.log("xtf")
            console.log(admin.dataValues.mail)
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
};

exports.createAdmin = async () => {
    let admin = memberService.getAdmin();
    try {
        if (admin.dataValues != null && admin.dataValues.mail != null) {
            console.log("Admin already exist.");
            return;
        } else {
            memberService.addMember(process.env.ADMIN_LASTNAME, process.env.ADMIN_FIRSTNAME, "touroncamille@icloud.com", true, passwordService.crypt(process.env.ADMIN_PWD));
            admin = memberService.getAdmin();
            if (admin.dataValues != null && admin.dataValues.mail != null) {
                console.log("Cannot create admin.");
                throw new Error("Failed to create Admin so server cannot start.");
            }
        }
    } catch (error) {
        console.log(error);
    }
};

exports.updateMember = async (req, res) => {
    try {
        let member = await memberService.getMemberById(parseInt(req.params.id));
        if (member) {
            if (req.body) {
                if (req.body.firstname && /^[a-zA-Z]+$/.test(req.body.firstname) && req.body.firstname != process.env.ADMIN_FIRSTNAME) {
                    memberService.updateFirstname(req.params.id, req.body.firstname);
                }
                if (req.body.lastname && /^[a-zA-Z]+$/.test(req.body.lastName) && req.body.firstname != process.env.ADMIN_LASTNAME) {
                    memberService.updateLastname(req.params.id, req.body.lastname);
                }
                if (req.body.mail && req.body.mail.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                    memberService.updateMail(req.params.id, req.body.mail);
                }
                if (req.body.isAdmin && (req.body.isAdmin === true || req.body.isAdmin === false)) {
                    memberService.updateAdminStatus(req.params.id, req.body.isAdmin);
                }
                if (req.body.password && !/\s/.test(req.body.password)) {
                    memberService.updatePassword(req.params.id, passwordService.crypt(req.body.password));
                }
                res.status(200).json({ message: "Update well done." });
            } else {
                res.status(400).json({ message: "Wrong parameters." });
            }
        } else {
            res.status(404).json({ message: "Member not found." });
        }
    } catch (error) {
        res.status(400).json({ message: "Error creating member.", error : error.message });
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