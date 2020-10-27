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
        description: '700c (622mm)'
    },
    {
        type: '650c',
        size: 571,
        description: '650c (571mm)'
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
                    gearInches
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

const getChainRingAndCogOptionsForSpeedAndCadence = (speed, cadence, fixed = 'cadence', plusOrMinus = 2,  
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
                    gearInches
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

module.exports = {
    getGearRatio: getGearRatio,
    getWheelCircumfrance: getWheelCircumfrance,
    getGearInches: getGearInches,
    getRollOut: getRollOut,
    getRimSizeByType: getRimSizeByType,
    getGearInfo: getGearInfo,
    getCogGivenChainRingAndGearInches: getCogGivenChainRingAndGearInches,
    getChainRingAndCogOptionsForGearInches: getChainRingAndCogOptionsForGearInches,
    getCogGivenChainRingAndWheelForRollOut: getCogGivenChainRingAndWheelForRollOut,
    getChainRingAndCogOptionsForRollOut: getChainRingAndCogOptionsForRollOut,
    getCogGivenChainRingAndWheelForSpeedAndCadence: getCogGivenChainRingAndWheelForSpeedAndCadence,
    getChainRingAndCogOptionsForSpeedAndCadence: getChainRingAndCogOptionsForSpeedAndCadence,
    getChainRingAndCogOptionsForLapTimeAndCadence: getChainRingAndCogOptionsForLapTimeAndCadence
}