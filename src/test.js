const hpcUtils = require('./utils/hpc-utils')

const gears = require('./utils/gears.js')

const cassettes = require('./utils/cassettes.js')

// const test = gears.getGearInfo(54, 11, 25, '700c', 60, undefined, 250)

// const test = gears.getCogGivenChainRingAndGearInches(50, 119)

// const test = gears.getChainRingAndCogOptionsForGearInches(94,1,true)

// const test = gears.getChainRingAndCogOptionsForGearInches(94,0.5,49,56,15,16,50,70)

// const test = gears.getCogGivenChainRingAndWheelForRollOut(50, 2099, 7000)

// const test = gears.getChainRingAndCogOptionsForRollOut(7000, 100, true, 21, '700c', 47, 56, 12, 18)

// const test = gears.getGearInfo(50, 15)

// const test = hpcUtils.round(1.23456789,4)

// const test = gears.getCogGivenChainRingAndWheelForSpeedAndCadence(50, 2099, 40, 90)

// const test = gears.getChainRingAndCogOptionsForSpeedAndCadence(40, 90, 'cadence')

// const test = gears.getChainRingAndCogOptionsForLapTimeAndCadence(22, 250, 90)

// console.log(test)

// const fields = [
//     { name: 'chainRing', mandatory: true, type: 'integer', sign: 'positive' },
//     { name: 'cog', mandatory: true, type: 'integer', sign: 'positive' },
//     { name: 'rimType', default: '700c', type: 'string', options: ['700c', '650c'] },
//     { name: 'speed', type: 'decimal', sign: 'positive' },
//     { name: 'sortByDiff', default: 'true', type: 'boolean'},
//     { name: 'chainRings', type: 'list', subType: 'integer', sign: 'positive' },
//     { name: 'cogs', type: 'list', subType: 'integer', sign: 'positive' }
// ]

// const query = {
//     chainRing: '49',
//     cog: '15',
//     rimType: '700c',
//     speed: '50',
//     sortByDiff: 'true',
//     chainRings: '50,34',
//     cogs: '11,12,13,14,15,17,19,22,25,28'
// }

// // console.log(hpcUtils.validateQueryString(query , fields))

// const {chainRings, cogs} = hpcUtils.validateQueryString(query , fields)

// console.log(gears.getGearInfoForCassette(chainRings, cogs))

// const test = hpcUtils.convertListToArray('a b c')

const test = cassettes.getCassettesBySpeed(10)

console.log(test)
console.log(cassettes.getCogsString(test[1].cogs))
