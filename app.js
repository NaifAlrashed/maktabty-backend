const express = require("express")
const bodyParser = require("body-parser")
const users = require("./controllers/users")
const books = require("./controllers/books")
const auth = require("./controllers/authController")
const passport = require('passport')
const passportConfig = require('./middleware/authConfig/passportConfig')

const app = express()

const startApp = () => {
    passportConfig(passport)
    app
        .use(bodyParser.json())
        .use(passport.initialize())
        .use(users)
        .use(books)
        .use(auth)

    app.listen(3030)
}

module.exports = startApp
