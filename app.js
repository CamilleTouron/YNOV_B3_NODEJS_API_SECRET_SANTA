const express = require('express');
const app = express();
const OpenApiValidator = require('express-openapi-validator');
const loginRouter = require('./routers/login');
const memberRouter = require('./routers/member');
const eventRouter = require('./routers/event');
const participationRouter = require('./routers/participation');
const cacheRouter = require('./routers/cache');
const helpRouter = express.Router();
const authService = require('./controllers/login');
const all_routes = require('express-list-endpoints');

app.use(express.json());
app.use(
    OpenApiValidator.middleware({
        apiSpec: './configurations/open_api.yaml'
    })
);

//Routes :
app.use('/login', loginRouter);
app.use('/member', memberRouter);
app.use('/event', eventRouter);
app.use('/participation', participationRouter);
app.use('/cache', cacheRouter);

//Needs to be here to get all app's routes
exports.getHelp = (req, res) => {
    res.status(200).json({ content: all_routes(app) });
};
helpRouter.get('/', authService.authAdmin, this.getHelp);
app.use('/help', helpRouter)


//Error middleware :
app.use((error, req, res, next) => {
    if (error.status != null) {
        res.status(error.status).json({ message: error.message });
    } else {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
});

module.exports = app;