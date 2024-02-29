const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const gears = require('./utils/gears')
const cassettes = require('./utils/cassettes')
const schedules = require('./utils/schedules')
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

// Page renders

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

    const {error, chainRing, cog, tyreWidth, rimType, crankLength, extras, speed, cadence, 
            lapLength, lapTime, measure, circumfranceApproach, measuredCircumfrance} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'chainRing', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'cog', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'tyreWidth', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'rimType', type: 'string', options: gears.getRimOptionsTypeArray(), returnEmpty: true },
            { name: 'crankLength', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'extras', type: 'string', options: ['none', 'cadenceAtSpeed', 'speedAtCadence', 'cadenceAtLapTime'], returnEmpty: true },
            { name: 'speed', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'cadence', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'lapTime', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'lapLength', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'measure', type: 'string', options: ['metric', 'imperial'], returnEmpty: true },
            { name: 'circumfranceApproach', type: 'string', options: ['estimated', 'measured'], returnEmpty: true },
            { name: 'measuredCircumfrance', type: 'decimal', sign: 'positive', returnEmpty: true }
    ])

    const rimTypeOptionsList = gears.getRimOptionsTypeStringList()
    const rimTypeDescriptionsList = gears.getRimOptionsDescStringList()

    if (error) {
        res.render('gearDetails', {
            title: 'Gear Details',
            name: 'Hot Pursuit Cycling',
            rimTypeOptionsList,
            rimTypeDescriptionsList,
            chainRing: '',
            cog: '',
            tyreWidth: '',
            rimType: '',
            crankLength: '',
            extras: '',
            speed: '',
            cadence: '',
            lapTime: '',
            lapLength: '',
            measure: '',
            circumfranceApproach: '',
            measuredCircumfrance: ''
        })
    } else {
        res.render('gearDetails', {
            title: 'Gear Details',
            name: 'Hot Pursuit Cycling',
            rimTypeOptionsList,
            rimTypeDescriptionsList,
            chainRing,
            cog,
            tyreWidth,
            rimType,
            crankLength,
            extras,
            speed,
            cadence,
            lapTime,
            lapLength,
            measure,
            circumfranceApproach,
            measuredCircumfrance
        })
    }
})

app.get('/compare2Gears', (req, res) => {

    const {error, chainRing1, cog1, chainRing2, cog2, tyreWidth1, tyreWidth2, 
            rimType1, rimType2, crankLength1, crankLength2, 
            extras, speed, cadence, lapLength, lapTime, measure,
            circumfranceApproach, measuredCircumfrance1, measuredCircumfrance2} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'chainRing1', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'cog1', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'chainRing2', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'cog2', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'tyreWidth1', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'tyreWidth2', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'rimType1', type: 'string', options: gears.getRimOptionsTypeArray(), returnEmpty: true },
            { name: 'rimType2', type: 'string', options: gears.getRimOptionsTypeArray(), returnEmpty: true },
            { name: 'crankLength1', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'crankLength2', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'extras', type: 'string', options: ['none', 'cadenceAtSpeed', 'speedAtCadence', 'cadenceAtLapTime'], returnEmpty: true },
            { name: 'speed', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'cadence', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'lapTime', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'lapLength', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'measure', type: 'string', options: ['metric', 'imperial'], returnEmpty: true },
            { name: 'circumfranceApproach', type: 'string', options: ['estimated', 'measured'], returnEmpty: true },
            { name: 'measuredCircumfrance1', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'measuredCircumfrance2', type: 'decimal', sign: 'positive', returnEmpty: true }
    ])

    const rimTypeOptionsList = gears.getRimOptionsTypeStringList()
    const rimTypeDescriptionsList = gears.getRimOptionsShortDescStringList()

    if (error) {
        res.render('compare2Gears', {
            title: 'Compare 2 Gears',
            name: 'Hot Pursuit Cycling',
            rimTypeOptionsList,
            rimTypeDescriptionsList,
            chainRing1: '',
            cog1: '',
            chainRing2: '',
            cog2: '',
            tyreWidth1: '',
            tyreWidth2: '',
            rimType1: '',
            rimType2: '',
            crankLength1: '',
            crankLength2: '',
            extras: '',
            speed: '',
            cadence: '',
            lapTime: '',
            lapLength: '',
            measure: '',
            circumfranceApproach: '',
            measuredCircumfrance1: '',
            measuredCircumfrance2: ''
        })
    } else {
        res.render('compare2Gears', {
            title: 'Compare 2 Gears',
            name: 'Hot Pursuit Cycling',
            rimTypeOptionsList,
            rimTypeDescriptionsList,
            chainRing1,
            cog1,
            chainRing2,
            cog2,
            tyreWidth1,
            tyreWidth2,
            rimType1,
            rimType2,
            crankLength1,
            crankLength2,
            extras,
            speed,
            cadence,
            lapTime,
            lapLength,
            measure,
            circumfranceApproach,
            measuredCircumfrance1,
            measuredCircumfrance2
        })
    }
})

