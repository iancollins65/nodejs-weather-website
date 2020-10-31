const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const gears = require('./utils/gears')
const hpcUtils = require('./utils/hpc-utils')

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
// Experimenting with accessing hbs variables in js...
// hbs.registerHelper('json', (context) => {
//     return JSON.stringify(context);
// })

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
        name: 'Hot Pursuit Cycling'
    })
})

app.get('/gearDetails', (req, res) => {

    const {error, chainRing, cog, tyreWidth, rimType, extras, speed, cadence, lapLength, lapTime} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'chainRing', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'cog', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'tyreWidth', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'rimType', type: 'string', options: ['700c', '650c'], returnEmpty: true },
            { name: 'extras', type: 'string', options: ['none', 'cadenceAtSpeed', 'speedAtCadence', 'cadenceAtLapTime'], returnEmpty: true },
            { name: 'speed', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'cadence', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'lapTime', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'lapLength', type: 'decimal', sign: 'positive', returnEmpty: true }
    ])

    if (error) {
        res.render('gearDetails', {
            title: 'Gear Details',
            name: 'Hot Pursuit Cycling',
            chainRing: '',
            cog: '',
            tyreWidth: '',
            rimType: '',
            extras: '',
            speed: '',
            cadence: '',
            lapTime: '',
            lapLength: ''
        })
    } else {
        res.render('gearDetails', {
            title: 'Gear Details',
            name: 'Hot Pursuit Cycling',
            chainRing,
            cog,
            tyreWidth,
            rimType,
            extras,
            speed,
            cadence,
            lapTime,
            lapLength
        })
    }
})

app.get('/findGear', (req, res) => {

    const {error, findFor, gearInches, plusOrMinus, rollOut, maxDiff, speed, cadence, lapTime, lapLength, 
        fixed, tyreWidth, rimType, showMinMax, 
        minChainRing, maxChainRing, minCog, maxCog, minTeeth, maxTeeth} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'findFor', type: 'string', options: ['gearInches', 'rollOut', 'speedCadence', 'lapTimeCadence'], returnEmpty: true },
            { name: 'gearInches', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'plusOrMinus', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'rollOut', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'maxDiff', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'speed', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'cadence', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'fixed', type: 'string', options: ['cadence', 'speed'], returnEmpty: true },
            { name: 'lapTime', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'lapLength', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'tyreWidth', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'rimType', type: 'string', options: ['700c', '650c'], returnEmpty: true },
            { name: 'showMinMax', type: 'string', options: ['yes', 'no'], returnEmpty: true },
            { name: 'minChainRing', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'maxChainRing', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'minCog', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'maxCog', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'minTeeth', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'maxTeeth', type: 'integer', sign: 'positive', returnEmpty: true }
    ])

    if (error) {
        res.render('findGear', {
            title: 'Find Gear',
            name: 'Hot Pursuit Cycling', 
            findFor: '',
            gearInches: '', 
            plusOrMinus: '', 
            rollOut: '', 
            maxDiff: '', 
            speed: '', 
            cadence: '', 
            fixed: '', 
            lapTime: '', 
            lapLength: '', 
            tyreWidth: '', 
            rimType: '', 
            showMinMax: '',
            minChainRing: '', 
            maxChainRing: '', 
            minCog: '', 
            maxCog: '', 
            minTeeth: '', 
            maxTeeth: ''
        })
    } else {
        res.render('findGear', {
            title: 'Find Gear',
            name: 'Hot Pursuit Cycling', 
            findFor,
            gearInches, 
            plusOrMinus, 
            rollOut, 
            maxDiff, 
            speed, 
            cadence, 
            fixed, 
            lapTime, 
            lapLength, 
            tyreWidth, 
            rimType, 
            showMinMax,
            minChainRing, 
            maxChainRing, 
            minCog, 
            maxCog, 
            minTeeth, 
            maxTeeth
        })    
    }
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

    const {error, chainRing, cog, tyreWidth, rimType, speed, cadence, lapLength, lapTime} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'chainRing', mandatory: true, type: 'integer', sign: 'positive' },
            { name: 'cog', mandatory: true, type: 'integer', sign: 'positive' },
            { name: 'tyreWidth', default: 23, type: 'integer', sign: 'positive' },
            { name: 'rimType', default: '700c', type: 'string', options: ['700c', '650c'] },
            { name: 'speed', type: 'decimal', sign: 'positive' },
            { name: 'cadence', type: 'decimal', sign: 'positive' },
            { name: 'lapLength', type: 'decimal', sign: 'positive' },
            { name: 'lapTime', type: 'decimal', sign: 'positive' }
    ])

    if (error) {
        return res.send({ error })
    }

    // Get the gear info
    const gearInfo = gears.getGearInfo(chainRing, cog, tyreWidth, rimType, speed, cadence, 
        lapLength, lapTime)

    res.send(gearInfo)
})

