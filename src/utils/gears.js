const milesToKm = 1.60934
const kmToMiles = 0.621371
const ydsToM = 0.9144
const mToYds = 1.09361
const inchesToMm = 25.4
const mmToInches = 0.0393701

const getGearRatio = (chainRing, cog) => {
    return chainRing / cog
}

const getGearInches = (gearRatio) => {
    return gearRatio * 27
}

const getWheelDiameter = (rimDiameter, tyreWidth) => {
    return rimDiameter + (2 * tyreWidth)
}

const getTrueGearInches = (gearRatio, wheelDiameter) => {
    return gearRatio * wheelDiameter * mmToInches
}

const getWheelCircumfrance = (rimDiameter, tyreWidth) => {
    return getWheelDiameter(rimDiameter, tyreWidth) * Math.PI
}

const getWheelCircumfranceGivenDiameter = (wheelDiameter) => {
    return wheelDiameter * Math.PI
}

const getRollOut = (gearRatio, wheelCircumfrance) => {
    return gearRatio * wheelCircumfrance
}

const getRadiusRatio = (crankLength, wheelDiameter) => {
    const wheelRadius = wheelDiameter / 2
    return wheelRadius / crankLength
}

const getGainRatio = (gearRatio, radiusRatio) => {
    return radiusRatio * gearRatio
}

const rimOptions = [
    {
        type: '700c',
        size: 622,
        description: '700c_(622mm)',
        short: '700c'
    },
    {
        type: '650c',
        size: 571,
        description: '650c_(571mm)',
        short: '650c'
    },
    {
        type: '650b',
        size: 584,
        description: '650b_(584mm)',
        short: '650b'
    },
    {
        type: '29er',
        size: 622,
        description: '29er_(622mm)',
        short: '29er'
    },
    {
        type: '27.5',
        size: 584,
        description: '27.5_(584mm)',
        short: '27.5'
    },
    {
        type: '28inch',
        size: 635,
        description: '28_inch_(635mm)',
        short: '28'
    },
    {
        type: '27inch',
        size: 630,
        description: '27_inch_(630mm)',
        short: '27'
    },
    {
        type: '26inch_mtb',
        size: 559,
        description: '26_inch_mtb_(559mm)',
        short: '26_mtb'
    },
    {
        type: '24inch_S5',
        size: 547,
        description: '24_inch_S5_(547mm)',
        short: '24_S5'
    },
    {
        type: '24inch_E6',
        size: 540,
        description: '24_inch_E6_(540mm)',
        short: '24_E6'
    },
    {
        type: '24inch_Terry',
        size: 520,
        description: '24_inch_Terry_(520mm)',
        short: '24_Terry'
    },
    {
        type: '24inch_mtb',
        size: 507,
        description: '24_inch_mtb_(507mm)',
        short: '24_mtb'
    },
    {
        type: '24inch_bmx',
        size: 507,
        description: '24_inch_bmx_(507mm)',
        short: '24_bmx'
    },
    {
        type: '20inch_recumb',
        size: 451,
        description: '20_inch_recumb_(451mm)',
        short: '20_recumb'
    },
    {
        type: '20inch_Schwinn',
        size: 419,
        description: '20_inch_Schwinn_(419mm)',
        short: '20_Schwinn'
    },
    {
        type: '20inch_bmx',
        size: 406,
        description: '20_inch_bmx_(406mm)',
        short: '20_bmx'
    },
    {
        type: '20inch_recumb',
        size: 406,
        description: '20_inch_recumb_(406mm)',
        short: '20_recumb'
    },
    {
        type: '17inch',
        size: 369,
        description: '17_inch_(369mm)',
        short: '17'
    },
    {
        type: '16inch_Brompton',
        size: 349,
        description: '16_inch_Brompton_(349mm)',
        short: '16_Brom'
    }
]

const getRimSizeByType = (type) => {
    const rim = rimOptions.find((rim) => rim.type === type)
    if (rim) {
        return rim.size
    } else {
        return undefined
    }   
}

