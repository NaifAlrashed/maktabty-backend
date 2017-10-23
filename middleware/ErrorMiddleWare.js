module.exports = function (req, res, next, err) {
    console.log(err)
    res.status(500).json({message: "something went wrong"})
}
