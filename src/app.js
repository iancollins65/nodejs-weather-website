const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const gears = require('./utils/gears')

const app = express()
const port = process.env.PORT || 3000

// Define paths for express configuration
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

// Set up handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Ian Collins'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Ian Collins'
    })
})

app.get('/gears', (req, res) => {
    res.render('gears', {
        title: 'Gears',
        name: 'Ian Collins'
    })
})

app.get('/gearDetails', (req, res) => {
    res.render('gearDetails', {
        title: 'Gear Details',
        name: 'Ian Collins'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: 'This is the help message',
        name: 'Ian Collins'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
    
            res.send({
                address: req.query.address,
                latitude,
                longitude,
                location,
                forecast: forecastData
            })
        })
    })
})

app.get('/gearInfo', (req, res) => {
    // Check for query string errors
    if (!req.query.chainRing && !req.query.cog) {
        return res.send({ error: 'chainRing and cog are not provided' })
    }

    if (!req.query.chainRing) {
        return res.send({ error: 'chainRing is not provided' })
    }

    if (!req.query.cog) {
        return res.send({ error: 'cog is not provided' })
    }

    const chainRing = Number(req.query.chainRing)
    if (isNaN(chainRing)) {
        return res.send({ error: 'chainRing is not numeric' })
    }
    if (!Number.isInteger(chainRing) || !(chainRing > 0)) {
        return res.send({ error: 'chainRing is not a positive integer' })
    }

    const cog = Number(req.query.cog)
    if (isNaN(cog)) {
        return res.send({ error: 'cog is not numeric' })
    }
    if (!Number.isInteger(cog) || !(cog > 0)) {
        return res.send({ error: 'cog is not a positive integer' })
    }

    let tyreWidth = 23
    if (req.query.tyreWidth) {
        tyreWidth = Number(req.query.tyreWidth)
        if (isNaN(tyreWidth)) {
            return res.send({ error: 'tyreWidth is not numeric' })
        }
        if (!Number.isInteger(tyreWidth) || !(tyreWidth > 0)) {
            return res.send({ error: 'tyreWidth is not a positive integer' })
        }
    }

    let rimType = '700c'
    if (req.query.rimType) {
        rimType = req.query.rimType
        if (!(rimType === '700c') && !(rimType === '650c')) {
            return res.send({ error: 'rimType must be 700c or 650c' })
        }
    }

    let speed = undefined
    if (req.query.speed) {
        speed = Number(req.query.speed)
        if (isNaN(speed)) {
            return res.send({ error: 'speed is not numeric' })
        }
        if (!(speed > 0)) {
            return res.send({ error: 'speed is not a positive number' })
        }
    }

    let cadence = undefined
    if (req.query.cadence) {
        cadence = Number(req.query.cadence)
        if (isNaN(cadence)) {
            return res.send({ error: 'cadence is not numeric' })
        }
        if (!(cadence > 0)) {
            return res.send({ error: 'cadence is not a positive number' })
        }
    }

    let lapLength = undefined
    if (req.query.lapLength) {
        lapLength = Number(req.query.lapLength)
        if (isNaN(lapLength)) {
            return res.send({ error: 'lapLength is not numeric' })
        }
        if (!(lapLength > 0)) {
            return res.send({ error: 'lapLength is not a positive number' })
        }
    }

    // Get the gear info
    const gearInfo = gears.getGearInfo(chainRing, cog, tyreWidth, rimType, speed, cadence, lapLength)

    res.send(gearInfo)
})

app.get('/help/*', (req, res) => {
    res.render('404_page', {
        title: '404 Error',
        errorMessage: 'Help article not found',
        name: 'Ian Collins'
    })
})

app.get('*', (req, res) => {
    res.render('404_page', {
        title: '404 Error',
        errorMessage: 'Page not found',
        name: 'Ian Collins'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

