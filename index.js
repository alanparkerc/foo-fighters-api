const PORT = process.env.PORT || 8000
const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const { response } = require('express')
const res = require('express/lib/response')

const app = express()

const websites = [
    {
        name: 'antimusic',
        address: 'https://www.antimusic.com/rocknews/'
    },
    {
        name: 'loudersound',
        address: 'https://www.loudersound.com/classic-rock/news'
    }
]

const articles = []

websites.forEach(website => {
    axios.get(website.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Foo Fighters")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url,
                    source: website.address
                })
            })
        }).catch((err) => console.log(err))
})

app.get('/', (req, res) => {
    res.json('Welcome to my Rock n Roll News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newsId', (req, res) => {
    const newsId = req.params.newsId

    const choiceWebsite = websites.filter(website => website.name == newsId)[0].address

    console.log(choiceWebsite)
    
    axios.get(choiceWebsite)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificNews = []

            $('a:contains("Foo Fighters")').each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificNews.push({
                    title,
                    url
                })
            })
            res.json(specificNews)
        }).catch(err => console.log(err))
}) 

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))