app.get('/gearInchesOptions', (req, res) => {

    const {error, gearInches, plusOrMinus, sortByDiff, minChainRing, maxChainRing, 
        minCog, maxCog, minTeeth, maxTeeth} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'gearInches', mandatory: true, type: 'decimal', sign: 'positive' },
            { name: 'plusOrMinus', default: 1, type: 'decimal', sign: 'positive' },
            { name: 'sortByDiff', default: true, type: 'boolean'},
            { name: 'minChainRing', type: 'integer', sign: 'positive' },
            { name: 'maxChainRing', type: 'integer', sign: 'positive' },
            { name: 'minCog', type: 'integer', sign: 'positive' },
            { name: 'maxCog', type: 'integer', sign: 'positive' },
            { name: 'minTeeth', type: 'integer', sign: 'positive' },
            { name: 'maxTeeth', type: 'integer', sign: 'positive' }
    ])

    if (error) {
        return res.send({ error })
    }

    // Get the gear inches options
    const gearInchesOptions = gears.getChainRingAndCogOptionsForGearInches(gearInches, plusOrMinus, 
        sortByDiff, minChainRing, maxChainRing, minCog, maxCog, minTeeth, maxTeeth)

    res.send(gearInchesOptions)
})

app.get('/rollOutOptions', (req, res) => {

    const {error, rollOut, maxDiff, sortDesc, calcInches, tyreWidth, rimType, minChainRing, maxChainRing, 
        minCog, maxCog, minTeeth, maxTeeth} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'rollOut', mandatory: true, type: 'decimal', sign: 'positive' },
            { name: 'maxDiff', default: 1000, type: 'decimal', sign: 'positive' },
            { name: 'sortDesc', default: true, type: 'boolean'},
            { name: 'calcInches', default: true, type: 'boolean'},
            { name: 'tyreWidth', default: 23, type: 'integer', sign: 'positive' },
            { name: 'rimType', default: '700c', type: 'string', options: ['700c', '650c'] },
            { name: 'minChainRing', type: 'integer', sign: 'positive' },
            { name: 'maxChainRing', type: 'integer', sign: 'positive' },
            { name: 'minCog', type: 'integer', sign: 'positive' },
            { name: 'maxCog', type: 'integer', sign: 'positive' },
            { name: 'minTeeth', type: 'integer', sign: 'positive' },
            { name: 'maxTeeth', type: 'integer', sign: 'positive' }
    ])

    if (error) {
        return res.send({ error })
    }

    // Get the gear inches options
    const rollOutOptions = gears.getChainRingAndCogOptionsForRollOut(rollOut, maxDiff, sortDesc, 
        calcInches, tyreWidth, rimType, minChainRing, maxChainRing, minCog, maxCog, minTeeth, maxTeeth)

    res.send(rollOutOptions)
})

app.get('/speedCadenceOptions', (req, res) => {

    const {error, speed, cadence, fixed, plusOrMinus, tyreWidth, rimType, minChainRing, maxChainRing, 
        minCog, maxCog, minTeeth, maxTeeth} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'speed', mandatory: true, type: 'decimal', sign: 'positive' },
            { name: 'cadence', mandatory: true, type: 'decimal', sign: 'positive' },
            { name: 'fixed', default: 'cadence', type: 'string', options: ['cadence', 'speed'] },
            { name: 'plusOrMinus', default: 4, type: 'decimal', sign: 'positive' },
            { name: 'tyreWidth', default: 23, type: 'integer', sign: 'positive' },
            { name: 'rimType', default: '700c', type: 'string', options: ['700c', '650c'] },
            { name: 'minChainRing', type: 'integer', sign: 'positive' },
            { name: 'maxChainRing', type: 'integer', sign: 'positive' },
            { name: 'minCog', type: 'integer', sign: 'positive' },
            { name: 'maxCog', type: 'integer', sign: 'positive' },
            { name: 'minTeeth', type: 'integer', sign: 'positive' },
            { name: 'maxTeeth', type: 'integer', sign: 'positive' }
    ])

    if (error) {
        return res.send({ error })
    }

    // Get the gear inches options
    const speedCadenceOptions = gears.getChainRingAndCogOptionsForSpeedAndCadence(speed, cadence, fixed, 
        plusOrMinus, tyreWidth, rimType, minChainRing, maxChainRing, minCog, maxCog, minTeeth, maxTeeth)

    res.send(speedCadenceOptions)
})

app.get('/lapTimeCadenceOptions', (req, res) => {

    const {error, lapTime, lapLength, cadence, tyreWidth, rimType, minChainRing, maxChainRing, 
        minCog, maxCog, minTeeth, maxTeeth} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'lapTime', mandatory: true, type: 'decimal', sign: 'positive' },
            { name: 'lapLength', mandatory: true, type: 'decimal', sign: 'positive' },
            { name: 'cadence', mandatory: true, type: 'decimal', sign: 'positive' },
            { name: 'tyreWidth', default: 23, type: 'integer', sign: 'positive' },
            { name: 'rimType', default: '700c', type: 'string', options: ['700c', '650c'] },
            { name: 'minChainRing', type: 'integer', sign: 'positive' },
            { name: 'maxChainRing', type: 'integer', sign: 'positive' },
            { name: 'minCog', type: 'integer', sign: 'positive' },
            { name: 'maxCog', type: 'integer', sign: 'positive' },
            { name: 'minTeeth', type: 'integer', sign: 'positive' },
            { name: 'maxTeeth', type: 'integer', sign: 'positive' }
    ])

    if (error) {
        return res.send({ error })
    }

    // Get the gear inches options
    const lapTimeCadenceOptions = gears.getChainRingAndCogOptionsForLapTimeAndCadence(lapTime, lapLength, 
        cadence, tyreWidth, rimType, minChainRing, maxChainRing, minCog, maxCog, minTeeth, maxTeeth)

    res.send(lapTimeCadenceOptions)
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

