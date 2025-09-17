const { Router } = require("express")

const router = Router()

const {
    seriesData,
    movieData,
    genre,
    detailData,
    watchData
} = require("../controllers/anichin")

router.get("/series", seriesData)
router.get("/movie", movieData)
router.get("/detail/:endpoint", detailData)
router.get("/watch/:endpoint", watchData)
router.get("/genre/:genre", genre)

module.exports = router