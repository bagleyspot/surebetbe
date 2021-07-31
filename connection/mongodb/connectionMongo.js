const mongoose = require('mongoose')
require('dotenv/config')

//Connect to DB
const connectioDB = () => {mongoose.connect(process.env.URL_DATABASE, {useNewUrlParser: true}, () => console.log('Connesso al DB'))}

exports.CON = {connectioDB}