const getRimOptionsTypeArray = () => {
    let rimOptionsTypeArray = []
    for (rim of rimOptions) {
        rimOptionsTypeArray.push(rim.type)
    }
    return rimOptionsTypeArray
}

const getRimOptionsTypeStringList = () => {
    return getArrayString(getRimOptionsTypeArray())
}

const getRimOptionsDescArray = () => {
    let rimOptionsDescArray = []
    for (rim of rimOptions) {
        rimOptionsDescArray.push(rim.description)
    }
    return rimOptionsDescArray
}

const getRimOptionsDescStringList = () => {
    return getArrayString(getRimOptionsDescArray())
}

const getRimOptionsShortDescArray = () => {
    let rimOptionsShortDescArray = []
    for (rim of rimOptions) {
        rimOptionsShortDescArray.push(rim.short)
    }
    return rimOptionsShortDescArray
}

const getRimOptionsShortDescStringList = () => {
    return getArrayString(getRimOptionsShortDescArray())
}

const getKmhSpeedAtCadence = (rollOut, cadence) => {
    return (rollOut * cadence * 60) / 1000000
}

const getCadenceAtKmhSpeed = (rollOut, speed) => {
    return (1000000 * speed) / (60 * rollOut)
}

const getLapTime = (lapLength, speed) => {
    return lapLength / ((speed * 1000) / (60 * 60))
}

const getLapPedalCount = (lapLength, rollOut) => {
    return lapLength / (rollOut / 1000)
}

const getSpeedFromLapTimeAndLength = (lapTime, lapLength) => {
    return (lapLength * 60 * 60) / (lapTime * 1000)
}

const getGearInfo = (chainRing, cog, tyreWidth = 23, rimType = '700c', speed, cadence, 
    lapLength, lapTime, measure = 'metric', crankLength = 172.5) => {
    if (measure === 'imperial') {
        var origSpeed = undefined
        var origLapLength = undefined
        if (speed) {
            origSpeed = speed
            speed = speed * milesToKm
        }
        if (lapLength) {
            origLapLength = lapLength
            lapLength = lapLength * ydsToM
        }
    }
    const gearRatio = getGearRatio(chainRing, cog)
    const gearInches = getGearInches(gearRatio)
    let rimDiameter = getRimSizeByType(rimType)
    let wheelDiameter = getWheelDiameter(rimDiameter, tyreWidth)
    const trueGearInches = getTrueGearInches(gearRatio, wheelDiameter)
    let wheelCircumfrance = getWheelCircumfranceGivenDiameter(wheelDiameter)
    let rollOut = getRollOut(gearRatio, wheelCircumfrance)
    const radiusRatio = getRadiusRatio(crankLength, wheelDiameter)
    const gainRatio = getGainRatio(gearRatio, radiusRatio)
    let returnSpeed = speed
    let returnCadence = cadence
    let returnLapTime = lapTime
    let returnLapPedalCount = undefined

    if (speed) {
        returnCadence = getCadenceAtKmhSpeed(rollOut, speed)
    } else if (cadence) {
        returnSpeed = getKmhSpeedAtCadence(rollOut, cadence)
    } else if (lapTime && lapLength) {
        returnSpeed = getSpeedFromLapTimeAndLength(lapTime, lapLength)
        returnCadence = getCadenceAtKmhSpeed(rollOut, returnSpeed)
        returnLapPedalCount = getLapPedalCount(lapLength, rollOut)
    }

    if (lapLength && (speed || cadence)) {
        returnLapTime = getLapTime(lapLength, returnSpeed)
        returnLapPedalCount = getLapPedalCount(lapLength, rollOut)
    }

    if (measure === 'imperial') {
        rimDiameter = rimDiameter * mmToInches
        wheelDiameter = wheelDiameter * mmToInches
        wheelCircumfrance = wheelCircumfrance * mmToInches
        rollOut = rollOut * mmToInches
        if (returnSpeed) {
            if (origSpeed) {
                returnSpeed = origSpeed
            } else {
                returnSpeed = returnSpeed * kmToMiles
            }
        }
        if (lapLength) {
            if (origLapLength) {
                lapLength = origLapLength
            } else {
                lapLength = lapLength * mToYds
            }
        }
    }

    return {
        chainRing,
        cog,
        tyreWidth,
        rimType,
        rimDiameter,
        crankLength,
        gearRatio,
        gearInches,
        wheelDiameter,
        trueGearInches,
        wheelCircumfrance,
        rollOut,
        radiusRatio,
        gainRatio,
        speed: returnSpeed,
        cadence: returnCadence,
        lapLength,
        lapTime: returnLapTime,
        lapPedalCount: returnLapPedalCount,
        measure
    }
}

