const { Router } = require("express")

const router = Router()

const {
    series,
    testing
} = require("../controllers/oppadrama")

// komiku
router.get("/series", series)
router.get("/testing", testing)

module.exports = router