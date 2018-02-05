require('./config/config')
const mongoose = require('mongoose')
const startApp = require('./app')

mongoose.connect(process.env.MONGO_URI, { promiseLibrary: global.Promise })
console.log(mongoose.Promise)
startApp()