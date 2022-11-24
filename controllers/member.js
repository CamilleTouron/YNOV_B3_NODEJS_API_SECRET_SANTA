const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const memberService = require('../services/member');

router.get('/', async (req, res) => {
    const members = await memberService.getMembers();
    res.json({ data: members });
});

router.get('/:id', (req, res) => {
    try {
        const member = memberService.getMemberById(parseInt(req.params.id));
        if (member) {
            res.json({ data: member });
        } else {
            res.status(404).json({ message: "Member does not exist." });
        }
    } catch (e) {
        res.status(400).json({ message: "Wrong parameters." });
    }
});

router.get('/:pseudo', (req, res) => {
    try {
        const member = memberService.getMemberById(parseInt(req.params.pseudo));
        if (member) {
            res.json({ data: member });
        } else {
            res.status(404).json({ message: "Member does not exist." });
        }
    } catch (e) {
        res.status(400).json({ message: "Wrong parameters." });
    }
});

router.post('/', (req, res) => {
    if (req.body && req.body.firstName && /^[a-zA-Z]+$/.test(req.body.firstName)
        && req.body.lastName && /^[a-zA-Z]+$/.test(req.body.lastName)
        && req.body.mail && req.body.mail.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        && req.body.pseudo && !/\s/.test(req.body.pseudo)
        && req.body.isAdmin && (req.body.isAdmin.toLowerCase().includes("true") || req.body.isAdmin.toLowerCase().includes("false"))
        && req.body.password && !/\s/.test(req.body.password)) {
        try {
            memberService.addMember(req.body.firstName, req.body.lastName, req.body.pseudo, req.body.isAdmin,bcrypt.hashSync(req.body.password, 10));
            res.status(201).json({ message: "Member well created." });
        } catch (e) {
            res.status(400).json({ message: "Member not created.", error: e.message });
        }
    } else {
        res.status(400).json({ message: "Wrong parameters." });
    }
});

router.delete('/:id', (req, res) => {
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
});

module.exports = router;

exports.createAdmin = () => {
    memberControler.addMember("Admin", "Admin", "touroncamille@icloud.com", "Admin", "true", process.env.ADMIN_PWD);
    if (memberControler.getMemberByPseudo("Admin")) {
        console.log("Admin is created.");
    } else {
        throw new Error("Failed to create Admin so server cannot start.");
    }
}