app.get('/compare2GearsOld', (req, res) => {

    const {error, chainRing1, cog1, chainRing2, cog2, tyreWidth, rimType, extras, speed, cadence, lapLength, lapTime, measure} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'chainRing1', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'cog1', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'chainRing2', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'cog2', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'tyreWidth', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'rimType', type: 'string', options: gears.getRimOptionsTypeArray(), returnEmpty: true },
            { name: 'extras', type: 'string', options: ['none', 'cadenceAtSpeed', 'speedAtCadence', 'cadenceAtLapTime'], returnEmpty: true },
            { name: 'speed', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'cadence', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'lapTime', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'lapLength', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'measure', type: 'string', options: ['metric', 'imperial'], returnEmpty: true }
    ])

    const rimTypeOptionsList = gears.getRimOptionsTypeStringList()
    const rimTypeDescriptionsList = gears.getRimOptionsDescStringList()

    if (error) {
        res.render('compare2Gears', {
            title: 'Compare 2 Gears',
            name: 'Hot Pursuit Cycling',
            rimTypeOptionsList,
            rimTypeDescriptionsList,
            chainRing1: '',
            cog1: '',
            chainRing2: '',
            cog2: '',
            tyreWidth: '',
            rimType: '',
            extras: '',
            speed: '',
            cadence: '',
            lapTime: '',
            lapLength: '',
            measure: ''
        })
    } else {
        res.render('compare2Gears', {
            title: 'Compare 2 Gears',
            name: 'Hot Pursuit Cycling',
            rimTypeOptionsList,
            rimTypeDescriptionsList,
            chainRing1,
            cog1,
            chainRing2,
            cog2,
            tyreWidth,
            rimType,
            extras,
            speed,
            cadence,
            lapTime,
            lapLength,
            measure
        })
    }
})

app.get('/cassetteDetails', (req, res) => {

    const {error, chainRings, cogs, tyreWidth, rimType, crankLength, extras, speed, cadence, 
        lapLength, lapTime, measure, circumfranceApproach, measuredCircumfrance} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'chainRings', type: 'list', subType: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'cogs', type: 'list', subType: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'tyreWidth', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'rimType', type: 'string', options: gears.getRimOptionsTypeArray(), returnEmpty: true },
            { name: 'crankLength', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'extras', type: 'string', options: ['none', 'cadenceAtSpeed', 'speedAtCadence', 'cadenceAtLapTime'], returnEmpty: true },
            { name: 'speed', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'cadence', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'lapTime', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'lapLength', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'measure', type: 'string', options: ['metric', 'imperial'], returnEmpty: true },
            { name: 'circumfranceApproach', type: 'string', options: ['estimated', 'measured'], returnEmpty: true },
            { name: 'measuredCircumfrance', type: 'decimal', sign: 'positive', returnEmpty: true }
    ])

    const cassetteSpeedOptionsString = cassettes.getCassetteSpeedOptionsString()
    const rimTypeOptionsList = gears.getRimOptionsTypeStringList()
    const rimTypeDescriptionsList = gears.getRimOptionsDescStringList()

    if (error) {
        res.render('cassetteDetails', {
            title: 'Cassette Details',
            name: 'Hot Pursuit Cycling',
            speedOptions: cassetteSpeedOptionsString,
            rimTypeOptionsList,
            rimTypeDescriptionsList,
            chainRings: '',
            cogs: '',
            tyreWidth: '',
            rimType: '',
            crankLength: '',
            extras: '',
            speed: '',
            cadence: '',
            lapTime: '',
            lapLength: '',
            measure: '',
            circumfranceApproach: '',
            measuredCircumfrance: ''
        })
    } else {
        res.render('cassetteDetails', {
            title: 'Cassette Details',
            name: 'Hot Pursuit Cycling',
            speedOptions: cassetteSpeedOptionsString,
            rimTypeOptionsList,
            rimTypeDescriptionsList,
            chainRings,
            cogs,
            tyreWidth,
            rimType,
            crankLength,
            extras,
            speed,
            cadence,
            lapTime,
            lapLength,
            measure,
            circumfranceApproach,
            measuredCircumfrance
        })
    }
})

