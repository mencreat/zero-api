const cheerio = require("cheerio")
const axios = require("axios")

const scrapeSeries = async (req, res) => {
    const $ = cheerio.load(res.data)
    const datas = []
    // const largestInt = []

    $("div.listupd article.bs")
    .each((i, e) => {
        const dataObject = {}

        const aTag = $(e).find("div.bsx > a")
        const altTitle = aTag.attr("oldtitle")?.trim() || null
        const title = $(e).find("div.bsx > a > div.limit > img").attr("alt")  || null
        const alternative = $(e).find("div.limit > div.tt > h2").text() || null
        const thumbnail = $(e).find("div.bsx > a > div.limit > img").attr("src")  
        const type = $(e).find("div.bsx > a > div.limit > div.typez").text()
        const status = $(e).find("div.limit > div.bt > span.epx").text()
        const subt = $(e).find("div.limit > div.bt > span.sb").text()
        const linkEndpoint = $(e).find("div.bsx > a").attr("href")
        const endpoint = linkEndpoint.substring(linkEndpoint.indexOf("/45.11.57.186/") + 14, linkEndpoint.length)

        dataObject.title = title
        dataObject.title_alt = alternative
        dataObject.altTitle = altTitle
        dataObject.thumbnail = thumbnail
        dataObject.type = type
        dataObject.status = status
        dataObject.subt = subt
        dataObject.endpoint = endpoint

        datas.push(dataObject)
    })

    // pagination
    // $(".pagination > span, .pagination > a")
    // .each((i, e) => {
    //     const text = $(e).text()
    //     const int = parseInt(text, 10)

    //     if(!isNaN(int)) {
    //         largestInt.push(int)
    //     }
    // })

    // const pagination = Math.max(...largestInt)

    return {
        pagination: 17,
        datas
    }
}

const scrapeMovie = async (req, res) => {
    const $ = cheerio.load(res.data)
    const datas = []

    $("div.listupd article.bs")
    .each((i, e) => {
        const dataObject = {}

        const aTag = $(e).find("div.bsx > a")
        const altTitle = aTag.attr("oldtitle")?.trim() || null
        const title = $(e).find("div.bsx > a > div.limit > img").attr("alt")  || null
        const alternative = $(e).find("div.limit > div.tt > h2").text() || null
        const thumbnail = $(e).find("div.bsx > a > div.limit > img").attr("src")  
        const type = $(e).find("div.bsx > a > div.limit > div.typez").text()
        const status = $(e).find("div.limit > div.bt > span.epx").text()
        const subt = $(e).find("div.limit > div.bt > span.sb").text()
        const linkEndpoint = $(e).find("div.bsx > a").attr("href")
        const endpoint = linkEndpoint.substring(linkEndpoint.indexOf("/45.11.57.186/") + 14, linkEndpoint.length)

        dataObject.title = title
        dataObject.title_alt = alternative
        dataObject.altTitle = altTitle
        dataObject.thumbnail = thumbnail
        dataObject.type = type
        dataObject.status = status
        dataObject.subt = subt
        dataObject.endpoint = endpoint

        datas.push(dataObject)
    })

    return {
        pagination: 214,
        datas
    }
}

