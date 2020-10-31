const round = (value, places) => {
    const rounder = Math.pow(10, places)
    return Math.round(value * rounder) / rounder
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

    for (field of fields) {
        let fieldValue = field.default

        if (field.mandatory === true) {
            if (!query[field.name]) {
                return { error: field.name + ' is not provided' }
            }
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
        }
    }

    return {
        error,
        chainRing,
        cog,
        tyreWidth,
        rimType,
        speed,
        cadence,
        lapLength,
        lapTime,
        gearInches, 
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
        extras
    }
}

module.exports = {
    round: round,
    validateQueryString: validateQueryString
}