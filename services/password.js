const bcrypt = require('bcryptjs');

exports.crypt = function (password){
    try{
        return bcrypt.hashSync(password, 10);
    }catch(error){
        throw new Error('Pbm encoding password'+error);
    }
}

exports.compare = function (password,hash){
    try{
        const compare = bcrypt.compareSync(password, hash);
        return compare;
    }catch(error){
        throw new Error('Pbm comparing encoded password'+error);
    }
}