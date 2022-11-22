const database = require('./models/index');
const app = require('./app');
require('dotenv').config();

database.instance.sync({force: true}).then(() => {
    app.listen(process.env.port, () => {
        console.log('Server connected to database and running on port '+process.env.port+' !');
    });
}).catch((e) => {
    console.error(e);
});