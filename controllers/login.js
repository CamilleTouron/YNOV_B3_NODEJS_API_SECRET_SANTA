const tokenService = require('../services/token');
const memberService = require('../services/member');
const passwordService = require('../services/password');
const participationService = require('../services/participation');

exports.auth = async (req, res, next) => {
    if (req.headers && !req.headers.authorization) {
        res.status(401).json({ message: 'You cannot access to ' + req.originalUrl });
    } else {
        const token = req.headers.authorization.split(' ')[1];
        try {
            if (tokenService.checkToken(token)) {
                next();
            } else {
                res.status(401).json({ message: 'Token is not valid.' });
            }
        } catch (error) {
            next(error);
        }
    }
}
exports.authAdmin = async (req, res, next) => {
    if (req.headers && !req.headers.authorization) {
        res.status(401).json({ message: 'You cannot access to ' + req.originalUrl + ". You should be ADMIN." });
    } else {
        const token = req.headers.authorization.split(' ')[1];
        try {
            if (tokenService.isAdminToken(token)) {
                next();
            } else {
                res.status(401).json({ message: 'Token is not valid.' });
            }
        } catch (error) {
            next(error);
        }
    }
}
exports.authOrganizerOrAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            const memberId = tokenService.getMemberIdFromToken(token);
            if (memberId != null) {
                const member = await memberService.getMemberById(memberId);
                let participation = await participationService.getParticipationByAssociation(memberId, parseInt(req.params.id));
                if ((member && member.isAdmin) || (participation && participation.isOrganizer)) {
                    next();
                } else {
                    res.status(400).json({ message: 'You are not organizer or admin so you have not the rights.' });
                }
            } else {
                res.status(400).json({ message: 'Error getting member id.' });
            }
        } else {
            res.status(401).json({ message: 'Token is not valid.' });
        }
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res) => {
    try {
        if (req.body.mail && req.body.mail.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            && req.body.password && !/\s/.test(req.body.password)) {

            const member = await memberService.getMemberByMail(req.body.mail);
            if (member && member.password) {
                const passwordEncoded = passwordService.compare(req.body.password, member.password)
                if (passwordEncoded) {
                    const token = 'Bearer ' + tokenService.getToken(member.isAdmin, member.id);
                    res.status(200).setHeader('authorization', token).json({ message: 'Well, you are connected now.', token });
                    return token;
                } else {
                    res.status(400).json({ message: 'Password does not match' });
                    return null;
                }
            }
        } else {
            res.status(400).json({ message: 'Wrong parameters' });
            return null;
        }
    } catch (error) {
        res.status(400).json({ message: 'Error while logging.', error: error });
        return null;
    }
}
