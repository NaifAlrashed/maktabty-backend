const express = require("express")
const bodyParser = require("body-parser")
const booksRouter = require("./routes/postBookRoutes")
const authRouter = require("./routes/authRoutes")
const bookmarkRouter = require("./routes/bookmarkRoutes")
const passport = require('passport')
const morgan = require('morgan')
const passportConfig = require('./middleware/passportConfig')
const exceptionResponse = require('./middleware/errorMiddleWare')
require('./controllers/sendMail')

const app = express()

const startApp = () => {
    passportConfig(passport)
    app
        .use(bodyParser.json())
        .use(passport.initialize())
        .use(morgan('dev'))
        .use('/api', booksRouter)
        .use('/api', authRouter)
        .use('/api', bookmarkRouter)
        .use(exceptionResponse)
        .set('views', __dirname + '/views/email')
        .set('view engine', 'pug')

    app.listen(3030)
}

module.exports = startApp
