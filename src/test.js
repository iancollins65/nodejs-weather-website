const hpcUtils = require('./utils/hpc-utils')

const gears = require('./utils/gears.js')

const cassettes = require('./utils/cassettes.js')

const schedules = require('./utils/schedules.js')

// const test = gears.getWheelCircumfrance(622, 23)

// const test = gears.getGearInfo(54, 11, 25, '700c', 60, undefined, 250, undefined, "metric", 162.5)

// const test = gears.getGearInfo(54, 11, 25, '700c', 36, undefined, 250, undefined, "imperial", 162.5)

// const test = gears.getGearInfo(54, 11, 25, '700c', 60, undefined, 250, undefined, "metric", 162.5, "measured", 2111.150)

const test = gears.getGearInfo(54, 11, 25, '700c', 36, undefined, 250, undefined, "imperial", 162.5, "measured", 83.1)

// const test = gears.getCogGivenChainRingAndGearInches(50, 119)

// const test = gears.getChainRingAndCogOptionsForGearInches(94,1,true)

// const test2 = gears.getChainRingAndCogOptionsForTrueGearInches(94,1,true,32)

// const test = gears.getChainRingAndCogOptionsForGearInches(94,0.5,49,56,15,16,50,70)

// const test = gears.getChainRingAndCogOptionsForGearRatio(3.1)

// const test = gears.getChainRingAndCogOptionsForGainRatio(5.6)

// const test = gears.getChainRingAndCogOptionsForGainRatio(5.6,0.1,true,28,'700c',172.5)

// const test = gears.getRimOptionsTypeStringList()

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

//const test = cassettes.getCassettesBySpeed(10)

// const test = cassettes.getCassetteSpeedOptionsString()

// const test = schedules.defaultScheduleParams

// const scheduleParams_tempo = {
//     label: "",
//     scheduleType: schedules.scheduleType.distance,
//     scheduleBy: schedules.scheduleBy.tempo,
//     lapDistance: 250.0,
//     distanceLaps: 4.0,
//     timeSeconds: 0.0,
//     tempoTarget: 15.0,
//     startType: schedules.startType.standing,
//     upToSpeedTime: 4.0,
//     timingsAt: schedules.timingsAt.both,
//     speedTempo: 0.0,
//     cadenceTempo: 0.0
// }

// const scheduleParams_time = {
//     label: "",
//     scheduleType: schedules.scheduleType.distance,
//     scheduleBy: schedules.scheduleBy.time,
//     lapDistance: 250.0,
//     distanceLaps: 4.0,
//     timeSeconds: 68.0,
//     tempoTarget: 0.0,
//     startType: schedules.startType.standing,
//     upToSpeedTime: 4.0,
//     timingsAt: schedules.timingsAt.fullLap,
//     speedTempo: 0.0,
//     cadenceTempo: 0.0
// }

// const scheduleParams_speed = {
//     label: "",
//     scheduleType: schedules.scheduleType.distance,
//     scheduleBy: schedules.scheduleBy.speed,
//     lapDistance: 250.0,
//     distanceLaps: 0.0,
//     timeSeconds: 0.0,
//     tempoTarget: 0.0,
//     startType: schedules.startType.standing,
//     upToSpeedTime: 4.0,
//     timingsAt: schedules.timingsAt.fullLap,
//     speedTempo: 60.0,
//     cadenceTempo: 0.0
// }

// const scheduleParams_cadence = {
//     label: "",
//     scheduleType: schedules.scheduleType.distance,
//     scheduleBy: schedules.scheduleBy.cadence,
//     lapDistance: 250.0,
//     distanceLaps: 0.0,
//     timeSeconds: 0.0,
//     tempoTarget: 0.0,
//     startType: schedules.startType.standing,
//     upToSpeedTime: 4.0,
//     timingsAt: schedules.timingsAt.fullLap,
//     speedTempo: 0.0,
//     cadenceTempo: 100.0,
//     gear: {
//         rollOut: 7000
//     }
// }

// const scheduleParams_tempo_time = {
//     label: "",
//     scheduleType: schedules.scheduleType.time,
//     scheduleBy: schedules.scheduleBy.tempo,
//     lapDistance: 250.0,
//     distanceLaps: 0.0,
//     timeSeconds: 60.0,
//     tempoTarget: 15.0,
//     startType: schedules.startType.standing,
//     upToSpeedTime: 4.0,
//     timingsAt: schedules.timingsAt.fullLap,
//     speedTempo: 0.0,
//     cadenceTempo: 0.0
// }