const getGearInfoForCassette = (chainRings = [], cogs = [], tyreWidth = 23, rimType = '700c', speed, cadence, 
lapLength, lapTime, measure = 'metric') => {
    const error = undefined
    // Sort chainRings descending
    chainRings.sort((a, b) => (a <= b) ? 1 : -1)
    // Sort cogs ascending
    cogs.sort((a, b) => (a >= b) ? 1 : -1)
    // Get gear info for each combination
    let gearInfoForCassette = []
    for (chainRing of chainRings) {
        for (cog of cogs) {
            const gearInfo = getGearInfo(chainRing, cog, tyreWidth, rimType, speed, cadence, 
                lapLength, lapTime, measure)
            gearInfoForCassette.push(gearInfo)
        }
    }
    const request = {
        chainRings,
        cogs,
        tyreWidth,
        rimType,
        speed,
        cadence,
        lapLength,
        lapTime,
        measure
    }
    const response = gearInfoForCassette
    return {
        error,
        request,
        response
    }
}

const getCogGivenChainRingAndGearInches = (chainRing, gearInches, fraction = 0.4) => {
    const decimalCog = (27 * chainRing) / gearInches
    const floorCog = Math.floor(decimalCog)
    const ceilingCog = Math.ceil(decimalCog)
    const floorFraction = decimalCog - floorCog
    if (floorFraction < fraction) {
        return [floorCog]
    } else if (floorFraction > (1 - fraction)) {
        return [ceilingCog]
    } else {
        return [floorCog, ceilingCog]
    }
}

const getChainRingAndCogOptionsForGearInches = (gearInches, plusOrMinus = 1, sortByDiff = true, 
    minChainRing = 34, maxChainRing = 60, minCog = 10, maxCog = 36, minTeeth = 44, maxTeeth = 96) => {
    let options = []
    var chainRing = minChainRing
    for (; chainRing <= maxChainRing; chainRing++) {
        const cogCandidates = getCogGivenChainRingAndGearInches(chainRing, gearInches)
        for (cog of cogCandidates) {
            const teeth = chainRing + cog
            if ((cog >= minCog) && (cog <= maxCog) && (teeth >= minTeeth) && (teeth <= maxTeeth)) {
                const candidateGearInches = getGearInches(getGearRatio(chainRing,cog))
                const diffGearInches = Math.abs(candidateGearInches - gearInches)
                if (diffGearInches <= plusOrMinus) {
                    options.push({
                        chainRing,
                        cog,
                        gearInches: candidateGearInches,
                        diff: diffGearInches
                    })
                }
            }
        }
    }
    if (sortByDiff === true) {
        options.sort((a, b) => (a.diff >= b.diff) ? 1 : -1)
    }
    return options
}

const getCogGivenChainRingAndTrueGearInches = (chainRing, wheelDiameter, trueGearInches, fraction = 0.4) => {
    const decimalCog = (wheelDiameter * mmToInches * chainRing) / trueGearInches
    const floorCog = Math.floor(decimalCog)
    const ceilingCog = Math.ceil(decimalCog)
    const floorFraction = decimalCog - floorCog
    if (floorFraction < fraction) {
        return [floorCog]
    } else if (floorFraction > (1 - fraction)) {
        return [ceilingCog]
    } else {
        return [floorCog, ceilingCog]
    }
}

