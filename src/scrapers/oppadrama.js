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
        const endpoint = linkEndpoint.substring(linkEndpoint.indexOf("/45.11.57.243/") + 14, linkEndpoint.length)

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
        const endpoint = linkEndpoint.substring(linkEndpoint.indexOf("/45.11.57.243/") + 14, linkEndpoint.length)

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

const scrapeByGenre = async (req, res) => {
    const $ = cheerio.load(res.data)
    const datas = []

    $("div.listupd article.bs")
    .each((i, e) => {
        const dataObject = {}

        const title = $(e).find("div.bsx > a > div.limit > img").attr("alt")  || null
        const thumbnail = $(e).find("div.bsx > a > div.limit > img").attr("src")  
        const type = $(e).find("div.bsx > a > div.limit > div.typez").text()
        const status = $(e).find("div.limit > div.bt > span.epx").text()
        const subt = $(e).find("div.limit > div.bt > span.sb").text()
        const linkEndpoint = $(e).find("div.bsx > a").attr("href")
        const endpoint = linkEndpoint.substring(linkEndpoint.indexOf("/45.11.57.243/") + 14, linkEndpoint.length)

        dataObject.title = title
        dataObject.thumbnail = thumbnail
        dataObject.type = type
        dataObject.status = status
        dataObject.subt = subt
        dataObject.endpoint = endpoint

        datas.push(dataObject)
    })

    return {
        pagination: 10,
        datas
    }
}

const scrapeDetailAllType = async (req, res) => {
    const { endpoint } = req
    const $ = cheerio.load(res.data)
    const data = {}
    const genres = []
    const tags = []

    const parent  = $("article.hentry")

    const title = $(parent).find("div.animefull > div.bigcontent > div.infox > h1").text()
    const titleAlt = $(parent).find("div.animefull > div.bigcontent > div.infox > div.ninfo > span.alter").text() || null
    const synopsis = $(parent).find("div.synp > div.entry-content > p").map((i, el) => $(el).text().trim()).get().join('\n\n')
    const thumbnail = $(parent).find("div.animefull > div.bigcover > div.ime > img").attr("src")
    const description = $(parent).find("div.animefull > div.bigcontent > div.infox > div.ninfo > div.info-content > div.desc").text().replace(/[\n\r\t\\]+/g, '').replace(/OPPADRAMA/g, 'STREAMCUY')
    const midesc = $(parent).find("div.animefull > div.bigcontent > div.infox > div.ninfo > div.mindesc").html().replace(/[\n\r\t\\]+/g, '').replace(/\u003Cb\u003E|\u003C\/b\u003E/g, '').replace(/OPPADRAMA/g, 'STREAMCUY')
    const rating = $(parent).find("div.rt > div.rating > strong").text().trim().replace(/Rating /, '') || null
    const trailerTitle = $(parent).find("div.trailer > div.tply > iframe").attr("title") || null
    const trailerSrc = $(parent).find("div.trailer > div.tply > iframe").attr("src") || null
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
    const negaraList = negaraStr ? negaraStr.split(",").map(n => n.trim()) : null;
    const artistStr = infoObj["Artis"];
    const artistList = artistStr ? artistStr.split(",").map(name => ({pict: "", name: name.trim()})) : null;
    const networkStr = infoObj["Network"];
    const networkList = networkStr ? networkStr.split(",").map(n => n.trim()) : null;
    
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
        const slug = endpoint.substring(endpoint.indexOf("/45.11.57.243/") + 14, endpoint.length)

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
    data.rating = parseFloat(rating?.match(/[\d\.]+/)[0]) || null
    data.status = infoObj["Status"]
    data.durasi = infoObj["Durasi"]
    data.dirilis = dirilis
    data.airing = airing
    data.director = infoObj["Sutradara"]
    data.studio = infoObj["Studio"]
    data.updated = infoObj["Diperbarui pada"]
    data.totalEpisode = parseInt(infoObj["Episode"], 10) || 0
    data.type = infoObj["Tipe"]
    data.penerbit = infoObj["Diposting oleh"]
    data.genres = genres
    data.trailer = trailer
    data.artist = artistList
    data.negara = negaraList
    data.network = networkList
    data.episodes = episodes
    // data.info_detail = infoObj

    
    // genres
    $(parent).find("div.animefull > div.bigcontent > div.infox > div.ninfo > div.info-content > div.genxed > a")
    .each((i, e) => {
        genres.push($(e).text())
    })
    
    //tags
    $(parent).find("div.animefull > div.bottom > a")
    .each((i, e) => {
        tags.push($(e).text().trim())
        data.tags = tags
    })

    return data
}

