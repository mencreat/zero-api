const puppeteer = require("puppeteer")
const axios = require("axios")

const { 
    scrapeSeries,
    scrapeMovie,
    scrapeDetailAllType,
    scrapeWacthAllType,
} = require("../scrapers/oppadrama")

const headers = {
    "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
}

const series = async (req, res) => {
    try {
        const { page = 1 } = req.query
        const axiosRequest = await axios.get(`${process.env.OPPADRAMA_URL}/series/?page=${page}&type=TV+Show&order=update`, {
            maxRedirects: 0,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Referer": "https://oppa.biz",
            }
        })

        const datas = await scrapeSeries(req, axiosRequest)
        
        res.status(200).json({
            message: "success",
            url: process.env.OPPADRAMA_URL,
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

const movie = async (req, res) => {
    try {
        const { page = 1 } = req.query
        const axiosRequest = await axios.get(`${process.env.OPPADRAMA_URL}/series/?page=${page}&type=Movie&order=update`, {
            maxRedirects: 0,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Referer": "https://oppa.biz",
            }
        })

        const datas = await scrapeMovie(req, axiosRequest)
        
        res.status(200).json({
            message: "success",
            url: process.env.OPPADRAMA_URL,
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

const detailAllType = async (req, res) => {
    try {
        const { endpoint } = req.params

        const axiosRequest = await axios.get(`${process.env.OPPADRAMA_URL}/${endpoint}`, { headers })

        const data = await scrapeDetailAllType({ endpoint }, axiosRequest)

        res.status(200).json({
            message: "success",
            url: process.env.OPPADRAMA_URL,
            datas: datas.datas
        })

    } catch (e) {
        console.log(e)

        res.json({
            message:`${e}`
        })
    }
}

const watchAllType = async (req, res) => {
    try {
        const { endpoint } = req.params

        const axiosRequest = await axios.get(`${process.env.OPPADRAMA_URL}/${endpoint}`, { headers })

        const data = await scrapeWacthAllType({ endpoint }, axiosRequest)

        res.status(200).json({
            message: "success",
            data
        })

    } catch (e) {
        console.log(e)

        res.json({
            message:`${e}`
        })
    }
}

const testing = async (req, res) => {
    try {
        const { page = 1 } = req.query
        const browser = await puppeteer.launch({ headless: "new" })
        const pageObj = await browser.newPage()
        
        await pageObj.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36") // optional
        await pageObj.goto(`${process.env.OPPADRAMA_URL}?page=${page}&type=TV+Show`, {
            waitUntil: "networkidle2"
        })

        const html = await pageObj.content()
        console.log(html)
        await browser.close()

        // Simulasi objek yang sama seperti axios
        const axiosLike = { data: html }

        const datas = await scrapeSeries(req, axiosLike)

        res.status(200).json({
            message: "success",
            url: process.env.OPPADRAMA_URL,
            datas
        })
    } catch (e) {
        console.log(e)
        res.json({ message: `Error: ${e}` })
    }
}

module.exports = {
    series,
    movie,
    detailAllType,
    watchAllType,
    testing
}