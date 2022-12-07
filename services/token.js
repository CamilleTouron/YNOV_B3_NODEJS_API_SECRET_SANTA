var jwt = require('jsonwebtoken');
require('dotenv').config();

function getPayload(isAdmin, memberId) {
    return {
        "date": new Date(),
        "isAdmin": isAdmin,
        "memberId": memberId
    }
}

exports.getToken = (isAdmin, memberId) => {
    try {
        const token = jwt.sign({ data: getPayload(isAdmin, memberId) }, process.env.SECRET, { expiresIn: process.env.TOKEN_TIMEOUT });
        console.log(token)
        return token;
    } catch (error) {
        throw new Error('Pbm generating token' + error);
    }
}

exports.checkToken = (token) => {
    try {
        const result = jwt.verify(token, process.env.SECRET);
        return result;
    } catch (error) {
        return false;
    }
}

exports.isAdminToken = (token) => {
    try {
        if (this.checkToken(token)) {
            if (jwt.decode(token).data.isAdmin) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

exports.getMemberIdFromToken = (token) => {
    try {
        if (this.checkToken(token)) {
            const id = jwt.decode(token).data.memberId;
            if (id != null) {
                return id;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}