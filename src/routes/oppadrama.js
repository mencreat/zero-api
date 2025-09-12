const { Router } = require("express")

const router = Router()

const {
    series,
    movie,
    detailAllType,
    watchAllType,
    genre,
    testing
} = require("../controllers/oppadrama")

// komiku
router.get("/series", series)
router.get("/movie", movie)
router.get("/detail/:endpoint", detailAllType)
router.get("/watch/:endpoint", watchAllType)
router.get("/genre/:genre", genre)
router.get("/testing", testing)

module.exports = router