app.get('/findGear', (req, res) => {

    const {error, findFor, gearInches, gearRatio, plusOrMinus, rollOut, maxDiff, speed, cadence, lapTime, lapLength, 
        fixed, tyreWidth, rimType, showMinMax, 
        minChainRing, maxChainRing, minCog, maxCog, minTeeth, maxTeeth, measure, 
        crankLength, trueGearInches, gainRatio, circumfranceApproach, measuredCircumfrance} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'findFor', type: 'string', options: ['gearInches', 'trueGearInches', 'gearRatio', 'gainRatio', 'rollOut', 'speedCadence', 'lapTimeCadence'], returnEmpty: true },
            { name: 'gearInches', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'trueGearInches', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'gearRatio', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'gainRatio', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'plusOrMinus', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'rollOut', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'maxDiff', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'speed', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'cadence', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'fixed', type: 'string', options: ['cadence', 'speed'], returnEmpty: true },
            { name: 'lapTime', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'lapLength', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'tyreWidth', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'rimType', type: 'string', options: gears.getRimOptionsTypeArray(), returnEmpty: true },
            { name: 'crankLength', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'showMinMax', type: 'string', options: ['yes', 'no'], returnEmpty: true },
            { name: 'minChainRing', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'maxChainRing', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'minCog', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'maxCog', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'minTeeth', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'maxTeeth', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'measure', type: 'string', options: ['metric', 'imperial'], returnEmpty: true },
            { name: 'circumfranceApproach', type: 'string', options: ['estimated', 'measured'], returnEmpty: true },
            { name: 'measuredCircumfrance', type: 'decimal', sign: 'positive', returnEmpty: true }
        ])

    const rimTypeOptionsList = gears.getRimOptionsTypeStringList()
    const rimTypeDescriptionsList = gears.getRimOptionsDescStringList()

    if (error) {
        res.render('findGear', {
            title: 'Find Gear',
            name: 'Hot Pursuit Cycling', 
            rimTypeOptionsList,
            rimTypeDescriptionsList,
            findFor: '',
            gearInches: '', 
            trueGearInches: '', 
            plusOrMinus: '', 
            gearRatio: '', 
            gainRatio: '', 
            plusOrMinus2: '', 
            rollOut: '', 
            maxDiff: '', 
            speed: '', 
            cadence: '', 
            fixed: '', 
            lapTime: '', 
            lapLength: '', 
            tyreWidth: '', 
            rimType: '', 
            crankLength: '', 
            showMinMax: '',
            minChainRing: '', 
            maxChainRing: '', 
            minCog: '', 
            maxCog: '', 
            minTeeth: '', 
            maxTeeth: '',
            measure: '',
            circumfranceApproach: '',
            measuredCircumfrance: ''
        })
    } else {
        res.render('findGear', {
            title: 'Find Gear',
            name: 'Hot Pursuit Cycling', 
            rimTypeOptionsList,
            rimTypeDescriptionsList,
            findFor,
            gearInches,
            trueGearInches,
            plusOrMinus, 
            gearRatio,
            gainRatio,
            plusOrMinus2: plusOrMinus, 
            rollOut, 
            maxDiff, 
            speed, 
            cadence, 
            fixed, 
            lapTime, 
            lapLength, 
            tyreWidth, 
            rimType,
            crankLength, 
            showMinMax,
            minChainRing, 
            maxChainRing, 
            minCog, 
            maxCog, 
            minTeeth, 
            maxTeeth,
            measure,
            circumfranceApproach,
            measuredCircumfrance
        })    
    }
})

