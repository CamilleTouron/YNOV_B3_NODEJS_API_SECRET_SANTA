const database = require('./models');
const app = require('./app');
const memberController = require('./controllers/member');
require('dotenv').config();

database.instance.sync({ force:false }).then(() => {
    memberController.createAdmin();
    app.listen(process.env.port, () => {
        console.log('Server connected to database and running on port ' + process.env.port + ' !');
    });
}).catch((error) => {
    console.error(error);
});

