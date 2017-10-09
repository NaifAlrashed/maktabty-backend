const Book = require('../models/book')
const router = require('express').Router()
const mongoose = require('mongoose')


router
    .post('/book', async (req, res) => {
        var book = new Book()
        book.name = req.body.name
        book.price = req.body.price
        book.pictures.push(req.body.picture)
        book.description = req.body.description
        book.contactInfo = req.body.contactInfo
        book.seller = mongoose.Types.ObjectId()
        book.courses.push(mongoose.Types.ObjectId())
        try {
            await book.save()
            res.json(book)
        } catch (err) {
            res.json({ err: err.message })
        }
    })

module.exports = router