require('./config/config')
const mongoose = require('mongoose')
const startApp = require('./app')

mongoose.connect(process.env.MONGO_URI, { useMongoClient: true, promiseLibrary: global.Promise })
mongoose.Promise = global.Promise
console.log(mongoose.Promise)
startApp()