const getChainRingAndCogOptionsForTrueGearInches = (trueGearInches, plusOrMinus = 1, sortByDiff = true, 
    tyreWidth = 23, rimType = '700c', minChainRing = 34, maxChainRing = 60, minCog = 10, maxCog = 36, minTeeth = 44, maxTeeth = 96) => {
    const rimDiameter = getRimSizeByType(rimType)
    const wheelDiameter = getWheelDiameter(rimDiameter, tyreWidth)
    let options = []
    var chainRing = minChainRing
    for (; chainRing <= maxChainRing; chainRing++) {
        const cogCandidates = getCogGivenChainRingAndTrueGearInches(chainRing, wheelDiameter, trueGearInches)
        for (cog of cogCandidates) {
            const teeth = chainRing + cog
            if ((cog >= minCog) && (cog <= maxCog) && (teeth >= minTeeth) && (teeth <= maxTeeth)) {
                const candidateTrueGearInches = getTrueGearInches(getGearRatio(chainRing,cog), wheelDiameter)
                const diffTrueGearInches = Math.abs(candidateTrueGearInches - trueGearInches)
                if (diffTrueGearInches <= plusOrMinus) {
                    options.push({
                        chainRing,
                        cog,
                        trueGearInches: candidateTrueGearInches,
                        diff: diffTrueGearInches
                    })
                }
            }
        }
    }
    if (sortByDiff === true) {
        options.sort((a, b) => (a.diff >= b.diff) ? 1 : -1)
    }
    return options
}

const getCogGivenChainRingAndGainRatio = (chainRing, radiusRatio, gainRatio, fraction = 0.4) => {
    const decimalCog = (radiusRatio * chainRing) / gainRatio
    const floorCog = Math.floor(decimalCog)
    const ceilingCog = Math.ceil(decimalCog)
    const floorFraction = decimalCog - floorCog
    if (floorFraction < fraction) {
        return [floorCog]
    } else if (floorFraction > (1 - fraction)) {
        return [ceilingCog]
    } else {
        return [floorCog, ceilingCog]
    }
}

const getChainRingAndCogOptionsForGainRatio = (gainRatio, plusOrMinus = 0.2, sortByDiff = true, 
    tyreWidth = 23, rimType = '700c', crankLength = 172.5, minChainRing = 34, maxChainRing = 60, minCog = 10, maxCog = 36, minTeeth = 44, maxTeeth = 96) => {
    const rimDiameter = getRimSizeByType(rimType)
    const wheelDiameter = getWheelDiameter(rimDiameter, tyreWidth)
    const radiusRatio = getRadiusRatio(crankLength, wheelDiameter)
    let options = []
    var chainRing = minChainRing
    for (; chainRing <= maxChainRing; chainRing++) {
        const cogCandidates = getCogGivenChainRingAndGainRatio(chainRing, radiusRatio, gainRatio)
        for (cog of cogCandidates) {
            const teeth = chainRing + cog
            if ((cog >= minCog) && (cog <= maxCog) && (teeth >= minTeeth) && (teeth <= maxTeeth)) {
                const candidateGainRatio = getGainRatio(getGearRatio(chainRing,cog), radiusRatio)
                const diffGainRatio = Math.abs(candidateGainRatio - gainRatio)
                if (diffGainRatio <= plusOrMinus) {
                    options.push({
                        chainRing,
                        cog,
                        gainRatio: candidateGainRatio,
                        diff: diffGainRatio
                    })
                }
            }
        }
    }
    if (sortByDiff === true) {
        options.sort((a, b) => (a.diff >= b.diff) ? 1 : -1)
    }
    return options
}

const getCogGivenChainRingAndGearRatio = (chainRing, gearRatio, fraction = 0.4) => {
    const decimalCog = chainRing / gearRatio
    const floorCog = Math.floor(decimalCog)
    const ceilingCog = Math.ceil(decimalCog)
    const floorFraction = decimalCog - floorCog
    if (floorFraction < fraction) {
        return [floorCog]
    } else if (floorFraction > (1 - fraction)) {
        return [ceilingCog]
    } else {
        return [floorCog, ceilingCog]
    }
}

