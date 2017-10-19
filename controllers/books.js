const Book = require('../models/book')

module.exports = {
    saveBook: async (req, res) => {
        try {
            var book = new Book()
            book.name = req.body.book.name
            book.price = req.body.book.price
            book.pictures.push(req.body.book.picture)
            book.description = req.body.book.description
            book.contactInfo = req.body.book.contactInfo
            book.seller = req.body.userId
            //TODO: add user id to the book (i don't know how the userid will look like in the request yet)
            book.courses.push(req.course._id)
            req.course.books.push(book._id)
            await req.course.save()
            await book.save()
            res.json(book)
        } catch (err) {
            res.json({err: err.message})
        }
    }
}