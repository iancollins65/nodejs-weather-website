const gears = require('./utils/gears.js')

// const test = gears.getGearInfo(54, 11, 25, '700c', 60, undefined, 250)

// const test = gears.getCogGivenChainRingAndGearInches(50, 119)

// const test = gears.getChainRingAndCogOptionsForGearInches(94,1,true)

// const test = gears.getChainRingAndCogOptionsForGearInches(94,0.5,49,56,15,16,50,70)

// const test = gears.getCogGivenChainRingAndWheelForRollOut(50, 2099, 7000)

const test = gears.getChainRingAndCogOptionsForRollOut(7000, 100, true, 21, '700c', 47, 56, 12, 18)

// const test = gears.getGearInfo(50, 15)

console.log(test)

