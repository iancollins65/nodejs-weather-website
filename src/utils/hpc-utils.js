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
    validateQueryString: validateQueryString
}