const scrapeDetailAllType = async (req, res) => {
    const { endpoint } = req
    const $ = cheerio.load(res.data)
    const data = {}
    const genres = []
    const tags = []
    // return {
    //     data: $.html()
    // }
    const headers = {
        "Referer" : `${process.env.OPPADRAMA_URL}/detail/${endpoint}/`,
        "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Cookie" : "vi_0ELVmU7D=64ec09a4ae6db; HstCfa4524841=1693190569537; HstCmu4524841=1693190569537; dlOKBYl4gcFxs8tDGXO9aEvn1m=64ec09c2790c8; vi_04aLkwOpeK=64f09d5904bb1; _gid=GA1.2.65617723.1693649276; vi_hYIdDMKh=64f3d0778b6ac; vi_W25AFbzv1P=64f3d2e07c423; HstCla4524841=1693710948928; HstPn4524841=1; HstPt4524841=26; HstCnv4524841=6; HstCns4524841=10; _ga_DZPG0EZGWW=GS1.1.1693710949.8.0.1693710949.0.0.0; _ga=GA1.2.1604386064.1693190570"
    }

    const parent  = $("article.hentry")

    const title = $(parent).find("div.animefull > div.bigcontent > div.infox > h1").text()
    const titleAlt = $(parent).find("div.animefull > div.bigcontent > div.infox > div.ninfo > span.alter").text() || null
    const synopsis = $(parent).find("div.synp > div.entry-content > p").map((i, el) => $(el).text().trim()).get().join('\n\n')
    const thumbnail = $(parent).find("div.animefull > div.bigcover > div.ime > img").attr("src")
    const description = $(parent).find("div.animefull > div.bigcontent > div.infox > div.ninfo > div.info-content > div.desc").text().replace(/[\n\r\t\\]+/g, '').replace(/OPPADRAMA/g, 'STREAMCUY')
    const midesc = $(parent).find("div.animefull > div.bigcontent > div.infox > div.ninfo > div.mindesc").html().replace(/[\n\r\t\\]+/g, '').replace(/OPPADRAMA/g, 'STREAMCUY')
    const rating = $(parent).find("div.rt > div.rating > strong").text().trim()
    const trailerSrc = $(parent).find("div.trailer > div.tply > iframe").attr("src")
    const trailerTitle = $(parent).find("div.trailer > div.tply > iframe").attr("title")
    const spans = $(parent).find("div.animefull > div.bigcontent > div.infox > div.ninfo > div.info-content > div.spe > span")
    const airing = spans.filter((i, el) => $(el).find("b").text() === "Dirilis:").first().text().replace("Dirilis:", "").trim();
    const dirilis = spans.filter((i, el) => { return $(el).find('b').text() === 'Dirilis:' }).find('time').text().trim();

    const infoObj = {};

    
    spans.each(function() {
        const text = $(this).text().trim();
        const match = text.match(/^(.+?):\s*(.+)$/);
        if(match) {
            infoObj[match[1]] = match[2];
        }
    });

    const negaraStr = infoObj["Negara"];
    const negaraList = negaraStr ? negaraStr.split(",").map(n => n.trim()) : [];
    const artistStr = infoObj["Artis"];
    const artistList = artistStr ? artistStr.split(",").map(name => ({pict: "", name: name.trim()})) : [];
    const networkStr = infoObj["Network"];
    const networkList = networkStr ? networkStr.split(",").map(n => n.trim()) : [];
    
    const trailer = {
        title: trailerTitle,
        src: trailerSrc
    }
    const episodes = []
    $(parent).find("div.epcheck > div.eplister > ul > li").each((i, el) => {
        const a = $(el).find("a")

        const num = a.find("div.epl-num").text().trim()
        const title = a.find("div.epl-title").text().trim()
        const date = a.find("div.epl-date").text().trim()
        const endpoint = a.attr("href")
        const slug = endpoint.substring(endpoint.indexOf("/45.11.57.186/") + 14, endpoint.length)

        episodes.push({
            num,
            title,
            date,
            slug
        })
    })

    data.title = title
    data.title_alt = titleAlt
    data.thumbnail = thumbnail
    data.synopsis = synopsis
    data.description = description
    data.midesc = midesc
    data.rating = parseFloat(rating.match(/[\d\.]+/)[0]);
    data.episodes = episodes
    data.status = infoObj["Status"]
    data.durasi = infoObj["Durasi"]
    data.dirilis = dirilis
    data.airing = airing
    data.director = infoObj["Sutradara"]
    data.updated = infoObj["Diperbarui pada"]
    data.totalEpisode = parseInt(infoObj["Episode"], 10) || 0
    data.type = infoObj["Tipe"]
    data.negara = negaraList
    data.artist = artistList
    data.network = networkList
    data.trailer = trailer
    data.penerbit = infoObj["Diposting oleh"]
    // data.info_detail = infoObj

    
    // genres
    $(parent).find("div.animefull > div.bigcontent > div.infox > div.ninfo > div.info-content > div.genxed > a")
    .each((i, e) => {
        genres.push({
            title: $(e).text(),
        })
        
        // data.genres = genres
    })
    
    //tags
    $(parent).find("div.animefull > div.bottom > a")
    .each((i, e) => {
        tags.push($(e).text().trim())
        // data.tags = tags
    })

    // get movie id
    // const onclick = $(parent).find("div.pagination > a").last().attr("onclick")

    // const movieIdAndTag = onclick.substring(onclick.indexOf("(") + 1, onclick.indexOf(")"))
    // const movieId =  movieIdAndTag.split(",")[0].replace(/^'|'$/g, '')
    // const tag = movieIdAndTag.split(",")[1].replace(/^'|'$/g, '')

    // get episode list
    // const { data: { episode_lists } } = await axios.get(`${process.env.OPPADRAMA_URL}/api/episode.php?movie_id=${movieId}&tag=${tag}`, {
    //     headers: headers
    // })

    // const $eps = cheerio.load(episode_lists)
    // const episodes = $eps("p > a").get()

    // loop episodes
    // const episodesPromise = episodes.map(async (eps, i) => {
    //     const dataEps = {}
    //     const resolutions = []

    //     const wrap = $(eps).attr('onclick') 

    //     const EpsIdAndTag = wrap.substring(wrap.indexOf("(") + 1, wrap.indexOf(")"))
    //     const epsId =  EpsIdAndTag.split(",")[0].replace(/^'|'$/g, '')
    //     const tag = EpsIdAndTag.split(",")[1].replace(/^'|'$/g, '')

    //     dataEps.title = `Episode ${++i}`

    //     const { data: {data: { qua, server_id }} } = await axios.get(`${process.env.OPPADRAMA_URL}/api/server.php?episode_id=${epsId}&tag=${tag}`, {
    //         headers: headers
    //     }) 

    //     const { data:{ file } } = await axios.get(`${process.env.OPPADRAMA_URL}/api/video.php?id=${epsId}&qua=${qua}&server_id=${server_id}&tag=${tag}`,{
    //         headers: headers
    //     })
        
    //     const splitFile = file.split(",")

    //     splitFile.map(link => {
    //         resolutions.push({
    //             resolution: link.substring(1, 5),
    //             src: link.substring(link.indexOf("https"), link.length)
    //         })

    //     })

    //     dataEps.resolutions = resolutions

    //     return dataEps
    // }) 

    // const resultEpisodes = await Promise.all(episodesPromise)

    // data.episodes = resultEpisodes

    return data
}

module.exports = {
    scrapeSeries,
    scrapeMovie,
    scrapeDetailAllType,
}