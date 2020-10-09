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

const getGearInfo = (chainRing, cog, tyreWidth = 23, rimType = '700c') => {
    const gearRatio = getGearRatio(chainRing, cog)
    const gearInches = getGearInches(gearRatio)
    const rimDiameter = getRimSizeByType(rimType)
    const wheelCircumfrance = getWheelCircumfrance(rimDiameter, tyreWidth)
    const rollOut = getRollOut(gearRatio, wheelCircumfrance)
    return {
        chainRing,
        cog,
        tyreWidth,
        rimType,
        rimDiameter,
        gearRatio,
        gearInches,
        wheelCircumfrance,
        rollOut
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