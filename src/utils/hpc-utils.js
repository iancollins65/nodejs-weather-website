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
    let rimType = undefined
    let sortByDiff = undefined

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
                fieldValue = query[field.name]
                if (fieldValue !== 'true' && fieldValue !== 'false') {
                    return { error: field.name + ' is not true or false' }
                }
                fieldValue = (fieldValue === 'true')
            
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
        }

        switch (field.name) {
            case 'chainRing': chainRing = fieldValue; break;
            case 'cog': cog = fieldValue; break;
            case 'rimType': rimType = fieldValue; break; 
            case 'sortByDiff': sortByDiff = fieldValue; break;
        }
    }

    return {
        error,
        chainRing,
        cog,
        rimType,
        sortByDiff
    }
}

const validateQueryString1 = (query, fields) => {
    if (!query) { 
        return { error: 'No query string found' }
    }

    let error = undefined
    let chainRing = undefined
    let cog = undefined
    let rimType = undefined

    for (field of fields) {
        switch (field.name) {

            case 'chainRing':
                chainRing = field.default
                if (field.mandatory === true) {
                    if (!query.chainRing) {
                        return { error: 'chainRing is not provided' }
                    }
                }
                if (query.chainRing) {
                    chainRing = Number(query.chainRing)
                    if (isNaN(chainRing)) {
                        return { error: 'chainRing is not numeric' }
                    }
                    if (!Number.isInteger(chainRing) || !(chainRing > 0)) {
                        return { error: 'chainRing is not a positive integer' }
                    }
                }           
                break;

            case 'cog':
                cog = field.default
                if (field.mandatory === true) {
                    if (!query.cog) {
                        return { error: 'cog is not provided' }
                    }
                }
                if (query.cog) {
                    cog = Number(query.cog)
                    if (isNaN(cog)) {
                        return { error: 'cog is not numeric' }
                    }
                    if (!Number.isInteger(cog) || !(cog > 0)) {
                        return { error: 'cog is not a positive integer' }
                    }
                }           
                break;
    
            case 'rimType':
                rimType = field.default
                if (field.mandatory === true) {
                    if (!query.rimType) {
                        return { error: 'rimType is not provided' }
                    }
                }
                if (query.rimType) {
                    rimType = query.rimType
                    if (!(rimType === '700c') && !(rimType === '650c')) {
                        return { error: 'rimType must be 700c or 650c' }
                    }
                }           
                break;
        }
    }

    return {
        error,
        chainRing,
        cog,
        rimType
    }
}

module.exports = {
    round: round,
    validateQueryString1: validateQueryString1,
    validateQueryString: validateQueryString
}