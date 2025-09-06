const cheerio = require("cheerio")

const scrapeSeries = async (req, res) => {
    const $ = cheerio.load(res.data)
    const datas = []
    const largestInt = []

    $("div.listupd article.bs")
    .each((i, e) => {
        const dataObject = {}

        const title = $(e).find("div.bsx > a").attr("oldtitle")
        const thumbnail = $(e).find("div.bsx > a > div.limit > img").attr("src") 
        const type = $(e).find("div.bsx > a > div.limit > div.typez").text()
        const status = $(e).find("div.limit > div.bt > span.epx").text()
        const subt = $(e).find("div.limit > div.bt > span.sb").text()
        const linkEndpoint = $(e).find("div.bsx > a").attr("href")
        const endpoint = linkEndpoint.substring(linkEndpoint.indexOf("/45.11.57.186/") + 14, linkEndpoint.length)

        dataObject.title = title
        dataObject.thumbnail = thumbnail
        dataObject.type = type
        dataObject.status = status
        dataObject.subt = subt
        dataObject.endpoint = endpoint

        datas.push(dataObject)
    })

    // pagination
    $(".pagination > span, .pagination > a")
    .each((i, e) => {
        const text = $(e).text()
        const int = parseInt(text, 10)

        if(!isNaN(int)) {
            largestInt.push(int)
        }
    })

    const pagination = Math.max(...largestInt)

    return {
        pagination: pagination,
        datas
    }
}

module.exports = {
    scrapeSeries
}