app.get('/calcSchedule', (req, res) => {

    const {error, label, scheduleType, scheduleBy, lapDistance, distanceLaps, timeSeconds, 
        tempoTarget, startType, upToSpeedTime, timingsAt, speedTempo, cadenceTempo, 
        chainRing, cog, tyreWidth, rimType, measure} = 
        schedules.validateQueryString(req.query, [
            { name: 'label', type: 'string', returnEmpty: true },
            { name: 'scheduleType', type: 'string', options: ['rideDistance', 'rideTime'], returnEmpty: true },
            { name: 'scheduleBy', type: 'string', options: ['tempo', 'time', 'distance', 'speed', 'cadence'], returnEmpty: true },
            { name: 'lapDistance', default: 250, type: 'decimal', sign: 'positive' },
            { name: 'distanceLaps', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'timeSeconds', type: 'H:MM:SS', convert: false, returnEmpty: true },
            { name: 'tempoTarget', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'startType', type: 'string', options: ['standing', 'flying'], returnEmpty: true },
            { name: 'upToSpeedTime', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'timingsAt', type: 'string', options: ['halfLap', 'fullLap', 'both'], returnEmpty: true },
            { name: 'speedTempo', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'cadenceTempo', type: 'decimal', sign: 'positive', returnEmpty: true },
            { name: 'chainRing', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'cog', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'tyreWidth', type: 'integer', sign: 'positive', returnEmpty: true },
            { name: 'rimType', type: 'string', options: gears.getRimOptionsTypeArray(), returnEmpty: true },
            { name: 'measure', type: 'string', options: ['metric', 'imperial'], returnEmpty: true }
    ])

    const rimTypeOptionsList = gears.getRimOptionsTypeStringList()
    const rimTypeDescriptionsList = gears.getRimOptionsDescStringList()

    if (error) {
        res.render('calcSchedule', {
            title: 'Calculate Schedule',
            name: 'Hot Pursuit Cycling',
            rimTypeOptionsList,
            rimTypeDescriptionsList,
            label: '',
            lapLength: '250',
            scheduleType: '',
            distanceLaps: '',
            rideTime: '',
            scheduleBy: '',
            tempo: '',
            time: '',
            distance: '',
            speed: '',
            cadence: '',
            startType: '',
            upToSpeed: '',
            timingsAt: '',
            chainRing: '',
            cog: '',
            tyreWidth: '',
            rimType: '',
            measure: ''
        })
    } else {
        res.render('calcSchedule', {
            title: 'Calculate Schedule',
            name: 'Hot Pursuit Cycling',
            rimTypeOptionsList,
            rimTypeDescriptionsList,
            label,
            lapLength: lapDistance,
            scheduleType,
            distanceLaps,
            rideTime: timeSeconds,
            scheduleBy,
            tempo: tempoTarget,
            time: timeSeconds,
            distance: distanceLaps,
            speed: speedTempo,
            cadence: cadenceTempo,
            startType,
            upToSpeed: upToSpeedTime,
            timingsAt,
            chainRing,
            cog,
            tyreWidth,
            rimType,
            measure
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

// End-points

app.get('/gearInfo', (req, res) => {

    const {error, chainRing, cog, tyreWidth, rimType, crankLength, speed, cadence, lapLength, lapTime, 
        measure, circumfranceApproach, measuredCircumfrance} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'chainRing', mandatory: true, type: 'integer', sign: 'positive' },
            { name: 'cog', mandatory: true, type: 'integer', sign: 'positive' },
            { name: 'tyreWidth', default: 23, type: 'integer', sign: 'positive' },
            { name: 'rimType', default: '700c', type: 'string', options: gears.getRimOptionsTypeArray() },
            { name: 'crankLength', default: 172.5, type: 'decimal', sign: 'positive' },
            { name: 'speed', type: 'decimal', sign: 'positive' },
            { name: 'cadence', type: 'decimal', sign: 'positive' },
            { name: 'lapLength', type: 'decimal', sign: 'positive' },
            { name: 'lapTime', type: 'decimal', sign: 'positive' },
            { name: 'measure', default: 'metric', type: 'string', options: ['metric', 'imperial'] },
            { name: 'circumfranceApproach', default: 'estimated', type: 'string', options: ['estimated', 'measured'] },
            { name: 'measuredCircumfrance', mandatoryIfField: 'circumfranceApproach', mandatoryIfValue: 'measured', default: 2100.000, type: 'decimal', sign: 'positive' }
    ])

    if (error) {
        return res.send({ error })
    }

    // Get the gear info
    const gearInfo = gears.getGearInfo(chainRing, cog, tyreWidth, rimType, speed, cadence, 
        lapLength, lapTime, measure, crankLength, circumfranceApproach, measuredCircumfrance)

    res.send(gearInfo)
})

app.get('/comp2Gears', (req, res) => {

    const {error, chainRing1, cog1, chainRing2, cog2, tyreWidth, rimType, speed, cadence, lapLength, lapTime, measure} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'chainRing1', mandatory: true, type: 'integer', sign: 'positive' },
            { name: 'cog1', mandatory: true, type: 'integer', sign: 'positive' },
            { name: 'chainRing2', mandatory: true, type: 'integer', sign: 'positive' },
            { name: 'cog2', mandatory: true, type: 'integer', sign: 'positive' },
            { name: 'tyreWidth', default: 23, type: 'integer', sign: 'positive' },
            { name: 'rimType', default: '700c', type: 'string', options: gears.getRimOptionsTypeArray() },
            { name: 'speed', type: 'decimal', sign: 'positive' },
            { name: 'cadence', type: 'decimal', sign: 'positive' },
            { name: 'lapLength', type: 'decimal', sign: 'positive' },
            { name: 'lapTime', type: 'decimal', sign: 'positive' },
            { name: 'measure', default: 'metric', type: 'string', options: ['metric', 'imperial'] }
    ])

    if (error) {
        return res.send({ error })
    }

    // Get the gear info
    const gearInfo1 = gears.getGearInfo(chainRing1, cog1, tyreWidth, rimType, speed, cadence, 
        lapLength, lapTime, measure)
    const gearInfo2 = gears.getGearInfo(chainRing2, cog2, tyreWidth, rimType, speed, cadence, 
        lapLength, lapTime, measure)
    
    const twoGears = {
        gear1: gearInfo1,
        gear2: gearInfo2
    }

    res.send(twoGears)
})

