const cheerio = require("cheerio")
const axios = require("axios")

const scrapeSeries = async (req, res) => {
    const $ = cheerio.load(res.data)
    const datas = []
    // return {
    //     data: $.html()
    // }
    // const largestInt = []

    $("div#content > div.wrapper > div.postbody > div.bixbox > div.mrgn > div.listupd > article.bs")
    .each((i, e) => {
        const dataObject = {}

        const title = $(e).find("div.bsx > a").attr("title")  || null
        const status = $(e).find("div.bsx > a > div.limit > div.bt > span.epx").text()  || null
        const thumbnail = $(e).find("div.bsx > a > div.limit > img").attr("src")  || null
        const type = $(e).find("div.bsx > a > div.limit > div.typez").text()  || null
        const url = $(e).find("div.bsx > a").attr("href")
        const endpoint = url.substring(url.indexOf("/donghua/") + 9, url.length)
        
        dataObject.title = title
        dataObject.thumbnail = thumbnail
        dataObject.status = status
        dataObject.type = type
        dataObject.endpoint = endpoint
        
        datas.push(dataObject)
    })

    return {
        pagination: 12,
        datas
    }
}

const scrapeMovie = async (req, res) => {
    const $ = cheerio.load(res.data)
    const datas = []
    // return {
    //     data: $.html()
    // }
    // const largestInt = []

    $("div#content > div.wrapper > div.postbody > div.bixbox > div.mrgn > div.listupd > article.bs")
    .each((i, e) => {
        const dataObject = {}

        const title = $(e).find("div.bsx > a").attr("title")  || null
        const status = $(e).find("div.bsx > a > div.limit > div.bt > span.epx").text()  || null
        const thumbnail = $(e).find("div.bsx > a > div.limit > img").attr("src")  || null
        const type = $(e).find("div.bsx > a > div.limit > div.typez").text()  || null
        const url = $(e).find("div.bsx > a").attr("href")
        const endpoint = url.substring(url.indexOf("/donghua/") + 9, url.length)
        
        dataObject.title = title
        dataObject.thumbnail = thumbnail
        dataObject.status = status
        dataObject.type = type
        dataObject.endpoint = endpoint
        
        datas.push(dataObject)
    })

    return {
        pagination: 1,
        datas
    }
}

const scrapeDetail = async (req, res) => {
    // const { endpoint } = req
    const $ = cheerio.load(res.data)
    const data = {}
    const genres = []

    const parent  = $("div#content > div.wrapper > div.postbody > article.hentry")

    const title = $(parent).find("div.animefull > div.bigcontent > div.infox > h1").text()
    const titleAlt = $(parent).find("div.animefull > div.bigcontent > div.thumbook > div.thumb > img").attr("title") || null
    const synopsis = $(parent).find("div.synp > div.entry-content > p").map((i, el) => $(el).text().trim()).get().join('\n\n').replace(/Berikut adalah poin-poin penting dari sinopsisnya:/, '')
    const thumbnail = $(parent).find("div.animefull > div.bigcontent > div.thumbook > div.thumb > img").attr("src")
    const description = $(parent).find("div.animefull > div.bigcontent > div.infox > div.ninfo > div.info-content > div.desc").text().replace(/[\n\r\t\\]+/g, '').replace(/ANICHIN/g, 'STREAMCUY') || null
    const midesc = $(parent).find("div.animefull > div.bigcontent > div.infox > div.ninfo > div.mindesc").html().replace(/[\n\r\t\\]+/g, '').replace(/ANICHIN/g, 'STREAMCUY') || null
    const rating = $(parent).find("div.rt > div.rating > strong").text().trim() || null
    const trailerSrc = $(parent).find("div.trailer > div.tply > iframe").attr("src") || null
    const trailerTitle = $(parent).find("div.trailer > div.tply > iframe").attr("title") || null
    const spans = $(parent).find("div.animefull > div.bigcontent > div.infox > div.ninfo > div.info-content > div.spe > span")
    const airing = spans.filter((i, el) => $(el).find("b").text() === "Dirilis:").first().text().replace("Dirilis:", "").trim();
    const dirilis = spans.filter((i, el) => { return $(el).find('b').text() === 'Dirilis:' }).find('time').text().trim();
    const link = $(parent).find("div.animefull > div.bigcover > a").attr("href")
    // const endpoint = link.substring(link.indexOf("/45.11.57.186/") + 14, link.length)
    // const aTag = $(parent).find("div.animefull > div.bigcover");

    // console.log(aTag.html())

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
        const slug = endpoint.substring(endpoint.indexOf("/anichin.digital/") + 17, endpoint.length)

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
    data.rating = parseFloat(rating?.match(/[\d\.]+/)[0]);
    data.episodes = episodes
    data.status = infoObj["Status"]
    data.studio = infoObj["Studio"]
    data.durasi = infoObj["Durasi"]
    data.dirilis = dirilis
    data.airing = airing
    data.director = infoObj["Sutradara"]
    data.updated = infoObj["Diperbarui pada"]
    data.endpoint = link
    data.totalEpisode = parseInt(infoObj["Episode"], 10) || 0
    data.type = infoObj["Tipe"]
    data.negara = negaraList
    data.artist = artistList
    data.network = networkList
    data.trailer = trailer
    data.penerbit = infoObj["Diposting oleh"]

    
    // genres
    $(parent).find("div.animefull > div.bigcontent > div.infox > div.ninfo > div.info-content > div.genxed > a")
    .each((i, e) => {
        genres.push($(e).text())
        
        data.genres = genres
    })

    return data
}

const scrapeWacth = async (req, res) => {
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
    const rating = $(parent).find("div.single-info > div.infox > div.rating > strong").text().replace(/Rating /, '') || null
    const thumbnail = $(parent).find("div.megavid > div.mvelement > div.meta > div.tb > img").attr("src")
    const thumbnailAlt = $(parent).find('div.megavid > div.mvelement > div.meta > div.tb > meta[itemprop="url"]').attr("content")
    const description = $(parent).find("div.entry-content > div.infx > p").text().replace(/[\n\r\t\\]+/g, '').replace(/ANICHIN/g, 'STREAMCUY') || null
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
    $('div#singlepisode > div.episodelist > ul > li').each((i, el) => {
        const anchor = $(el).find('a');
        const title = anchor.find('div.playinfo > h3').text() || null;
        const url = anchor.attr('href').trim() || null;
        const endpoint = url.substring(url.indexOf("/anichin.digital/") + 17, url.length)
        const match = title.match(/Episode\s(\d+)/i);
        const num = match ? parseInt(match[1], 10) : i+1 || null;

        episodes.push({
            num,
            title: title.trim(),
            url: endpoint
        });
    });

    //donlot
    $('div.soraddlx > div.soraurlx').each((i, el) => {
        if ($(el).hasClass('head')) return;

        const kualitas = $(el).find('strong').text().trim();
        const url = $(el).find('a').attr('href')?.trim();

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
    data.description = description
    data.rating = parseFloat(rating?.match(/[\d\.]+/)[0]) || 0
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
    scrapeDetail,
    scrapeWacth
}