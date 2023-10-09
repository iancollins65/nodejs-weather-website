const round = (value, places) => {
    const rounder = Math.pow(10, places)
    return Math.round(value * rounder) / rounder
}

const floor = (value, places) => {
    const rounder = Math.pow(10, places)
    return Math.floor(value * rounder) / rounder
}

const roundUp = (value, places) => {
    const floorValue = floor(value, places)
    const increment = Math.pow(10, -1 * places)
    return round(floorValue + increment, places)
}

const validateQueryString = (query, fields) => {
    if (!query) { 
        return { error: 'No query string found' }
    }

    let error = undefined
    let chainRing = undefined
    let cog = undefined
    let tyreWidth = undefined
    let rimType = undefined
    let speed = undefined
    let cadence = undefined
    let lapLength = undefined
    let lapTime = undefined
    let gearInches = undefined
    let trueGearInches = undefined
    let gainRatio = undefined
    let gearRatio = undefined
    let plusOrMinus = undefined
    let sortByDiff = undefined
    let rollOut = undefined
    let maxDiff = undefined
    let sortDesc = undefined
    let calcInches = undefined
    let minChainRing = undefined
    let maxChainRing = undefined
    let minCog = undefined
    let maxCog = undefined
    let minTeeth = undefined
    let maxTeeth = undefined
    let findFor = undefined
    let showMinMax = undefined
    let fixed = undefined
    let extras = undefined
    let chainRings = undefined
    let cogs = undefined
    let chainRing1 = undefined
    let chainRing2 = undefined
    let cog1 = undefined
    let cog2 = undefined
    let measure = undefined
    let crankLength = undefined
    let tyreWidth1 = undefined
    let tyreWidth2 = undefined
    let rimType1 = undefined
    let rimType2 = undefined
    let crankLength1 = undefined
    let crankLength2 = undefined
    let circumfranceApproach = undefined
    let measuredCircumfrance = undefined

    for (field of fields) {
        let fieldValue = field.default

        if (field.mandatory === true) {
            if (!query[field.name]) {
                return { error: field.name + ' is not provided' }
            }
        } else if (field.mandatoryIfField && query[field.mandatoryIfField] && field.mandatoryIfValue) {
            if (query[field.mandatoryIfField] === field.mandatoryIfValue && !query[field.name])
                return { error: field.name + ' is not provided' }
        }

        if (query[field.name]) {
            if (field.type === 'integer' || field.type === 'decimal') {
                fieldValue = Number(query[field.name])
                if (isNaN(fieldValue)) {
                    return { error: field.name + ' is not numeric' }
                }
                if (field.type === 'integer') {
                    if (!Number.isInteger(fieldValue)) {
                        return { error: field.name + ' is not an integer' }
                    }
                }
                if (field.sign === 'positive') {
                    if (!(fieldValue > 0)) {
                        return { error: field.name + ' is not a positive number' }
                    }
                }
            
            } else if (field.type === 'boolean') {
                let fieldValueStr = query[field.name]
                if (fieldValueStr !== 'true' && fieldValueStr !== 'false') {
                    return { error: field.name + ' is not true or false' }
                }
                fieldValue = Boolean(fieldValueStr === 'true')
            
            } else if (field.type === 'string') {
                fieldValue = query[field.name]
                if (field.options) {
                    const fieldOption = field.options.find((option) => option === fieldValue)
                    if (!fieldOption) {
                        let optionsStr = field.options[0]
                        for (let i = 1; i < field.options.length; i++) {
                            optionsStr = optionsStr + ' or ' + field.options[i]
                        }
                        return { error: field.name + ' is not ' +  optionsStr }
                    }
                }

            } else if (field.type === 'list') {
                const listValue = query[field.name]
                const arrayValue = convertListToArray(listValue)
                fieldValue = []
                for (item of arrayValue) {
                    if (field.subType === 'integer' || field.subType === 'decimal') {
                        itemValue = Number(item)
                        if (isNaN(itemValue)) {
                            return { error: field.name + ' list contains a non-numeric value' }
                        }
                        if (field.subType === 'integer') {
                            if (!Number.isInteger(itemValue)) {
                                return { error: field.name + ' list contains a non-integer' }
                            }
                        }
                        if (field.sign === 'positive') {
                            if (!(itemValue > 0)) {
                                return { error: field.name + ' list contains a non-positive number' }
                            }
                        }
                        fieldValue.push(itemValue)
                    } else {
                        fieldValue.push(item)
                    }
                }
            }
        } else if (fieldValue === undefined && field.returnEmpty === true) {
            fieldValue = ''
        }

        switch (field.name) {
            case 'chainRing': chainRing = fieldValue; break;
            case 'cog': cog = fieldValue; break;
            case 'tyreWidth': tyreWidth = fieldValue; break;
            case 'rimType': rimType = fieldValue; break; 
            case 'speed': speed = fieldValue; break; 
            case 'cadence': cadence = fieldValue; break; 
            case 'lapLength': lapLength = fieldValue; break; 
            case 'lapTime': lapTime = fieldValue; break; 
            case 'gearInches': gearInches = fieldValue; break; 
            case 'trueGearInches': trueGearInches = fieldValue; break; 
            case 'gearRatio': gearRatio = fieldValue; break; 
            case 'gainRatio': gainRatio = fieldValue; break; 
            case 'plusOrMinus': plusOrMinus = fieldValue; break; 
            case 'sortByDiff': sortByDiff = fieldValue; break;
            case 'rollOut': rollOut = fieldValue; break;
            case 'maxDiff': maxDiff = fieldValue; break;
            case 'sortDesc': sortDesc = fieldValue; break;
            case 'calcInches': calcInches = fieldValue; break;
            case 'minChainRing': minChainRing = fieldValue; break; 
            case 'maxChainRing': maxChainRing = fieldValue; break; 
            case 'minCog': minCog = fieldValue; break; 
            case 'maxCog': maxCog = fieldValue; break; 
            case 'minTeeth': minTeeth = fieldValue; break; 
            case 'maxTeeth': maxTeeth = fieldValue; break; 
            case 'findFor': findFor = fieldValue; break; 
            case 'showMinMax': showMinMax = fieldValue; break; 
            case 'fixed': fixed = fieldValue; break;
            case 'extras': extras = fieldValue; break;
            case 'chainRings': chainRings = fieldValue; break;
            case 'cogs': cogs = fieldValue; break;
            case 'chainRing1': chainRing1 = fieldValue; break;
            case 'chainRing2': chainRing2 = fieldValue; break;
            case 'cog1': cog1 = fieldValue; break;
            case 'cog2': cog2 = fieldValue; break;
            case 'measure': measure = fieldValue; break;
            case 'crankLength': crankLength = fieldValue; break;
            case 'tyreWidth1': tyreWidth1 = fieldValue; break;
            case 'tyreWidth2': tyreWidth2 = fieldValue; break;
            case 'rimType1': rimType1 = fieldValue; break; 
            case 'rimType2': rimType2 = fieldValue; break; 
            case 'crankLength1': crankLength1 = fieldValue; break;
            case 'crankLength2': crankLength2 = fieldValue; break;
            case 'circumfranceApproach': circumfranceApproach = fieldValue; break;
            case 'measuredCircumfrance': measuredCircumfrance = fieldValue; break;
        }
    }

    return {
        error,
        chainRing,
        cog,
        tyreWidth,
        rimType,
        crankLength,
        speed,
        cadence,
        lapLength,
        lapTime,
        gearInches,
        trueGearInches,
        gearRatio,
        gainRatio,
        plusOrMinus, 
        sortByDiff,
        rollOut, 
        maxDiff, 
        sortDesc, 
        calcInches,
        minChainRing, 
        maxChainRing, 
        minCog, 
        maxCog, 
        minTeeth, 
        maxTeeth,
        findFor,
        showMinMax,
        fixed,
        extras,
        chainRings,
        cogs,
        chainRing1,
        chainRing2,
        cog1,
        cog2,
        measure,
        tyreWidth1,
        tyreWidth2,
        rimType1,
        rimType2,
        crankLength1,
        crankLength2,
        circumfranceApproach,
        measuredCircumfrance
    }
}

const convertListToArray = (list, separator) => {
    if (!separator) {
        if (list.includes(',')) {
            separator = ','
        } else if (list.includes(' ')) {
            separator = ' '
        } else if (list.includes('-')) {
            separator = '-'
        } else if (list.includes(';')) {
            separator = ';'
        }
    }
    return list.split(separator)
}

module.exports = {
    round: round,
    roundUp: roundUp,
    validateQueryString: validateQueryString,
    convertListToArray: convertListToArray
}