app.get('/comp2GearsFull', (req, res) => {

    const {error, chainRing1, cog1, chainRing2, cog2, tyreWidth1, tyreWidth2, 
            rimType1, rimType2, crankLength1, crankLength2, speed, cadence, lapLength, lapTime, measure, 
            circumfranceApproach, measuredCircumfrance1, measuredCircumfrance2} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'chainRing1', mandatory: true, type: 'integer', sign: 'positive' },
            { name: 'cog1', mandatory: true, type: 'integer', sign: 'positive' },
            { name: 'chainRing2', mandatory: true, type: 'integer', sign: 'positive' },
            { name: 'cog2', mandatory: true, type: 'integer', sign: 'positive' },
            { name: 'tyreWidth1', default: 23, type: 'integer', sign: 'positive' },
            { name: 'tyreWidth2', default: 23, type: 'integer', sign: 'positive' },
            { name: 'rimType1', default: '700c', type: 'string', options: gears.getRimOptionsTypeArray() },
            { name: 'rimType2', default: '700c', type: 'string', options: gears.getRimOptionsTypeArray() },
            { name: 'crankLength1', default: 172.5, type: 'decimal', sign: 'positive' },
            { name: 'crankLength2', default: 172.5, type: 'decimal', sign: 'positive' },
            { name: 'speed', type: 'decimal', sign: 'positive' },
            { name: 'cadence', type: 'decimal', sign: 'positive' },
            { name: 'lapLength', type: 'decimal', sign: 'positive' },
            { name: 'lapTime', type: 'decimal', sign: 'positive' },
            { name: 'measure', default: 'metric', type: 'string', options: ['metric', 'imperial'] },
            { name: 'circumfranceApproach', default: 'estimated', type: 'string', options: ['estimated', 'measured'] },
            { name: 'measuredCircumfrance1', mandatoryIfField: 'circumfranceApproach', mandatoryIfValue: 'measured', default: 2100.000, type: 'decimal', sign: 'positive' },
            { name: 'measuredCircumfrance2', mandatoryIfField: 'circumfranceApproach', mandatoryIfValue: 'measured', default: 2100.000, type: 'decimal', sign: 'positive' }
    ])

    if (error) {
        return res.send({ error })
    }

    // Get the gear info
    const gearInfo1 = gears.getGearInfo(chainRing1, cog1, tyreWidth1, rimType1, speed, cadence, 
        lapLength, lapTime, measure, crankLength1, circumfranceApproach, measuredCircumfrance1)
    const gearInfo2 = gears.getGearInfo(chainRing2, cog2, tyreWidth2, rimType2, speed, cadence, 
        lapLength, lapTime, measure, crankLength2, circumfranceApproach, measuredCircumfrance2)
    
    const twoGears = {
        gear1: gearInfo1,
        gear2: gearInfo2
    }

    res.send(twoGears)
})

app.get('/cassettesBySpeed', (req, res) => {

    const {error, speed} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'speed', mandatory: true, type: 'integer', sign: 'positive' }
    ])

    if (error) {
        return res.send({ error })
    }

    // Get the gear info
    const cassettesBySpeed = cassettes.getCassettesBySpeed(speed)

    res.send(cassettesBySpeed)
})

app.get('/cassetteInfo', (req, res) => {

    const extras = req.query.extras
    const {error, chainRings, cogs, tyreWidth, rimType, crankLength, speed, cadence, 
            lapLength, lapTime, measure, circumfranceApproach, measuredCircumfrance} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'chainRings', mandatory: true, type: 'list', subType: 'integer', sign: 'positive' },
            { name: 'cogs', mandatory: true, type: 'list', subType: 'integer', sign: 'positive' },
            { name: 'tyreWidth', default: 23, type: 'integer', sign: 'positive' },
            { name: 'rimType', default: '700c', type: 'string', options: gears.getRimOptionsTypeArray() },
            { name: 'crankLength', default: 172.5, type: 'decimal', sign: 'positive' },
            { name: 'speed', mandatory: Boolean(extras === 'cadence'), type: 'decimal', sign: 'positive' },
            { name: 'cadence', mandatory: Boolean(extras === 'speed'), type: 'decimal', sign: 'positive' },
            { name: 'lapTime', mandatory: Boolean(extras === 'cadenceLapTime'), type: 'decimal', sign: 'positive' },
            { name: 'lapLength', mandatory: Boolean(extras === 'cadenceLapTime'), type: 'decimal', sign: 'positive' },
            { name: 'measure', default: 'metric', type: 'string', options: ['metric', 'imperial'] },
            { name: 'circumfranceApproach', default: 'estimated', type: 'string', options: ['estimated', 'measured'] },
            { name: 'measuredCircumfrance', mandatoryIfField: 'circumfranceApproach', mandatoryIfValue: 'measured', default: 2100.000, type: 'decimal', sign: 'positive' }
    ])

    if (error) {
        return res.send({ error })
    }

    // Get the gear info
    const gearInfoForCassette = gears.getGearInfoForCassette(chainRings, cogs, tyreWidth, rimType, speed, cadence, 
        lapLength, lapTime, measure, crankLength, circumfranceApproach, measuredCircumfrance)

    res.send(gearInfoForCassette)
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