const getChainRingAndCogOptionsForGearRatio = (gearRatio, plusOrMinus = 0.1, sortByDiff = true, 
    minChainRing = 34, maxChainRing = 60, minCog = 10, maxCog = 36, minTeeth = 44, maxTeeth = 96) => {
    let options = []
    var chainRing = minChainRing
    for (; chainRing <= maxChainRing; chainRing++) {
        const cogCandidates = getCogGivenChainRingAndGearRatio(chainRing, gearRatio)
        for (cog of cogCandidates) {
            const teeth = chainRing + cog
            if ((cog >= minCog) && (cog <= maxCog) && (teeth >= minTeeth) && (teeth <= maxTeeth)) {
                const candidateGearRatio = getGearRatio(chainRing,cog)
                const diffGearRatio = Math.abs(candidateGearRatio - gearRatio)
                if (diffGearRatio <= plusOrMinus) {
                    options.push({
                        chainRing,
                        cog,
                        gearRatio: candidateGearRatio,
                        diff: diffGearRatio
                    })
                }
            }
        }
    }
    if (sortByDiff === true) {
        options.sort((a, b) => (a.diff >= b.diff) ? 1 : -1)
    }
    return options
}

const getCogGivenChainRingAndWheelForRollOut = (chainRing, wheelCircumfrance, rollOut) => {
    const decimalCog = (chainRing * wheelCircumfrance) / rollOut
    const ceilingCog = Math.ceil(decimalCog)
    return ceilingCog
}

const getChainRingAndCogOptionsForRollOut = (rollOut, maxDiff = 500, sortDesc = true, calcInches = true, 
    tyreWidth = 23, rimType = '700c', minChainRing = 34, maxChainRing = 60, minCog = 10, maxCog = 36, 
    minTeeth = 44, maxTeeth = 96, measure = 'metric') => {
    if (measure === 'imperial') {
        rollOut = rollOut * inchesToMm
        if (maxDiff !== 500) {
            maxDiff = maxDiff * inchesToMm
        }
    }
    const rimDiameter = getRimSizeByType(rimType)
    const wheelCircumfrance = getWheelCircumfrance(rimDiameter, tyreWidth)
    let options = []
    var chainRing = minChainRing
    for (; chainRing <= maxChainRing; chainRing++) {
        const cog = getCogGivenChainRingAndWheelForRollOut(chainRing, wheelCircumfrance, rollOut)
        const teeth = chainRing + cog
        if ((cog >= minCog) && (cog <= maxCog) && (teeth >= minTeeth) && (teeth <= maxTeeth)) {
            const gearRatio = getGearRatio(chainRing, cog)
            let candidateRollOut = getRollOut(gearRatio, wheelCircumfrance)
            const diffRollOut = Math.abs(rollOut - candidateRollOut)
            if (diffRollOut <= maxDiff) {
                var gearInches = undefined
                if (calcInches === true) {
                    gearInches = getGearInches(gearRatio)
                }
                if (measure === 'imperial') {
                    candidateRollOut = candidateRollOut * mmToInches
                }
                options.push({
                    chainRing,
                    cog,
                    rollOut: candidateRollOut,
                    gearInches,
                    gearRatio,
                    measure
                })
            }
        }
    }
    if (sortDesc === true) {
        options.sort((a, b) => (a.rollOut <= b.rollOut) ? 1 : -1)
    }
    return options
}

const getCogGivenChainRingAndWheelForSpeedAndCadence = (chainRing, wheelCircumfrance, speed, cadence) => {
    const decimalCog = (chainRing * wheelCircumfrance * cadence * 60) / (speed * 1000000)
    return Math.round(decimalCog)
}

