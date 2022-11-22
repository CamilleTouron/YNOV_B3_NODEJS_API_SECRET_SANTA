const helpService = require('../services/help');
exports.getBooks = async (req, res) => {
    const help = await helpService.getHelp();
    res.json({content: help});
}