app.get('/trueGearInchesOptions', (req, res) => {

    const {error, trueGearInches, plusOrMinus, sortByDiff, tyreWidth, rimType, minChainRing, maxChainRing, 
        minCog, maxCog, minTeeth, maxTeeth, measure, circumfranceApproach, measuredCircumfrance} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'trueGearInches', mandatory: true, type: 'decimal', sign: 'positive' },
            { name: 'plusOrMinus', default: 1, type: 'decimal', sign: 'positive' },
            { name: 'sortByDiff', default: true, type: 'boolean'},
            { name: 'tyreWidth', default: 23, type: 'integer', sign: 'positive' },
            { name: 'rimType', default: '700c', type: 'string', options: gears.getRimOptionsTypeArray() },
            { name: 'minChainRing', type: 'integer', sign: 'positive' },
            { name: 'maxChainRing', type: 'integer', sign: 'positive' },
            { name: 'minCog', type: 'integer', sign: 'positive' },
            { name: 'maxCog', type: 'integer', sign: 'positive' },
            { name: 'minTeeth', type: 'integer', sign: 'positive' },
            { name: 'maxTeeth', type: 'integer', sign: 'positive' },
            { name: 'measure', default: 'metric', type: 'string', options: ['metric', 'imperial'] },
            { name: 'circumfranceApproach', default: 'estimated', type: 'string', options: ['estimated', 'measured'] },
            { name: 'measuredCircumfrance', mandatoryIfField: 'circumfranceApproach', mandatoryIfValue: 'measured', default: 2100.000, type: 'decimal', sign: 'positive' }
    ])

    if (error) {
        return res.send({ error })
    }

    // Get the gear inches options
    const trueGearInchesOptions = gears.getChainRingAndCogOptionsForTrueGearInches(trueGearInches, plusOrMinus, 
        sortByDiff, tyreWidth, rimType, minChainRing, maxChainRing, minCog, maxCog, minTeeth, maxTeeth, 
        measure, circumfranceApproach, measuredCircumfrance)

    res.send(trueGearInchesOptions)
})

app.get('/gearRatioOptions', (req, res) => {

    const {error, gearRatio, plusOrMinus, sortByDiff, minChainRing, maxChainRing, 
        minCog, maxCog, minTeeth, maxTeeth} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'gearRatio', mandatory: true, type: 'decimal', sign: 'positive' },
            { name: 'plusOrMinus', default: 0.1, type: 'decimal', sign: 'positive' },
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
    const gearRatioOptions = gears.getChainRingAndCogOptionsForGearRatio(gearRatio, plusOrMinus, 
        sortByDiff, minChainRing, maxChainRing, minCog, maxCog, minTeeth, maxTeeth)

    res.send(gearRatioOptions)
})

app.get('/rollOutOptions', (req, res) => {

    const {error, rollOut, maxDiff, sortDesc, calcInches, tyreWidth, rimType, minChainRing, maxChainRing, 
        minCog, maxCog, minTeeth, maxTeeth, measure, circumfranceApproach, measuredCircumfrance} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'rollOut', mandatory: true, type: 'decimal', sign: 'positive' },
            { name: 'maxDiff', default: 1000, type: 'decimal', sign: 'positive' },
            { name: 'sortDesc', default: true, type: 'boolean'},
            { name: 'calcInches', default: true, type: 'boolean'},
            { name: 'tyreWidth', default: 23, type: 'integer', sign: 'positive' },
            { name: 'rimType', default: '700c', type: 'string', options: gears.getRimOptionsTypeArray() },
            { name: 'minChainRing', type: 'integer', sign: 'positive' },
            { name: 'maxChainRing', type: 'integer', sign: 'positive' },
            { name: 'minCog', type: 'integer', sign: 'positive' },
            { name: 'maxCog', type: 'integer', sign: 'positive' },
            { name: 'minTeeth', type: 'integer', sign: 'positive' },
            { name: 'maxTeeth', type: 'integer', sign: 'positive' },
            { name: 'measure', default: 'metric', type: 'string', options: ['metric', 'imperial'] },
            { name: 'circumfranceApproach', default: 'estimated', type: 'string', options: ['estimated', 'measured'] },
            { name: 'measuredCircumfrance', mandatoryIfField: 'circumfranceApproach', mandatoryIfValue: 'measured', default: 2100.000, type: 'decimal', sign: 'positive' }
        ])

    if (error) {
        return res.send({ error })
    }

    // Get the options
    const rollOutOptions = gears.getChainRingAndCogOptionsForRollOut(rollOut, maxDiff, sortDesc, 
        calcInches, tyreWidth, rimType, minChainRing, maxChainRing, minCog, maxCog, minTeeth, maxTeeth, 
        measure, circumfranceApproach, measuredCircumfrance)

    res.send(rollOutOptions)
})

