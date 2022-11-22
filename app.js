const express = require('express');
const app = express();
const OpenApiValidator = require('express-openapi-validator');

app.use(express.json());
app.use(
    OpenApiValidator.middleware({
        apiSpec: './configurations/open_api.yaml'
    })
);
//Routes :

//Error middleware :
app.use((error, req, res, next) => {
    if(error.status!=null){
        res.status(error.status).json({message: error.message});
    }else{
        res.status(500).json({message: "Server error."});
    }
    
});

module.exports = app;