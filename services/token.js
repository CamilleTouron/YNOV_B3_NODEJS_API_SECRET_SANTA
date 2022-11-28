var jwt = require('jsonwebtoken');
require('dotenv').config();

function getPayload(isAdmin,memberId) {
    return {
        "date": new Date(),
        "isAdmin": isAdmin,
        "memberId": memberId
    }
}

exports.getToken = (isAdmin,memberId) => {
    try {
        const retult = jwt.sign({ data: getPayload(isAdmin,memberId) }, process.env.SECRET, { expiresIn: '1h' });
        return retult;
    } catch (error) {
        throw new Error('Pbm generating token' + error);
    }
}

exports.checkToken =  (token) => {
    try {
        const result = jwt.verify(token, process.env.SECRET);
        return result;
    } catch (error) {
        console.log('Token is bad!'+error);
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
        console.log('Token is bad!'+error);
        return false;
    }
}

exports.getMemberIdFromToken = (token) => {
    try {
        if (this.checkToken(token)) {
            const id = jwt.decode(token).data.memberId;
            if (id!=null) {
                return id;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (error) {
        console.log('Token is bad!'+error);
        return null;
    }
}