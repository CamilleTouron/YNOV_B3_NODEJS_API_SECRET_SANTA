const database = require('./models');
const app = require('./app');
const memberController = require('./controllers/member');
require('dotenv').config();

database.instance.sync({ force: false }).then(() => {
    memberController.createAdmin();
    app.listen(process.env.PORT, () => {
        console.log('Server connected to database and running on port ' + process.env.PORT + ' !');
    });
}).catch((error) => {
    console.error(error);
});