const getChainRingAndCogOptionsForSpeedAndCadence = (speed, cadence, fixed = 'cadence', plusOrMinus = 4,  
    tyreWidth = 23, rimType = '700c', minChainRing = 34, maxChainRing = 60, minCog = 10, maxCog = 36, 
    minTeeth = 44, maxTeeth = 96, measure = 'metric') => {
    let origSpeed = speed
    if (measure === 'imperial') {
        speed = speed * milesToKm
    }
    const rimDiameter = getRimSizeByType(rimType)
    const wheelCircumfrance = getWheelCircumfrance(rimDiameter, tyreWidth)
    let options = []
    var chainRing = minChainRing
    for (; chainRing <= maxChainRing; chainRing++) {
        const cog = getCogGivenChainRingAndWheelForSpeedAndCadence(chainRing, wheelCircumfrance, speed, cadence)
        const teeth = chainRing + cog
        if ((cog >= minCog) && (cog <= maxCog) && (teeth >= minTeeth) && (teeth <= maxTeeth)) {
            const gearRatio = getGearRatio(chainRing, cog)
            let rollOut = getRollOut(gearRatio, wheelCircumfrance)
            var candidateSpeed = speed
            var candidateCadence = cadence
            var includeOption = false
            if (fixed === 'speed') {
                candidateCadence = getCadenceAtKmhSpeed(rollOut, speed)
                includeOption = Boolean(Math.abs(candidateCadence - cadence) < plusOrMinus)
            } else { // 'cadence'
                candidateSpeed = getKmhSpeedAtCadence(rollOut, cadence)
                includeOption = Boolean(Math.abs(candidateSpeed - speed) < plusOrMinus)
            }
            if (includeOption === true) {
                const gearInches = getGearInches(gearRatio)
                if (measure === 'imperial') {
                    if (fixed === 'speed') {
                        candidateSpeed = origSpeed
                    } else {
                        candidateSpeed = candidateSpeed * kmToMiles
                    }
                    rollOut = rollOut * mmToInches
                }
                options.push({
                    chainRing,
                    cog,
                    speed: candidateSpeed,
                    cadence: candidateCadence,
                    rollOut,
                    gearInches,
                    gearRatio,
                    measure
                })
            }
        }
    }
    return options
}

const getChainRingAndCogOptionsForLapTimeAndCadence = (lapTime, lapLength, cadence, 
    tyreWidth = 23, rimType = '700c', minChainRing = 34, maxChainRing = 60, minCog = 10, maxCog = 36, 
    minTeeth = 44, maxTeeth = 96, measure = 'metric') => {
    let speed = getSpeedFromLapTimeAndLength(lapTime, lapLength)
    if (measure === 'imperial') {
        speed = speed * kmToMiles
    }
    var options = getChainRingAndCogOptionsForSpeedAndCadence(speed, cadence, 'speed', 4, tyreWidth, rimType, 
        minChainRing, maxChainRing, minCog, maxCog, minTeeth, maxTeeth, measure)
    for (option of options) {
        option.lapTime = lapTime
    }
    return options
}

const getArrayString = (array) => {
    var arrayString = ''
    for (element of array) {
        if (arrayString !== '') {
            arrayString = arrayString + ','
        }
        arrayString = arrayString + element
    }
    return arrayString
}

module.exports = {
    getGearRatio: getGearRatio,
    getWheelCircumfrance: getWheelCircumfrance,
    getGearInches: getGearInches,
    getRollOut: getRollOut,
    getRimSizeByType: getRimSizeByType,
    getGearInfo: getGearInfo,
    getChainRingAndCogOptionsForGearInches: getChainRingAndCogOptionsForGearInches,
    getChainRingAndCogOptionsForTrueGearInches: getChainRingAndCogOptionsForTrueGearInches,
    getChainRingAndCogOptionsForGearRatio: getChainRingAndCogOptionsForGearRatio,
    getChainRingAndCogOptionsForRollOut: getChainRingAndCogOptionsForRollOut,
    getChainRingAndCogOptionsForGainRatio: getChainRingAndCogOptionsForGainRatio,
    getChainRingAndCogOptionsForSpeedAndCadence: getChainRingAndCogOptionsForSpeedAndCadence,
    getChainRingAndCogOptionsForLapTimeAndCadence: getChainRingAndCogOptionsForLapTimeAndCadence,
    getGearInfoForCassette: getGearInfoForCassette,
    getRimOptionsTypeArray: getRimOptionsTypeArray,
    getRimOptionsTypeStringList: getRimOptionsTypeStringList,
    getRimOptionsDescArray: getRimOptionsDescArray,
    getRimOptionsDescStringList: getRimOptionsDescStringList,
    getRimOptionsShortDescStringList: getRimOptionsShortDescStringList
}