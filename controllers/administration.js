const administrationService = require('../services/administration');
const memberService = require('../services/member');

exports.getAdministrations = async (req, res) => {
    const administrations = await administrationService.getAdministrations();
    let data = [];
    for (var administration of administrations) {
        data.push(manageContent(administration));
    }
    if (data[0]) {
        res.status(200).json({ data: data });
        return;
    } else {
        res.status(404).json({ message: "There is no adminstration." });
        return;
    }
};

exports.getAdministrationsByIdAdmin = async (req, res) => {
    const administrations = await administrationService.getAdministrationByIdAdmin(parseInt(req.params.id));
    let data = [];
    for (var administration of administrations) {
        data.push(manageContent(administration));
    }
    if (data[0]) {
        res.status(200).json({ data: data });
        return;
    } else {
        res.status(404).json({ message: "There is no adminstration with this admin id." });
        return;
    }
};

exports.getAdministrationsByIdApplicant = async (req, res) => {
    const administrations = await administrationService.getAdministrationByIdApplicant(parseInt(req.params.id));
    let data = [];
    for (var administration of administrations) {
        data.push(manageContent(administration));
    }
    if (data[0]) {
        res.status(200).json({ data: data });
        return;
    } else {
        res.status(404).json({ message: "There is no adminstration with this applicant id." });
        return;
    }
};

exports.getAdministrationById = async (req, res) => {
    try {
        let administration = await administrationService.getAdministrationById(parseInt(req.params.id));
        if (administration) {
            res.json({ data: manageContent(administration) });
            return true;
        } else {
            res.status(404).json({ message: "Administration does not exist." });
            return false;
        }
    } catch (error) {
        if (res != null) {
            res.status(400).json({ message: "Wrong parameters.", error: error.message });
        }
        return false;
    }
};

exports.createAdministration = async (req, res) => {
    try {
        if (req.body
            && req.body.idApplicant
            && req.body.application) {
            const member = await memberService.getMemberById(req.body.idApplicant);
            if (member) {
                const administration = await this.create(req.body.idApplicant, req.body.application);
                if (!administration) {
                    res.status(400).json({ message: "Administration not created." });
                    return;
                }
                res.status(201).json({ message: "Administration well created." });
            }else{
                res.status(404).json({ message: "idApplicant does not match any member id." });
            }
        } else {
            res.status(400).json({ message: "Wrong parameters." });
        }
    } catch (error) {
        res.status(400).json({ message: "Administration not created.", error: error.message });
    }

};

exports.deleteAdministrationById = async (req, res) => {
    if (req.params.id) {
        const administration = await administrationService.getAdministrationById(req.params.id);
        if (administration) {
            const deletion = await administrationService.deleteAdministrationById(req.params.id);
            if (deletion) {
                res.status(200).json({ message: "Adminitration well deleted." });
            } else {
                res.status(400).json({ message: "Adminitration not deleted." });
            }
        } else {
            res.status(404).json({ message: "Adminitration not found." });
        }
    } else {
        res.status(400).json({ message: "Wrong parameters." });
    }
};

exports.deleteAdministrationByIdAdmin = async (req, res) => {
    if (req.params.id) {
        const administration = await administrationService.getAdministrationByIdAdmin(req.params.id);
        if (administration) {
            const deletion = await administrationService.deleteAdministrationByIdAdmin(req.params.id);
            if (deletion) {
                res.status(200).json({ message: "Adminitration well deleted." });
            } else {
                res.status(400).json({ message: "Adminitration not deleted." });
            }
        } else {
            res.status(404).json({ message: "Adminitration not found." });
        }
    } else {
        res.status(400).json({ message: "Wrong parameters." });
    }
};

exports.deleteAdministrationByIdApplicant = async (req, res) => {
    if (req.params.id) {
        const administration = await administrationService.getAdministrationByIdApplicant(req.params.id);
        if (administration) {
            const deletion = await administrationService.deleteAdministrationByIdApplicant(req.params.id);
            if (deletion) {
                res.status(200).json({ message: "Adminitration well deleted." });
            } else {
                res.status(400).json({ message: "Adminitration not deleted." });
            }
        } else {
            res.status(404).json({ message: "Adminitration not found." });
        }
    } else {
        res.status(400).json({ message: "Wrong parameters." });
    }
};

exports.updateAdministration = async (req, res) => {
    try {
        const administration = await administrationService.getAdministrationById(parseInt(req.params.id));
        if (administration) {
            if (req.body && req.params.id && req.body.idAdmin && req.body.isDone != null) {
                const member = await memberService.isAdmin(req.body.idAdmin, req.body.isDone);
                if(member){
                    const changeIdAdmin = await this.updateIdAdmin(req.params.id, req.body.idAdmin);
                    const changeIsDone = await this.updateIsDone(req.params.id, req.body.isDone);
                    console.log(changeIdAdmin, changeIsDone);
                    if (changeIdAdmin && changeIsDone) {
                        res.status(200).json({ message: "Update well done." });
                    } else {
                        res.status(400).json({ message: "Update not done." });
                    }
                }else{
                    res.status(404).json({ message: "idAdmin does not match with any admin id." });
                }
            } else {
                res.status(400).json({ message: "Wrong parameters." });
            }
        } else {
            res.status(404).json({ message: "Administration not found." });
        }
    } catch (error) {
        res.status(400).json({ message: "Administration not updated.", error: error.message });
    }
};

exports.updateIdAdmin = async (id, idAdmin) => {
    const changes = await administrationService.updateIdAdmin(id, idAdmin);
    return changes ? true : false
}

exports.updateIsDone = async (id, isDone) => {
    const changes = await administrationService.updateIsDone(id, isDone);
    return changes ? true : false
}

exports.create = async (idApplicant, application) => {
    if (idApplicant && application) {
        const administration = await administrationService.addAdministration(idApplicant, application);
        return administration ? true : false;
    } else {
        return false;
    }
}

function manageContent(administration) {
    return {
        "id": administration.id,
        "idAdmin": administration.idAdmin,
        "idApplicant": administration.idApplicant,
        "isDone": administration.isDone,
        "application": administration.application
    }
};