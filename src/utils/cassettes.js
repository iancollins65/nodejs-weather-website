const cassettes = [
    {
        speed: 1,
        cogs: [14]
    },
    {
        speed: 7,
        cogs: [11,13,15,18,21,24,28]
    },
    {
        speed: 8,
        cogs: [11,13,15,17,19,21,24,28]
    },
    {
        speed: 8,
        cogs: [12,13,15,17,19,21,23,25]
    },
    {
        speed: 9,
        cogs: [11,12,14,16,18,20,23,26,30]
    },
    {
        speed: 9,
        cogs: [14,15,16,17,18,19,21,23,25]
    },
    {
        speed: 10,
        cogs: [11,12,13,14,15,17,19,21,23,25]
    },
    {
        speed: 10,
        name: 'Testing 10 speed',
        cogs: [11,12,13,14,15,17,19,21,24,28]
    },
    {
        speed: 10,
        cogs: [12,13,14,15,17,19,21,24,27,30]
    },
    {
        speed: 11,
        cogs: [11,12,13,14,15,16,17,19,21,23,25]
    },
    {
        speed: 11,
        cogs: [11,12,13,14,15,17,19,21,23,25,28]
    },
    {
        speed: 11,
        cogs: [11,12,13,14,15,17,19,21,24,27,30]
    }    
]

const getCassetteSpeedOptions = (min = 1, max = 12) => {
    var options = []
    for (let i = min; i <= max; i++) {
        const cassette = cassettes.find((c) => c.speed === i)
        if (cassette) {
            options.push(i)
        }
    }
    return options
}

const getCassettesBySpeed = (speed = 11, deriveName = true) => {
    const cassetteOptions = cassettes.filter((c) => c.speed === speed)
    if (deriveName === true) {
        for (cassette of cassetteOptions) {
            const cogs = cassette.cogs
            if (!cassette.name) {
                var name = ''
                if (cogs.length === 1) {
                    name = cogs[0] + 'T'
                } else if (cogs.length > 1) {
                    name = cogs[0] + '-' + cogs[cogs.length - 1] + 'T'
                }
                if (name !== '') {
                    cassette.name = name
                }
            }
        }
    }
    return cassetteOptions
}

const getCogsString = (cogsArray) => {
    var cogsString = ''
    for (cog of cogsArray) {
        if (cogsString !== '') {
            cogsString = cogsString + ','
        }
        cogsString = cogsString + cog
    }
    return cogsString
}

module.exports = {
    getCassetteSpeedOptions: getCassetteSpeedOptions,
    getCassettesBySpeed: getCassettesBySpeed,
    getCogsString: getCogsString
}
