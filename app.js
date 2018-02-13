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
        .use('/api/v1', booksRouter)
        .use('/api/v1', authRouter)
        .use('/api/v1', bookmarkRouter)
        .use(exceptionResponse)
        .set('views', __dirname + '/views')
        .set('view engine', 'pug')
        .use(express.static(__dirname + '/public'))
        .use('/reset', (req, res) => {
            res.render('index', {})
        })

    app.listen(3030)
}

module.exports = startApp
