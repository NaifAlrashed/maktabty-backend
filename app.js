const express = require("express")
const bodyParser = require("body-parser")
const booksRouter = require("./Use Cases/saveTextBook/postBookRoutes")
const authRouter = require("./Use Cases/Authentication/authRoutes")
const searchRouter = require('./Use Cases/Search/searchRoutes')
const bookmarkRouter = require("./Use Cases/Bookmark/bookmarkRoutes")
const passport = require('passport')
const morgan = require('morgan')
const passportConfig = require('./Use Cases/Authentication/passportConfig')
const exceptionResponse = require('./Entities/middleware/errorMiddleWare')
require('./Entities/sendMail')

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
        .use('/api/v1', searchRouter)
        .use(exceptionResponse)
        .disable('etag')        
        .set('views', __dirname + '/views')
        .set('view engine', 'pug')
        .use(express.static(__dirname + '/public'))
        .use('/reset', (req, res) => {
            res.render('index', {})
        })

    app.listen(3030)
}

module.exports = startApp