app.get('/gainRatioOptions', (req, res) => {

    const {error, gainRatio, plusOrMinus, sortByDiff, tyreWidth, rimType, crankLength, minChainRing, maxChainRing, 
        minCog, maxCog, minTeeth, maxTeeth, measure, circumfranceApproach, measuredCircumfrance} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'gainRatio', mandatory: true, type: 'decimal', sign: 'positive' },
            { name: 'plusOrMinus', default: 0.2, type: 'decimal', sign: 'positive' },
            { name: 'sortByDiff', default: true, type: 'boolean'},
            { name: 'tyreWidth', default: 23, type: 'integer', sign: 'positive' },
            { name: 'rimType', default: '700c', type: 'string', options: gears.getRimOptionsTypeArray() },
            { name: 'crankLength', default: 172.5, type: 'decimal', sign: 'positive' },
            { name: 'minChainRing', type: 'integer', sign: 'positive' },
            { name: 'maxChainRing', type: 'integer', sign: 'positive' },
            { name: 'minCog', type: 'integer', sign: 'positive' },
            { name: 'maxCog', type: 'integer', sign: 'positive' },
            { name: 'minTeeth', type: 'integer', sign: 'positive' },
            { name: 'maxTeeth', type: 'integer', sign: 'positive' },
            { name: 'measure', default: 'metric', type: 'string', options: ['metric', 'imperial'] },
            { name: 'circumfranceApproach', default: 'estimated', type: 'string', options: ['estimated', 'measured'] },
            { name: 'measuredCircumfrance', mandatoryIfField: 'circumfranceApproach', mandatoryIfValue: 'measured', default: 2100.000, type: 'decimal', sign: 'positive' }
    ])

    if (error) {
        return res.send({ error })
    }

    // Get the options
    const gainRatioOptions = gears.getChainRingAndCogOptionsForGainRatio(gainRatio, plusOrMinus, sortByDiff, 
        tyreWidth, rimType, crankLength, minChainRing, maxChainRing, minCog, maxCog, minTeeth, maxTeeth, 
        measure, circumfranceApproach, measuredCircumfrance)

    res.send(gainRatioOptions)
})

app.get('/speedCadenceOptions', (req, res) => {

    const {error, speed, cadence, fixed, plusOrMinus, tyreWidth, rimType, minChainRing, maxChainRing, 
        minCog, maxCog, minTeeth, maxTeeth, measure, circumfranceApproach, measuredCircumfrance} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'speed', mandatory: true, type: 'decimal', sign: 'positive' },
            { name: 'cadence', mandatory: true, type: 'decimal', sign: 'positive' },
            { name: 'fixed', default: 'cadence', type: 'string', options: ['cadence', 'speed'] },
            { name: 'plusOrMinus', default: 4, type: 'decimal', sign: 'positive' },
            { name: 'tyreWidth', default: 23, type: 'integer', sign: 'positive' },
            { name: 'rimType', default: '700c', type: 'string', options: gears.getRimOptionsTypeArray() },
            { name: 'minChainRing', type: 'integer', sign: 'positive' },
            { name: 'maxChainRing', type: 'integer', sign: 'positive' },
            { name: 'minCog', type: 'integer', sign: 'positive' },
            { name: 'maxCog', type: 'integer', sign: 'positive' },
            { name: 'minTeeth', type: 'integer', sign: 'positive' },
            { name: 'maxTeeth', type: 'integer', sign: 'positive' },
            { name: 'measure', default: 'metric', type: 'string', options: ['metric', 'imperial'] },
            { name: 'circumfranceApproach', default: 'estimated', type: 'string', options: ['estimated', 'measured'] },
            { name: 'measuredCircumfrance', mandatoryIfField: 'circumfranceApproach', mandatoryIfValue: 'measured', default: 2100.000, type: 'decimal', sign: 'positive' }
    ])

    if (error) {
        return res.send({ error })
    }

    // Get the speed cadence options
    const speedCadenceOptions = gears.getChainRingAndCogOptionsForSpeedAndCadence(speed, cadence, fixed, 
        plusOrMinus, tyreWidth, rimType, minChainRing, maxChainRing, minCog, maxCog, minTeeth, maxTeeth, 
        measure, circumfranceApproach, measuredCircumfrance)

    res.send(speedCadenceOptions)
})

