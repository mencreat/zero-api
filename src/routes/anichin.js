const { Router } = require("express")

const router = Router()

const {
    seriesData,
    movieData,
    detailData
} = require("../controllers/anichin")

router.get("/series", seriesData)
router.get("/movie", movieData)
router.get("/detail/:endpoint", detailData)

module.exports = router