const app = require('./app');
require('dotenv').config();

app.listen(process.env.port, () => {
    console.log('Server running on port '+process.env.port+' !');
});