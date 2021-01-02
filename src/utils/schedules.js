const scheduleType = {
    distance: { name: "Ride Distance", id: 0 },
    time: { name: "Ride Time", id: 1 }
}

const scheduleBy = {
    tempo: { name: "Lap Tempo Target", id: 0 },
    time: { name: "Time Target", id: 1 },
    distance: { name: "Distance Target", id: 2 },
    speed: { name: "Speed Tempo Target", id: 3 },
    cadence: { name: "Cadence Tempo Target", id: 4 }
}

const startType = {
    standing: { name: "Standing Start", id: 0 },
    flying: { name: "Flying Start", id: 1 }
}

const timingsAt = {
    halfLap: { name: "Half Lap & Finish", id: 0 },
    fullLap: { name: "Full Lap", id: 1 },
    both: { name: "Both Half & Full Lap", id: 2 },
    partLap: { name: "Part Lap", id: 3 }
}

const defaultScheduleParams = {
    label: "",
    scheduleType: scheduleType.distance,
    scheduleBy: scheduleBy.tempo,
    lapDistance: 0.0,
    distanceLaps: 0.0,
    timeSeconds: 0.0,
    tempoTarget: 0.0,
    startType: startType.standing,
    upToSpeedTime: 4.0,
    timingsAt: timingsAt.fullLap,
    speedTempo: 0.0,
    cadenceTempo: 0.0
}

const calcDistanceSchedule = (scheduleParams) => {
    const s = scheduleParams
    //var nextSegmentIndex = 0
    //var nextLapCount = 0.0
    let points = []

    var tempo = 0.0
    if (s.scheduleBy === scheduleBy.tempo) {
        tempo = s.tempoTarget
    } else if (s.scheduleBy === scheduleBy.time) {
        tempo = (s.timeSeconds - s.upToSpeedTime) / s.distanceLaps
    } else if (s.scheduleBy === scheduleBy.speed) {
        tempo = (3.6 * s.lapDistance) / s.speedTempo
    } else if (s.scheduleBy === scheduleBy.cadence) {
        tempo = (60000 * s.lapDistance) / (s.cadenceTempo * s.gear.rollOut)
    }

    const tempoHrs = tempo / 3600.0
    const lapDistance = s.lapDistance
    const lapDistanceKm = lapDistance / 1000.0
    const tempoSpeed = lapDistanceKm / tempoHrs  // km/h
    const upToSpeedTime = s.upToSpeedTime
    var rollOutMetres = 0.0
    var tempoCadence = 0.0
    var lapPedals = 0.0
    if (s.gear) {
        rollOutMetres = s.gear.rollOut / 1000.0
        lapPedals = lapDistance / rollOutMetres
        tempoCadence = lapPedals / tempo * 60.0  // rpm
    }
    var time = 0.0
    var prevTime = 0.0
    var prevDistance = 0.0
    var firstPoint = true
    var currentLapCount = getNextLapCountForDistanceSchedule(0.0, scheduleParams)

    while (currentLapCount > 0.0) {
        const currentTimingsAt = ((currentLapCount - Math.trunc(currentLapCount)) === 0.0) ? timingsAt.fullLap : timingsAt.halfLap
        const distance = currentLapCount * lapDistance
        const segmentDistance = distance - prevDistance
        prevDistance = distance
        time = (currentLapCount * tempo) + upToSpeedTime
        const segmentTime = time - prevTime
        prevTime = time
        var speed = tempoSpeed
        var aveSpeed = speed
        var cadence = tempoCadence
        var aveCadence = cadence
        if (firstPoint === true && upToSpeedTime > 0.0) {
            speed = (distance / 1000.0) / (time / 3600.0)
            aveSpeed = speed
            if (rollOutMetres !== 0.0) {
                cadence = lapPedals * currentLapCount / time * 60.0
                aveCadence = cadence
            }
            firstPoint = false
        } else if (upToSpeedTime > 0) {
            aveSpeed = (distance / 1000.0) / (time / 3600.0)
            if (rollOutMetres != 0.0) {
                aveCadence = lapPedals * currentLapCount / time * 60.0
            }
        }
        const newPoint = {
            timingAt: currentTimingsAt.id,
            lapNumber: currentLapCount,
            distance: distance, 
            time: time, 
            tempo: tempo, 
            segmentTime: segmentTime,
            segmentDistance: segmentDistance, 
            speed: speed, 
            aveSpeed: aveSpeed, 
            cadence: cadence,
            aveCadence: aveCadence
        }
        points.push(newPoint)
        currentLapCount = getNextLapCountForDistanceSchedule(currentLapCount, scheduleParams)
    }

    return {
        points: points
    }
}

const getNextLapCountForDistanceSchedule = (currentLapCount, scheduleParams) => {
    const s = scheduleParams
    // Handle start
    if (currentLapCount === 0.0) {
        if (s.timingsAt === timingsAt.fullLap) {
            return 1.0
        } else {
            return 0.5
        }
    }
    // Handle finish
    if (currentLapCount === s.distanceLaps) {
        return 0.0
    } 
    // Handle progressive cases
    const increment = (s.timingsAt === timingsAt.both) ? 0.5 : 1.0
    var newLapCount = currentLapCount + increment
    if (newLapCount > s.distanceLaps) {
        newLapCount = s.distanceLaps
    }
    return newLapCount
}

module.exports = {
    scheduleType: scheduleType,
    scheduleBy: scheduleBy,
    startType: startType,
    timingsAt: timingsAt,
    defaultScheduleParams: defaultScheduleParams,
    calcDistanceSchedule: calcDistanceSchedule,
    getNextLapCountForDistanceSchedule: getNextLapCountForDistanceSchedule
}