// const scheduleParams_distance_time = {
//     label: "",
//     scheduleType: schedules.scheduleType.time,
//     scheduleBy: schedules.scheduleBy.distance,
//     lapDistance: 250.0,
//     distanceLaps: 4.0,
//     timeSeconds: 60.0,
//     tempoTarget: 0.0,
//     startType: schedules.startType.standing,
//     upToSpeedTime: 4.0,
//     timingsAt: schedules.timingsAt.fullLap,
//     speedTempo: 0.0,
//     cadenceTempo: 0.0
// }

// const scheduleParams_speed_time = {
//     label: "",
//     scheduleType: schedules.scheduleType.time,
//     scheduleBy: schedules.scheduleBy.speed,
//     lapDistance: 250.0,
//     distanceLaps: 0.0,
//     timeSeconds: 60.0,
//     tempoTarget: 0.0,
//     startType: schedules.startType.standing,
//     upToSpeedTime: 4.0,
//     timingsAt: schedules.timingsAt.fullLap,
//     speedTempo: 55.0,
//     cadenceTempo: 0.0
// }

// const scheduleParams_cadence_time = {
//     label: "",
//     scheduleType: schedules.scheduleType.time,
//     scheduleBy: schedules.scheduleBy.cadence,
//     lapDistance: 250.0,
//     distanceLaps: 0.0,
//     timeSeconds: 60.0,
//     tempoTarget: 0.0,
//     startType: schedules.startType.standing,
//     upToSpeedTime: 4.0,
//     timingsAt: schedules.timingsAt.fullLap,
//     speedTempo: 0.0,
//     cadenceTempo: 100.0,
//     gear: {
//         rollOut: 7000
//     }
// }

// const test = schedules.calcDistanceSchedule(scheduleParams_tempo)

// const test = schedules.calcDistanceSchedule(scheduleParams_time)

// const test = schedules.calcDistanceSchedule(scheduleParams_speed)

// const test = schedules.calcDistanceSchedule(scheduleParams_cadence)

// const test = schedules.getNextLapCountForDistanceSchedule(2.0, scheduleParams_tempo)

// const test = schedules.calcTimeSchedule(scheduleParams_tempo_time)

// const test = schedules.calcTimeSchedule(scheduleParams_distance_time)

// const test = schedules.calcTimeSchedule(scheduleParams_speed_time)

// const test = schedules.calcTimeSchedule(scheduleParams_cadence_time)

// const scheduleParams = {
//     label: "",
//     scheduleType: schedules.scheduleType.time.code,
//     scheduleBy: schedules.scheduleBy.distance.code,
//     lapDistance: 250.0,
//     distanceLaps: 4.0,
//     timeSeconds: 60.0,
//     tempoTarget: 15.0,
//     startType: schedules.startType.standing.code,
//     upToSpeedTime: 4.0,
//     timingsAt: schedules.timingsAt.fullLap.code,
//     speedTempo: 50.0,
//     cadenceTempo: 100.0,
//     gear: {
//         rollOut: 7000
//     }
// }

// const scheduleParams1 = {
//     label: "",
//     scheduleType: schedules.scheduleType.distance.code,
//     scheduleBy: schedules.scheduleBy.speed.code,
//     lapDistance: 250.0,
//     distanceLaps: 4.0,
//     timeSeconds: 60.0,
//     tempoTarget: 15.0,
//     startType: schedules.startType.standing.code,
//     upToSpeedTime: 4.0,
//     timingsAt: schedules.timingsAt.fullLap.code,
//     speedTempo: 50.0,
//     cadenceTempo: 100.0,
//     gear: {
//         chainRing: 54,
//         cog: 14,
//         tyreWidth: 20,
//         rimType: '700c'
//     },
//     measure: 'imperial'
// }

// // const test = schedules.canCalculate(scheduleParams)

// const test = schedules.calcSchedule(scheduleParams1)

// // const test = schedules.convertHMMSStimeToSeconds('60:59:59')

// const test = schedules.cloneObject(scheduleParams1)

// test.lapDistance = 285

// console.log(scheduleParams1)

// const test = hpcUtils.roundUp(8.1236789, 3)

console.log(test)

// console.log(test2)
// test commit 7
