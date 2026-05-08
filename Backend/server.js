const { connect } = require('mongoose');
const app = require('./app');
const connectdb = require('./src/db/db');
require('dotenv').config();

const PORT = process.env.PORT
connectdb();

app.listen(PORT, '0.0.0.0' ,() => {
console.log(`server running on the port http://localhost:${PORT}/`)
})

module.exports= app;