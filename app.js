const express = require('express');
const app = express();
const OpenApiValidator = require('express-openapi-validator');

app.use(express.json());
app.use(
    OpenApiValidator.middleware({
        apiSpec: './configurations/open_api.yaml'
    })
);

module.exports = app;