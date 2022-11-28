const express = require('express');
const app = express();
const OpenApiValidator = require('express-openapi-validator');
const loginRouter = require('./routers/login');
const memberRouter = require('./routers/member');
const eventRouter = require('./routers/event');
const participationRouter = require('./routers/participation');
const cacheRouter = require('./routers/cache');
const all_routes = require('express-list-endpoints')

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

//List all routes.
app.route('/help').get(function(req, res) {
    res.status(200).json({content: all_routes(app)});
});


//Error middleware :
app.use((error, req, res, next) => {
    if(error.status!=null){
        res.status(error.status).json({message: error.message});
    }else{
        res.status(500).json({message: "Server error."});
    }
});

module.exports = app;