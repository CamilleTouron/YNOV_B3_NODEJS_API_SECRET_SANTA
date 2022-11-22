exports.login = async (req, res) => {
    //Test des parameters
    if (req.body.pseudo && req.body.password) {
        //chercher le user
        res.status(200).json({message: 'Well, you are connected now.'});
    } else {
        res.status(400).json({message: 'Wrong parameters'});
    }
}
