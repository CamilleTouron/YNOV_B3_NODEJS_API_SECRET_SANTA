const memberService = require('../services/member');
const passwordService = require('../services/password');
const participation = require('../services/participation');
require('dotenv').config();

exports.getMembers = async (req, res) => {
    const members = await memberService.getMembers();
    let data = [];
    for (var member of members) {
        data.push(manageContent(member));
    }
    if(data[0]){
        res.status(200).json({ data: data });
        return;
    }else{
        res.status(404).json({ message: "There is no participation." });
        return;
    }
};

exports.getMemberById = async (req, res) => {
    try {
        let member = await memberService.getMemberById(parseInt(req.params.id));
        if (member) {
            const participations = await participation.getParticipationByMemberId(parseInt(req.params.id));
            res.status(200).json({ data: manageContent(member) , participations: (participations[0]!=undefined?participations:"none") });
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
        if (req.body && req.body.firstname && /^[a-zA-Z]+$/.test(req.body.firstname) && req.body.firstname != process.env.ADMIN_FIRSTNAME
            && req.body.lastname && /^[a-zA-Z]+$/.test(req.body.lastName) && req.body.firstname != process.env.ADMIN_LASTNAME
            && req.body.mail && req.body.mail.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            && req.body.isAdmin && (req.body.isAdmin === true || req.body.isAdmin === false)
            && req.body.password && !/\s/.test(req.body.password)) {
            let member = await memberService.getMemberByMail(req.body.mail.toLowerCase());
            if (member && member.mail) {
                res.status(400).json({ message: "Member with this mail already exist." });
                return;
            }
            await memberService.addMember(req.body.lastname, req.body.firstname, req.body.mail.toLowerCase(), req.body.isAdmin, passwordService.crypt(req.body.password));
            member = await memberService.getMemberByMail(req.body.mail.toLowerCase());
            if (!member.mail) {
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
        const member = await memberService.getMemberById(req.params.id);
        if (member && member.isAdmin==false) {
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

exports.doAdminExist = async () => {
    try {
        const admin = memberService.getAdmin();
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
    let admin = memberService.getAdmin();
    try {
        if (admin.dataValues != null && admin.dataValues.mail != null) {
            return;
        } else {
            memberService.addMember(process.env.ADMIN_LASTNAME, process.env.ADMIN_FIRSTNAME, process.env.ADMIN_MAIL, true, passwordService.crypt(process.env.ADMIN_PWD));
            admin = memberService.getAdmin();
            if (admin.dataValues != null && admin.dataValues.mail != null) {
                throw new Error("Failed to create Admin so server cannot start.");
            }
        }
    } catch (error) {
        throw new Error("Failed to create Admin so server cannot start."+error);

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