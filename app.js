const express = require("express")
const bodyParser = require("body-parser")
const booksRouter = require("./routes/postBookRoutes")
const authRouter = require("./routes/authRoutes")
const bookmarkRouter = require("./routes/bookmarkRoutes")
const passport = require('passport')
const passportConfig = require('./middleware/passportConfig')
const exceptionResponse = require('./middleware/errorMiddleWare')

const app = express()

const startApp = () => {
    passportConfig(passport)
    app
        .use(bodyParser.json())
        .use(passport.initialize())
        .use('/api', booksRouter)
        .use('/api', authRouter)
        .use('/api', bookmarkRouter)
        .use(exceptionResponse)

    app.listen(3030)
}

module.exports = startApp
