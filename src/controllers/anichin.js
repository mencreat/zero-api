const axios = require("axios")
const puppeteer = require('puppeteer');

const {
    scrapeSeries,
    scrapeMovie,
    scrapeDetail,
    scrapeWacth
} = require('../scrapers/cobaanichin')

const headers = {
    "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
}

const seriesData = async (req, res) => {
  try {
    const { page = 1 } = req.query
    const r = await axios.get(`${process.env.ANICHIN_URL}/donghua/?page=${page}`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Referer": "https://anichin.cafe",
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
      message: e.message,
      status: e?.response?.status,
      data: e?.response?.data
    })
  }
}

const movieData = async (req, res) => {
  try {
    const { page = 1 } = req.query
    const r = await axios.get(`${process.env.ANICHIN_URL}/donghua/?page=${page}&type=movie`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Referer": "https://anichin.cafe",
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
      message: e.message,
      status: e?.response?.status,
      data: e?.response?.data
    })
  }
}

const detailData = async (req, res) => {
    try {
        const { endpoint } = req.params

        const axiosRequest = await axios.get(`${process.env.ANICHIN_URL}/donghua/${endpoint}`, { headers })

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
    detailData,
    watchData,
}