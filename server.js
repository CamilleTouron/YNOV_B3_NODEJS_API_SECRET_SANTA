const database = require('./models');
const app = require('./app');
const memberControler = require('./controllers/member');
require('dotenv').config();

database.instance.sync({force: true}).then(() => {
    app.listen(process.env.port, () => {
        console.log('Server connected to database and running on port '+process.env.port+' !');
        memberControler.createAdmin();
    });
}).catch((e) => {
    console.error(e);
});

