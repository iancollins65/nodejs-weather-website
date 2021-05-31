const getGearRatio = (chainRing, cog) => {
    return chainRing / cog
}

const getGearInches = (gearRatio) => {
    return gearRatio * 27
}

const getWheelCircumfrance = (rimDiameter, tyreWidth) => {
    return (rimDiameter + (2 * tyreWidth)) * Math.PI
}

const getRollOut = (gearRatio, wheelCircumfrance) => {
    return gearRatio * wheelCircumfrance
}

const rimOptions = [
    {
        type: '700c',
        size: 622,
        description: '700c_(622mm)'
    },
    {
        type: '650c',
        size: 571,
        description: '650c_(571mm)'
    },
    {
        type: '650b',
        size: 584,
        description: '650b_(584mm)'
    },
    {
        type: '29er',
        size: 622,
        description: '29er_(622mm)'
    },
    {
        type: '27.5',
        size: 584,
        description: '27.5_(584mm)'
    },
    {
        type: '28inch',
        size: 635,
        description: '28inch_(635mm)'
    },
    {
        type: '27inch',
        size: 630,
        description: '27inch_(630mm)'
    },
    {
        type: '26inch_mtb',
        size: 559,
        description: '26inch_mtb_(559mm)'
    },
    {
        type: '24inch_S5',
        size: 547,
        description: '24inch_S5_(547mm)'
    },
    {
        type: '24inch_E6',
        size: 540,
        description: '24inch_E6_(540mm)'
    },
    {
        type: '24inch_Terry',
        size: 520,
        description: '24inch_Terry_(520mm)'
    },
    {
        type: '24inch_mtb',
        size: 507,
        description: '24inch_mtb_(507mm)'
    },
    {
        type: '24inch_bmx',
        size: 507,
        description: '24inch_bmx_(507mm)'
    },
    {
        type: '20inch_recumb',
        size: 451,
        description: '20inch_recumb_(451mm)'
    },
    {
        type: '20inch_Schwinn',
        size: 419,
        description: '20inch_Schwinn_(419mm)'
    },
    {
        type: '20inch_bmx',
        size: 406,
        description: '20inch_bmx_(406mm)'
    },
    {
        type: '20inch_recumb',
        size: 406,
        description: '20inch_recumb_(406mm)'
    },
    {
        type: '17inch',
        size: 369,
        description: '17inch_(369mm)'
    },
    {
        type: '16inch_Brompton',
        size: 349,
        description: '16inch_Brompton_(349mm)'
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
    lapLength, lapTime) => {
    const gearRatio = getGearRatio(chainRing, cog)
    const gearInches = getGearInches(gearRatio)
    const rimDiameter = getRimSizeByType(rimType)
    const wheelCircumfrance = getWheelCircumfrance(rimDiameter, tyreWidth)
    const rollOut = getRollOut(gearRatio, wheelCircumfrance)
    var returnSpeed = speed
    var returnCadence = cadence
    var returnLapTime = lapTime
    var returnLapPedalCount = undefined

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

    return {
        chainRing,
        cog,
        tyreWidth,
        rimType,
        rimDiameter,
        gearRatio,
        gearInches,
        wheelCircumfrance,
        rollOut,
        speed: returnSpeed,
        cadence: returnCadence,
        lapLength,
        lapTime: returnLapTime,
        lapPedalCount: returnLapPedalCount
    }
}

const getGearInfoForCassette = (chainRings = [], cogs = [], tyreWidth = 23, rimType = '700c', speed, cadence, 
lapLength, lapTime) => {
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
                lapLength, lapTime)
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
        lapTime
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
    minTeeth = 44, maxTeeth = 96) => {
    const rimDiameter = getRimSizeByType(rimType)
    const wheelCircumfrance = getWheelCircumfrance(rimDiameter, tyreWidth)
    let options = []
    var chainRing = minChainRing
    for (; chainRing <= maxChainRing; chainRing++) {
        const cog = getCogGivenChainRingAndWheelForRollOut(chainRing, wheelCircumfrance, rollOut)
        const teeth = chainRing + cog
        if ((cog >= minCog) && (cog <= maxCog) && (teeth >= minTeeth) && (teeth <= maxTeeth)) {
            const gearRatio = getGearRatio(chainRing, cog)
            const candidateRollOut = getRollOut(gearRatio, wheelCircumfrance)
            const diffRollOut = Math.abs(rollOut - candidateRollOut)
            if (diffRollOut <= maxDiff) {
                var gearInches = undefined
                if (calcInches === true) {
                    gearInches = getGearInches(gearRatio)
                }
                options.push({
                    chainRing,
                    cog,
                    rollOut: candidateRollOut,
                    gearInches,
                    gearRatio
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
    minTeeth = 44, maxTeeth = 96) => {
    const rimDiameter = getRimSizeByType(rimType)
    const wheelCircumfrance = getWheelCircumfrance(rimDiameter, tyreWidth)
    let options = []
    var chainRing = minChainRing
    for (; chainRing <= maxChainRing; chainRing++) {
        const cog = getCogGivenChainRingAndWheelForSpeedAndCadence(chainRing, wheelCircumfrance, speed, cadence)
        const teeth = chainRing + cog
        if ((cog >= minCog) && (cog <= maxCog) && (teeth >= minTeeth) && (teeth <= maxTeeth)) {
            const gearRatio = getGearRatio(chainRing, cog)
            const rollOut = getRollOut(gearRatio, wheelCircumfrance)
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
                options.push({
                    chainRing,
                    cog,
                    speed: candidateSpeed,
                    cadence: candidateCadence,
                    rollOut,
                    gearInches,
                    gearRatio
                })
            }
        }
    }
    return options
}

const getChainRingAndCogOptionsForLapTimeAndCadence = (lapTime, lapLength, cadence, 
    tyreWidth = 23, rimType = '700c', minChainRing = 34, maxChainRing = 60, minCog = 10, maxCog = 36, 
    minTeeth = 44, maxTeeth = 96) => {
    const speed = getSpeedFromLapTimeAndLength(lapTime, lapLength)
    var options = getChainRingAndCogOptionsForSpeedAndCadence(speed, cadence, 'speed', 4, tyreWidth, rimType, 
        minChainRing, maxChainRing, minCog, maxCog, minTeeth, maxTeeth)
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
    getCogGivenChainRingAndGearInches: getCogGivenChainRingAndGearInches,
    getChainRingAndCogOptionsForGearInches: getChainRingAndCogOptionsForGearInches,
    getChainRingAndCogOptionsForGearRatio: getChainRingAndCogOptionsForGearRatio,
    getCogGivenChainRingAndWheelForRollOut: getCogGivenChainRingAndWheelForRollOut,
    getChainRingAndCogOptionsForRollOut: getChainRingAndCogOptionsForRollOut,
    getCogGivenChainRingAndWheelForSpeedAndCadence: getCogGivenChainRingAndWheelForSpeedAndCadence,
    getChainRingAndCogOptionsForSpeedAndCadence: getChainRingAndCogOptionsForSpeedAndCadence,
    getChainRingAndCogOptionsForLapTimeAndCadence: getChainRingAndCogOptionsForLapTimeAndCadence,
    getGearInfoForCassette: getGearInfoForCassette,
    getRimOptionsTypeArray: getRimOptionsTypeArray,
    getRimOptionsTypeStringList: getRimOptionsTypeStringList,
    getRimOptionsDescArray: getRimOptionsDescArray,
    getRimOptionsDescStringList: getRimOptionsDescStringList
}