app.get('/lapTimeCadenceOptions', (req, res) => {

    const {error, lapTime, lapLength, cadence, tyreWidth, rimType, minChainRing, maxChainRing, 
        minCog, maxCog, minTeeth, maxTeeth, measure, circumfranceApproach, measuredCircumfrance} = 
        hpcUtils.validateQueryString(req.query, [
            { name: 'lapTime', mandatory: true, type: 'decimal', sign: 'positive' },
            { name: 'lapLength', mandatory: true, type: 'decimal', sign: 'positive' },
            { name: 'cadence', mandatory: true, type: 'decimal', sign: 'positive' },
            { name: 'tyreWidth', default: 23, type: 'integer', sign: 'positive' },
            { name: 'rimType', default: '700c', type: 'string', options: gears.getRimOptionsTypeArray() },
            { name: 'minChainRing', type: 'integer', sign: 'positive' },
            { name: 'maxChainRing', type: 'integer', sign: 'positive' },
            { name: 'minCog', type: 'integer', sign: 'positive' },
            { name: 'maxCog', type: 'integer', sign: 'positive' },
            { name: 'minTeeth', type: 'integer', sign: 'positive' },
            { name: 'maxTeeth', type: 'integer', sign: 'positive' },
            { name: 'measure', default: 'metric', type: 'string', options: ['metric', 'imperial'] },
            { name: 'circumfranceApproach', default: 'estimated', type: 'string', options: ['estimated', 'measured'] },
            { name: 'measuredCircumfrance', mandatoryIfField: 'circumfranceApproach', mandatoryIfValue: 'measured', default: 2100.000, type: 'decimal', sign: 'positive' }
    ])

    if (error) {
        return res.send({ error })
    }

    // Get the options
    const lapTimeCadenceOptions = gears.getChainRingAndCogOptionsForLapTimeAndCadence(lapTime, lapLength, 
        cadence, tyreWidth, rimType, minChainRing, maxChainRing, minCog, maxCog, minTeeth, maxTeeth, 
        measure, circumfranceApproach, measuredCircumfrance)

    res.send(lapTimeCadenceOptions)
})

app.get('/calculateSchedule', (req, res) => {

    const {error, label, scheduleType, scheduleBy, lapDistance, distanceLaps, timeSeconds, 
        tempoTarget, startType, upToSpeedTime, timingsAt, speedTempo, cadenceTempo, rollOut,
        chainRing, cog, tyreWidth, rimType, measure} = 
        schedules.validateQueryString(req.query, [
            { name: 'label', type: 'string' },
            { name: 'scheduleType', default: 'rideDistance', type: 'string', options: ['rideDistance', 'rideTime'] },
            { name: 'scheduleBy', default: 'tempo', type: 'string', options: ['tempo', 'time', 'distance', 'speed', 'cadence'] },
            { name: 'lapDistance', mandatory: true, type: 'decimal', sign: 'positive' },
            { name: 'distanceLaps', type: 'decimal', sign: 'positive' },
            { name: 'timeSeconds', type: 'H:MM:SS' },
            { name: 'tempoTarget', type: 'decimal', sign: 'positive' },
            { name: 'startType', default: 'standing', type: 'string', options: ['standing', 'flying'] },
            { name: 'upToSpeedTime', type: 'decimal', sign: 'positive' },
            { name: 'timingsAt', default: 'fullLap', type: 'string', options: ['halfLap', 'fullLap', 'both'] },
            { name: 'speedTempo', type: 'decimal', sign: 'positive' },
            { name: 'cadenceTempo', type: 'decimal', sign: 'positive' },
            { name: 'chainRing', type: 'integer', sign: 'positive' },
            { name: 'cog', type: 'integer', sign: 'positive' },
            { name: 'tyreWidth', default: 23, type: 'integer', sign: 'positive' },
            { name: 'rimType', default: '700c', type: 'string', options: gears.getRimOptionsTypeArray() },
            { name: 'rollOut', type: 'decimal', sign: 'positive' },
            { name: 'measure', default: 'metric', type: 'string', options: ['metric', 'imperial'] }
    ])

    if (error) {
        return res.send({ error })
    }

    const scheduleParams = {
        label,
        scheduleType, 
        scheduleBy, 
        lapDistance, 
        distanceLaps, 
        timeSeconds, 
        tempoTarget, 
        startType,
        upToSpeedTime,
        timingsAt,
        speedTempo,
        cadenceTempo,
        gear: {
            chainRing: chainRing,
            cog: cog,
            tyreWidth: tyreWidth,
            rimType: rimType,
            rollOut: rollOut
        },
        measure
    }

    // Calculate the schedule
    const schedule = schedules.calcSchedule(scheduleParams)
    //console.log(schedule)

    res.send(schedule)
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

