const axios = require("axios")
const puppeteer = require('puppeteer');

const {
    scrapeSeries,
    scrapeMovie,
    scrapeByGenre,
    scrapeDetail,
    scrapeWacth
} = require('../scrapers/cobaanichin')

const headers = {
    "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
}

const seriesData = async (req, res) => {
  try {
    const { page = 1 } = req.query
    const r = await axios.get(`${process.env.ANICHIN_URL}/series/?page=${page}`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Referer": "https://s24.anichin.blog",
        }
    })
    const datas = await scrapeSeries(req, r)
    res.status(200).json({ 
        message: "success",
        page: parseInt(page),
        ...datas
    })
} catch (e) {
    res.status(500).json({
        // message: e.message,
        message: "success",
        page: 1,
        pagination: 1,
    //   status: e?.response?.status,
        // data: e?.response?.data
      datas: []
    })
  }
}

const movieData = async (req, res) => {
  try {
    const { page = 1 } = req.query
    const r = await axios.get(`${process.env.ANICHIN_URL}/series/?type=movie&page=${page}`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Referer": "https://s24.anichin.blog",
        }
    })
    const datas = await scrapeMovie(req, r)
    res.status(200).json({ 
        message: "success",
        page: parseInt(page),
        ...datas
    })
} catch (e) {
    res.status(500).json({
        // message: e.message,
        message: "success",
        page: 1,
        pagination: 1,
    //   status: e?.response?.status,
    //   data: e?.response?.data
      datas: []
    })
  }
}

const genre = async (req, res) => {
    try {
        const {page = 1, type} = req.query
        const { genre } = req.params
        const axiosRequest = await axios.get(`${process.env.ANICHIN_URL}/series/?page=${page}&genre%5B%5D=${genre}&type=${type}&order=update`, {
            maxRedirects: 0,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Referer": "https://s24.anichin.blog",
            }
        })

        const datas = await scrapeByGenre(req, axiosRequest)
        
        res.status(200).json({
            message: "success",
            url: process.env.ANICHIN_URL,
            pagination: datas.pagination,
            datas: datas.datas
        })
    } catch (e) {
        console.log(e)

        res.json({
            message: `Error: ${e}` 
        })
    }
}

const detailData = async (req, res) => {
    try {
        const { endpoint } = req.params

        const axiosRequest = await axios.get(`${process.env.ANICHIN_URL}/series/${endpoint}`, { headers })

        const data = await scrapeDetail({ endpoint }, axiosRequest)

        res.status(200).json({
            message: "success",
            url: process.env.ANICHIN_URL,
            datas: data
        })

    } catch (e) {
        console.log(e)

        res.json({
            message:`${e}`
        })
    }
}

const watchData = async (req, res) => {
    try {
        const { endpoint } = req.params

        const axiosRequest = await axios.get(`${process.env.ANICHIN_URL}/${endpoint}/`, { headers })

        const data = await scrapeWacth({ endpoint }, axiosRequest)

        res.status(200).json({
            message: "success",
            url: process.env.ANICHIN_URL,
            datas: data
        })

    } catch (e) {
        console.log(e)

        res.json({
            message:`${e}`
        })
    }
}

module.exports = { 
    seriesData,
    movieData,
    genre,
    detailData,
    watchData,
}