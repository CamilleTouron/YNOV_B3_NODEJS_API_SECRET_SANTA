const bcrypt = require('bcryptjs');

exports.crypt = function (password){
    try{
        return bcrypt.hashSync(password, 10);
    }catch(err){
        throw new Error('Pbm encoding password');
    }
}

exports.compare = function (password,hash){
    try{
        const compare = bcrypt.compareSync(password, hash);
        return compare;
    }catch(err){
        throw new Error('Pbm comparing encoded password');
    }
}