var cacheService = require('memory-cache');

exports.deleteCache = (req, res) => {
    try {
        cacheService.clear();
        res.status(200).json({ message: "All cache deleted." });
    } catch (error) {
        res.status(400).json({ message: "Error deleting cache.", error });
    }
};