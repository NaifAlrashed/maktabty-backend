const express = require("express")
const bodyParser = require("body-parser")
const books = require("./Routes/postBookRoutes")
const auth = require("./controllers/authController")
const passport = require('passport')
const passportConfig = require('./middleware/authConfig/passportConfig')

const app = express()

const startApp = () => {
    passportConfig(passport)
    app
        .use(bodyParser.json())
        .use(passport.initialize())
        .use(books)
        .use(auth)

    app.listen(3030)
}

module.exports = startApp
