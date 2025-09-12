const { Router } = require("express")

const router = Router()

const {
    seriesData,
    movieData,
    detailData,
    watchData
} = require("../controllers/anichin")

router.get("/series", seriesData)
router.get("/movie", movieData)
router.get("/detail/:endpoint", detailData)
router.get("/watch/:endpoint", watchData)

module.exports = router