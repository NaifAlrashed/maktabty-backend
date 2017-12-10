const express = require("express")
const bodyParser = require("body-parser")
const books = require("./Routes/postBookRoutes")
const authRouter = require("./routes/authRoutes")
const passport = require('passport')
const passportConfig = require('./middleware/passportConfig')
const exceptionResponse = require('./middleware/errorMiddleWare')

const app = express()

const startApp = () => {
    passportConfig(passport)
    app
        .use(bodyParser.json())
        .use(passport.initialize())
        .use(books)
        .use('/api', authRouter)
        .use(exceptionResponse)

    app.listen(3030)
}

module.exports = startApp