const scrapeWacthAllType = async (req, res) => {
    const { endpoint } = req
    const $ = cheerio.load(res.data)
    const data = {}
    const genres = []
    // return {
    //     data: $.html()
    // }

    const parent  = $("article.hentry")

    const title = $(parent).find("div.single-info > div.infox > div.infolimit > h2").text()
    const titleAlt = $(parent).find("div.single-info > div.infox > div.infolimit > span.alter").text() 
    const synopsis = $(parent).find("div.single-info > div.infox > div.info-content > div.desc").text().replace(/[\n\r\t\\]+/g, '')
    const rating = $(parent).find("div.single-info > div.infox > div.rating > strong").text()
    const thumbnail = $(parent).find("div.megavid > div.mvelement > div.meta > div.tb > img").attr("src")
    const thumbnailAlt = $(parent).find('div.megavid > div.mvelement > div.meta > div.tb > meta[itemprop="url"]').attr("content")
    // const testing = $(parent).find('div.mctn > div.dlbox > div.video-nav > div.mobius > select.mirror').html()
    
    const spans = $(parent).find("div.single-info > div.infox > div.info-content > div.spe > span")
    const airing = spans.filter((i, el) => $(el).find("b").text() === "Dirilis:").first().text().replace("Dirilis:", "").trim();
    const infoObj = {};
    
    spans.each(function() {
        const text = $(this).text().trim();
        const match = text.match(/^(.+?):\s*(.+)$/);
        if(match) {
            infoObj[match[1]] = match[2];
        }
    });
    
    const networkStr = infoObj["Network"];
    const networkList = networkStr ? networkStr.split(",").map(n => n.trim()) : [];
    const negaraStr = infoObj["Negara"];
    const negaraList = negaraStr ? negaraStr.split(",").map(n => n.trim()) : [];
    const artistStr = infoObj["Artis"];
    const artistList = artistStr ? artistStr.split(",").map(name => ({pict: "", name: name.trim()})) : [];
    const serverList = [];
    const episodes = [];
    const downloadLinks = [];

    //episodes
    $('div#sidebar > div#mainepisode > div#singlepisode > div.episodelist > ul > li').each((i, el) => {
        const anchor = $(el).find('a');
        const title = anchor.attr('title') || null;
        const tamnel = anchor.find('div.thumbnel > img').attr('src').trim();
        const url = anchor.attr('href').trim() || null;
        const endpoint = url.substring(url.indexOf("/45.11.57.243/") + 14, url.length)
        const match = title.match(/Episode\s(\d+)/i);
        const episode = match ? parseInt(match[1], 10) : null;
        const time = anchor.find('div.playinfo > span').text().trim();

        episodes.push({
            episode,
            juduleps: title.trim(),
            tamnel,
            // url: endpoint,
            time,
            slug: endpoint
        });
    });

    //donlot
    $('div.dlbox ul li').each((i, el) => {
        if ($(el).hasClass('head')) return;

        const kualitas = $(el).find('span.w').text().trim();
        const url = $(el).find('span.e a').attr('href')?.trim();

        if (kualitas && url) {
                downloadLinks.push({
                kualitas,
                url
            });
        }
    });

    //server video
    $('select.mirror option').each((i, el) => {
        const rawValue = $(el).attr('value')?.trim() || '';
        const title = $(el).text().trim();

        const isEmpty = rawValue === '';
        const isPilih = title.toLowerCase().includes('pilih server video');

        if (isEmpty && isPilih) return;

        let decodedValue = rawValue;
        let src = null;

        try {
            if (rawValue !== '') {
                decodedValue = Buffer.from(rawValue, 'base64').toString('utf-8');

                const $iframe = cheerio.load(decodedValue);
                src = $iframe('iframe').attr('src') || $iframe('IFRAME').attr('SRC') || null;
            }
        } catch (err) {
            console.warn('Gagal decode value:', rawValue);
            decodedValue = rawValue;
            src = null;
        }

        serverList.push({
            title,
            value: src
        });
    });

    data.title = title
    data.title_alt = titleAlt
    data.thumbnail = thumbnail
    data.thumbnailAlt = thumbnailAlt
    data.synopsis = synopsis
    data.rating = parseFloat(rating.match(/[\d\.]+/)[0]);
    data.status = infoObj["Status"]
    data.durasi = infoObj["Durasi"]
    data.network = networkList
    data.aired = airing
    data.director = infoObj["Sutradara"]
    data.type = infoObj["Tipe"]
    data.donlot = downloadLinks
    data.negara = negaraList
    data.artist = artistList
    data.server = serverList
    data.totalEpisode = parseInt(infoObj["Episode"], 10) || 0
    data.episodes = episodes
    
    // genres
    $(parent).find("div.single-info >  div.infox > div.info-content > div.genxed > a")
    .each((i, e) => {
        genres.push($(e).text())
        
        data.genres = genres
    })

    return data
}

module.exports = {
    scrapeSeries,
    scrapeMovie,
    scrapeDetailAllType,
    scrapeWacthAllType,
    scrapeByGenre,
}