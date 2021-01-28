const path = require('path')
const express = require('express')
const hbs = require('hbs')
const { response } = require('express')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')



const app = express()

//handling static files(public dir)
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

//handeling view/templates files
const viewsPath = path.join(__dirname, '../templates/views')
app.set('views',viewsPath)


//handeling partials
const partialsPath = path.join(__dirname, '../templates/partials')
hbs.registerPartials(partialsPath)


//setting templating engine 
app.set('view engine', 'hbs')


app.get('', (req, res) => {
    res.render('index', {
        title:'Weather APP',
        name: 'Mordi Shushan'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title:'About Me',
        name: 'Mordi Shushan'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title:'Help',
        helpText: 'Some Helpful text',
        name: 'Mordi Shushan'
    })
})


app.get('/weather', (req,res) => {
    //DEBUG console.log(req.query)
    if (!req.query.address) {
        return res.send({
            error:'You much provide address '
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error) {
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forcastData) => {
            if(error) {
                return res.send({error})
            }

            res.send({
                forecast: forcastData,
                location,
                address: req.query.address


            })
        })
    })
    console.log(req.query.address)

}) 

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Mordi Shushan',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',   
        name: 'Mordi Shsuhan',
        errorMessage: 'Page not found.'
    })
})


app.listen(3000, () => {
    console.log('Server is up and running on port 3000')
})