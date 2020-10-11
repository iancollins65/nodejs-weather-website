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

const getGearInfo = (chainRing, cog, tyreWidth = 23, rimType = '700c', speed, cadence, lapLength) => {
    const gearRatio = getGearRatio(chainRing, cog)
    const gearInches = getGearInches(gearRatio)
    const rimDiameter = getRimSizeByType(rimType)
    const wheelCircumfrance = getWheelCircumfrance(rimDiameter, tyreWidth)
    const rollOut = getRollOut(gearRatio, wheelCircumfrance)
    var returnSpeed = speed
    var returnCadence = cadence
    var returnLapTime = undefined
    var returnLapPedalCount = undefined

    if (speed) {
        returnCadence = getCadenceAtKmhSpeed(rollOut, speed)
    }

    if (cadence && !speed) {
        returnSpeed = getKmhSpeedAtCadence(rollOut, cadence)
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

module.exports = {
    getGearRatio: getGearRatio,
    getWheelCircumfrance: getWheelCircumfrance,
    getGearInches: getGearInches,
    getRollOut: getRollOut,
    getRimSizeByType: getRimSizeByType,
    getGearInfo: getGearInfo
}