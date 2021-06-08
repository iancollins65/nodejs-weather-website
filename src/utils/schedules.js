const gears = require('./gears')

const milesToKm = 1.60934
const kmToMiles = 0.621371
const ydsToM = 0.9144
const mToYds = 1.09361
const inchesToMm = 25.4
const mmToInches = 0.0393701

const scheduleType = {
    distance: { code: 'rideDistance', name: "Ride Distance", id: 0 },
    time: { code: 'rideTime', name: "Ride Time", id: 1 }
}

const scheduleBy = {
    tempo: { code: 'tempo', name: "Lap Tempo Target", id: 0 },
    time: { code: 'time', name: "Time Target", id: 1 },
    distance: { code: 'distance', name: "Distance Target", id: 2 },
    speed: { code: 'speed', name: "Speed Tempo Target", id: 3 },
    cadence: { code: 'cadence', name: "Cadence Tempo Target", id: 4 }
}

const startType = {
    standing: { code: 'standing', name: "Standing Start", id: 0 },
    flying: { code: 'flying', name: "Flying Start", id: 1 }
}

const timingsAt = {
    halfLap: { code: 'halfLap', name: "Half Lap & Finish", id: 0 },
    fullLap: { code: 'fullLap', name: "Full Lap", id: 1 },
    both: { code: 'both', name: "Both Half & Full Lap", id: 2 },
    partLap: { code: 'partLap', name: "Part Lap", id: 3 }
}

const defaultScheduleParams = {
    label: "",
    scheduleType: scheduleType.distance.code,
    scheduleBy: scheduleBy.tempo.code,
    lapDistance: 0.0,
    distanceLaps: 0.0,
    timeSeconds: 0.0,
    tempoTarget: 0.0,
    startType: startType.standing.code,
    upToSpeedTime: 4.0,
    timingsAt: timingsAt.fullLap.code,
    speedTempo: 0.0,
    cadenceTempo: 0.0,
    measure: 'metric'
}

const calcSchedule = (scheduleParams) => {
    const canCalcSchedule = canCalculate(scheduleParams)
    if (canCalcSchedule.canCalc === false) {
        return {
            error: canCalcSchedule.error,
            scheduleParams,
            label: undefined,
            description: undefined,
            points: undefined,
            gear: undefined
        }
    } else {
        var points = []
        const origParams = cloneObject(scheduleParams)
        if (scheduleParams.scheduleType === scheduleType.distance.code) {
            points = calcDistanceSchedule(scheduleParams)
        } else if (scheduleParams.scheduleType === scheduleType.time.code) {
            points = calcTimeSchedule(scheduleParams)
        }
        const label = getScheduleLabel(origParams)
        const description = getScheduleDescription(origParams)
        let gear = getGearInfo(origParams)
        return {
            error: undefined,
            scheduleParams: origParams,
            label,
            description,
            points,
            gear
        }
    }
}

const calcDistanceSchedule = (scheduleParams) => {
    // console.log(scheduleParams)
    const s = scheduleParams
    let points = []

    if (s.measure === 'imperial') {
        if (s.lapDistance) {
            s.lapDistance = s.lapDistance * ydsToM
        }
        if (s.speedTempo) {
            s.speedTempo = s.speedTempo * milesToKm
        }
        if (s.gear) {
            if (s.gear.rollOut) {
                s.gear.rollOut = s.gear.rollOut * inchesToMm
            }
        }
    }

    var upToSpeedTime = 0.0
    if (s.startType === startType.standing.code) {
        upToSpeedTime = s.upToSpeedTime
    }

    var rollOut = 0.0
    if (s.gear) {
        if (s.gear.rollOut) {
            rollOut = s.gear.rollOut
        } else if (s.gear.chainRing && s.gear.cog) {
            const gearInfo = gears.getGearInfo(s.gear.chainRing, s.gear.cog, s.gear.tyreWidth, s.gear.rimType)
            rollOut = gearInfo.rollOut
        }
    }

    var tempo = 0.0
    if (s.scheduleBy === scheduleBy.tempo.code) {
        tempo = s.tempoTarget
    } else if (s.scheduleBy === scheduleBy.time.code) {
        tempo = (s.timeSeconds - upToSpeedTime) / s.distanceLaps
    } else if (s.scheduleBy === scheduleBy.speed.code) {
        tempo = (3.6 * s.lapDistance) / s.speedTempo
    } else if (s.scheduleBy === scheduleBy.cadence.code) {
        tempo = (60000 * s.lapDistance) / (s.cadenceTempo * rollOut)
    }

    const tempoHrs = tempo / 3600.0
    const lapDistance = s.lapDistance
    const lapDistanceKm = lapDistance / 1000.0
    const tempoSpeed = lapDistanceKm / tempoHrs  // km/h
    const rollOutMetres = rollOut / 1000.0
    var tempoCadence = 0.0
    var lapPedals = 0.0
    if (rollOutMetres > 0.0) {
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
            timingAt: currentTimingsAt.code,
            lapNumber: currentLapCount,
            distance: (s.measure === 'imperial') ? (distance * mToYds) : distance, 
            time: time, 
            tempo: tempo, 
            segmentTime: segmentTime,
            segmentDistance: (s.measure === 'imperial') ? (segmentDistance * mToYds) : segmentDistance, 
            speed: (s.measure === 'imperial') ? (speed * kmToMiles) : speed, 
            aveSpeed: (s.measure === 'imperial') ? (aveSpeed * kmToMiles) : aveSpeed, 
            cadence: cadence,
            aveCadence: aveCadence
        }

        points.push(newPoint)
        currentLapCount = getNextLapCountForDistanceSchedule(currentLapCount, scheduleParams)
    }

    return points
}

const getNextLapCountForDistanceSchedule = (currentLapCount, scheduleParams) => {
    const s = scheduleParams
    // Handle start
    if (currentLapCount === 0.0) {
        if (s.timingsAt === timingsAt.fullLap.code) {
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
    const increment = (s.timingsAt === timingsAt.both.code) ? 0.5 : 1.0
    var newLapCount = currentLapCount + increment
    if (newLapCount > s.distanceLaps) {
        newLapCount = s.distanceLaps
    }
    return newLapCount
}

const calcTimeSchedule = (scheduleParams) => {
    const s = scheduleParams
    let points = []

    if (s.measure === 'imperial') {
        if (s.lapDistance) {
            s.lapDistance = s.lapDistance * ydsToM
        }
        if (s.speedTempo) {
            s.speedTempo = s.speedTempo * milesToKm
        }
        if (s.gear) {
            if (s.gear.rollOut) {
                s.gear.rollOut = s.gear.rollOut * inchesToMm
            }
        }
    }

    var upToSpeedTime = 0.0
    if (s.startType === startType.standing.code) {
        upToSpeedTime = s.upToSpeedTime
    }

    var rollOut = 0.0
    if (s.gear) {
        if (s.gear.rollOut) {
            rollOut = s.gear.rollOut
        } else if (s.gear.chainRing && s.gear.cog) {
            const gearInfo = gears.getGearInfo(s.gear.chainRing, s.gear.cog, s.gear.tyreWidth, s.gear.rimType)
            rollOut = gearInfo.rollOut
        }
    }

    var tempo = 0.0
    if (s.scheduleBy === scheduleBy.tempo.code) {
        tempo = s.tempoTarget
    } else if (s.scheduleBy === scheduleBy.distance.code) {
        tempo = (s.timeSeconds - upToSpeedTime) / s.distanceLaps
    } else if (s.scheduleBy === scheduleBy.speed.code) {
        tempo = (3.6 * s.lapDistance) / s.speedTempo
    } else if (s.scheduleBy === scheduleBy.cadence.code) {
        tempo = (60000 * s.lapDistance) / (s.cadenceTempo * rollOut)
    }

    const tempoHrs = tempo / 3600.0
    const lapDistance = s.lapDistance
    const lapDistanceKm = lapDistance / 1000.0
    const tempoSpeed = lapDistanceKm / tempoHrs  // km/h
    const rollOutMetres = rollOut / 1000.0
    var tempoCadence = 0.0
    var lapPedals = 0.0
    if (rollOutMetres > 0.0) {
        lapPedals = lapDistance / rollOutMetres
        tempoCadence = lapPedals / tempo * 60.0  // rpm
    }       
    var prevTime = 0.0
    var prevDistance = 0.0
    var firstPoint = true
    var currentLapCount = 0.0
    var timeLeft = s.timeSeconds

    while (timeLeft > 0.0) {
        const prevLapCount = currentLapCount
        currentLapCount = getNextLapCountForTimeSchedule(currentLapCount, scheduleParams)
        var currentTimingsAt = ((currentLapCount - Math.trunc(currentLapCount)) === 0.0) ? timingsAt.fullLap : timingsAt.halfLap
        var time = (currentLapCount * tempo) + upToSpeedTime
        if (time > s.timeSeconds) {
            const lapPortion = timeLeft / tempo
            currentLapCount = prevLapCount + lapPortion
            currentTimingsAt = timingsAt.partLap
            time = s.timeSeconds
        }
        const segmentTime = time - prevTime
        prevTime = time
        const distance = currentLapCount * lapDistance
        let segmentDistance = distance - prevDistance
        prevDistance = distance
        var speed = tempoSpeed
        var cadence = tempoCadence
        var aveSpeed = speed
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
            timingAt: currentTimingsAt.code,
            lapNumber: currentLapCount,
            distance: (s.measure === 'imperial') ? (distance * mToYds) : distance, 
            time: time, 
            tempo: tempo, 
            segmentTime: segmentTime,
            segmentDistance: (s.measure === 'imperial') ? (segmentDistance * mToYds) : segmentDistance, 
            speed: (s.measure === 'imperial') ? (speed * kmToMiles) : speed, 
            aveSpeed: (s.measure === 'imperial') ? (aveSpeed * kmToMiles) : aveSpeed, 
            cadence: cadence,
            aveCadence: aveCadence
        }

        points.push(newPoint)
        timeLeft = s.timeSeconds - time
    }

    return points
}

const getNextLapCountForTimeSchedule = (currentLapCount, scheduleParams) => {
    const s = scheduleParams
    // Handle start
    if (currentLapCount === 0.0) {
        if (s.timingsAt === timingsAt.fullLap.code) {
            return 1.0
        } else {
            return 0.5
        }
    }
    // Handle progressive cases
    const increment = (s.timingsAt === timingsAt.both.code) ? 0.5 : 1.0
    var newLapCount = currentLapCount + increment
    return newLapCount
}

const canCalculate = (scheduleParams) => {
    const s = scheduleParams
    if (!s.scheduleType) {
        return cannotCalculate("Schedule Type value of distance or time is required")
    } else if (!s.scheduleBy) {
        return cannotCalculate("Schedule By value of tempo, time, distance, speed or cadence is required")
    } else if (!s.lapDistance || s.lapDistance === 0.0) {
        return cannotCalculate("Lap Distance value greater than zero is required")
    } else if (!s.startType) {
        return cannotCalculate("Start Type value of standing or flying is required")
    } else if (!s.timingsAt) {
        return cannotCalculate("Timings At value of fullLap, halfLap or both is required")
    } else if (s.scheduleType === scheduleType.distance.code && (!s.distanceLaps || s.distanceLaps === 0.0)) {
        return cannotCalculate("Distance (Laps) value is required for Schedule Type of Ride Distance")
    } else if (s.scheduleType === scheduleType.time.code && (!s.timeSeconds || s.timeSeconds === 0.0)) {
        return cannotCalculate("Time (H:MM:SS) value is required for Schedule Type of Ride Time")
    } else if (s.scheduleBy === scheduleBy.time.code && (!s.timeSeconds || s.timeSeconds === 0.0)) {
        return cannotCalculate("Time (H:MM:SS) value is required for Schedule By of Time Target")
    } else if (s.scheduleBy === scheduleBy.distance.code && (!s.distanceLaps || s.distanceLaps === 0.0)) {
        return cannotCalculate("Distance (Laps) value is required for Schedule By of Distance Target")
    } else if (s.scheduleBy === scheduleBy.tempo.code && (!s.tempoTarget || s.tempoTarget === 0.0)) {
        return cannotCalculate("Tempo (Seconds) value is required for Schedule By of Tempo Target")
    } else if (s.scheduleBy === scheduleBy.speed.code && (!s.speedTempo || s.speedTempo === 0.0)) {
        return cannotCalculate("Speed Tempo value is required for Schedule By of Speed Tempo Target")
    } else if (s.scheduleBy === scheduleBy.cadence.code && (!s.cadenceTempo || s.cadenceTempo === 0.0)) {
        return cannotCalculate("Cadence Tempo value is required for Schedule By of Cadence Tempo Target")
    } else if (s.scheduleBy === scheduleBy.cadence.code && (!s.gear || (!s.gear.rollOut && (!s.gear.chainRing || !s.gear.cog)))) {
        return cannotCalculate("Gear Chain Ring and Cog or Rollout value is required for Schedule By of Cadence Tempo Target")
    } else if (s.startType === startType.standing.code && (!s.upToSpeedTime || s.upToSpeedTime === 0.0)) {
        return cannotCalculate("Up To Speed Time value (Seconds) is required for Start Type of Standing")
    } else {
        return {
            canCalc: true,
            error: undefined
        }
    }
}

const cannotCalculate = (message) => {
    return {
        canCalc: false,
        error: message
    }
}

const getGearInfo = (scheduleParams) => {
    const s = scheduleParams
    var gearInfo = undefined
    if (s.gear) {
        if (!s.gear.rollOut && s.gear.chainRing && s.gear.cog) {
            gearInfo = gears.getGearInfo(s.gear.chainRing, s.gear.cog, s.gear.tyreWidth, s.gear.rimType,
                undefined, undefined, undefined, undefined, s.measure)
        }
    }
    return gearInfo
}

const validateQueryString = (query, fields) => {
    if (!query) { 
        return { error: 'No query string found' }
    }

    let error = undefined
    let label = undefined
    let scheduleType = undefined
    let scheduleBy = undefined
    let lapDistance = undefined
    let distanceLaps = undefined
    let timeSeconds = undefined
    let tempoTarget = undefined
    let startType = undefined
    let upToSpeedTime = undefined
    let timingsAt = undefined
    let speedTempo = undefined
    let cadenceTempo = undefined
    let chainRing = undefined
    let cog = undefined
    let tyreWidth = undefined
    let rimType = undefined
    let rollOut = undefined
    let measure = undefined

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
            else if (field.type === 'H:MM:SS') {
                // convertSecondsToHMMSS
                const timeString = query[field.name]
                let fieldNumber = Number(timeString)
                if (isNaN(fieldNumber)) { // H:MM:SS format eas provided
                    fieldValue = convertHMMSStimeToSeconds(timeString) // convert to total seconds
                    if (fieldValue === -1) {
                        return { error: field.name + ' does not apply the H:MM:SS time format' }
                    }
                    if (field.convert === false) { // return in H:MM:SS format
                        fieldValue = timeString
                    }
                } else { // total seconds was provided
                    if (!(fieldNumber > 0)) {
                        return { error: field.name + ' is not positive' }
                    }
                    if (field.convert === false) { // return in H:MM:SS format
                        fieldValue = convertSecondsToHMMSS(fieldNumber)
                    } else { // return as total seconds
                        fieldValue = fieldNumber
                    }
                }
            }
        } else if (fieldValue === undefined && field.returnEmpty === true) {
            fieldValue = ''
        }

        switch (field.name) {
            case 'label': label = fieldValue; break;
            case 'scheduleType': scheduleType = fieldValue; break;
            case 'scheduleBy': scheduleBy = fieldValue; break;
            case 'lapDistance': lapDistance = fieldValue; break;
            case 'distanceLaps': distanceLaps = fieldValue; break;
            case 'timeSeconds': timeSeconds = fieldValue; break;
            case 'tempoTarget': tempoTarget = fieldValue; break;
            case 'startType': startType = fieldValue; break;
            case 'upToSpeedTime': upToSpeedTime = fieldValue; break;
            case 'timingsAt': timingsAt = fieldValue; break;
            case 'speedTempo': speedTempo = fieldValue; break;
            case 'cadenceTempo': cadenceTempo = fieldValue; break;
            case 'chainRing': chainRing = fieldValue; break;
            case 'cog': cog = fieldValue; break;
            case 'tyreWidth': tyreWidth = fieldValue; break;
            case 'rimType': rimType = fieldValue; break;
            case 'rollOut': rollOut = fieldValue; break;
            case 'measure': measure = fieldValue; break;
        }
    }

    return {
        error,
        label,
        scheduleType,
        scheduleBy,
        lapDistance,
        distanceLaps,
        timeSeconds,
        tempoTarget,
        startType,
        upToSpeedTime,
        timingsAt,
        speedTempo,
        cadenceTempo,
        chainRing,
        cog,
        tyreWidth,
        rimType,
        rollOut,
        measure
    }
}

const getScheduleLabel = (scheduleParams) => {
    var label = ''
    if (scheduleParams.label) {
        label = scheduleParams.label
    }
    if (label === '') {
        label = getShortDefaultScheduleLabel(scheduleParams)
    }
    return label
}

const getShortDefaultScheduleLabel = (scheduleParams) => {
    const s = scheduleParams
    var defaultLabel = ""
    if (s.scheduleType === scheduleType.distance.code) {
        defaultLabel = "Distance "
        if (s.scheduleBy === scheduleBy.time.code) {
            defaultLabel = defaultLabel + "in time"
        } else if (s.scheduleBy === scheduleBy.tempo.code) {
            defaultLabel = defaultLabel + "at tempo"
        } else if (s.scheduleBy === scheduleBy.speed.code) {
            defaultLabel = defaultLabel + "at speed"
        } else if (s.scheduleBy === scheduleBy.cadence.code) {
            defaultLabel = defaultLabel + "at cadence"
        }
    } else if (s.scheduleType === scheduleType.time.code) {
        defaultLabel = "Time "
        if (s.scheduleBy === scheduleBy.distance.code) {
            defaultLabel = defaultLabel + "for distance"
        } else if (s.scheduleBy === scheduleBy.tempo.code) {
            defaultLabel = defaultLabel + "at tempo"
        } else if (s.scheduleBy === scheduleBy.speed.code) {
            defaultLabel = defaultLabel + "at speed"
        } else if (s.scheduleBy === scheduleBy.cadence.code) {
            defaultLabel = defaultLabel + "at cadence"
        }
    }
    return defaultLabel
}

const getScheduleDescription = (scheduleParams) => {
    const s = scheduleParams

    var mOrYd = undefined
    var kmOrMi = undefined
    if (s.measure === 'imperial') {
        mOrYd = 'yd'
        kmOrMi = 'mph'
    } else { // 'metric'
        mOrYd = 'm'
        kmOrMi = 'km/h'
    }

    var description = ""
    if (s.scheduleType === scheduleType.distance.code) {
        description = "Distance " + s.distanceLaps + " x " + s.lapDistance + mOrYd + " laps"
        if (s.scheduleBy === scheduleBy.time.code) {
            description = description + " in time " + s.timeSeconds + " seconds"
        } else if (s.scheduleBy === scheduleBy.tempo.code) {
            description = description + " at tempo " + s.tempoTarget + " seconds"
        } else if (s.scheduleBy === scheduleBy.speed.code) {
            description = description + " at speed " + s.speedTempo + " " + kmOrMi
        } else if (s.scheduleBy === scheduleBy.cadence.code) {
            description = description + " at cadence " + s.cadenceTempo + " rpm"
        }
    } else if (s.scheduleType === scheduleType.time.code) {
        description = "Time " + s.timeSeconds + " seconds on " + s.lapDistance + mOrYd + " lap"
        if (s.scheduleBy === scheduleBy.distance.code) {
            description = description + " for distance " + s.distanceLaps + " laps"
        } else if (s.scheduleBy === scheduleBy.tempo.code) {
            description = description + " at tempo " + s.tempoTarget + " seconds"
        } else if (s.scheduleBy === scheduleBy.speed.code) {
            description = description + " at speed " + s.speedTempo + " " + kmOrMi
        } else if (s.scheduleBy === scheduleBy.cadence.code) {
            description = description + " at cadence " + s.cadenceTempo + " rpm"
        }
    }
    if (s.startType === startType.flying.code) {
        description = description + ", flying start"
    } else if (s.startType === startType.standing.code) {
        description = description + ", standing start, with " + s.upToSpeedTime + " seconds up to speed time"
    }
    if (s.timingsAt === timingsAt.fullLap.code) {
        description = description + ", full lap"
    } else if (s.timingsAt === timingsAt.halfLap.code) {
        description = description + ", half lap"
    } else if (s.timingsAt === timingsAt.both.code) {
        description = description + ", half & full lap"
    }
    description = description + " timings"
    return description
}

const convertHMMSStimeToSeconds = (timeString) => {
    if (timeString === '') {
        return -1
    }
    const timeArray = timeString.split(':')
    if (timeArray.length > 3) {
        return -1
    } 
    var numArray = []
    for (var i = 0; i < timeArray.length; i++) {
        const elementValue = Number(timeArray[i])
        if (isNaN(elementValue) || ((i < timeArray.length - 1) && !Number.isInteger(elementValue)) || elementValue < 0) {
            return -1
        }
        numArray.push(elementValue)
    }
    var hours = 0
    var minutes = 0
    var seconds = 0
    if (numArray.length === 3) {
        hours = numArray[0]
        minutes = numArray[1]
        seconds = numArray[2]
    } else if (numArray.length === 2) {
        minutes = numArray[0]
        seconds = numArray[1]
    } else if (numArray.length === 1) {
        seconds = numArray[0]
    }
    if (minutes > 59 || seconds > 59) {
        return -1
    }
    return (hours * 60 * 60) + (minutes * 60) + seconds
}

const convertSecondsToHMMSS = (seconds) => {
    var answer = ''
    var h = div(seconds, 3600)
    var remainder = seconds % 3600
    var m = div(remainder, 60)
    var s = round(remainder % 60, 3)
    var mStr = m.toString()
    if (m < 10) {
        mStr = '0' + mStr
    }
    var sStr = s.toString()
    if (s < 10) {
        sStr = '0' + sStr
    }
    if (h > 0) {
        answer = answer + h + ':' + mStr + ':' + sStr
    } else if (m > 0) {
        answer = answer + m + ':' + sStr
    } else {
        answer = answer + s
    }
    return answer
}

const round = (value, places) => {
    const rounder = Math.pow(10, places)
    return Math.round(value * rounder) / rounder
}

const div = (x, y) => {
    return Math.floor(x / y)
}

const cloneObject = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}

module.exports = {
    scheduleType: scheduleType,
    scheduleBy: scheduleBy,
    startType: startType,
    timingsAt: timingsAt,
    defaultScheduleParams: defaultScheduleParams,
    calcDistanceSchedule: calcDistanceSchedule,
    calcTimeSchedule: calcTimeSchedule,
    canCalculate: canCalculate,
    calcSchedule: calcSchedule,
    validateQueryString: validateQueryString,
    getScheduleLabel: getScheduleLabel,
    getScheduleDescription: getScheduleDescription,
    convertHMMSStimeToSeconds: convertHMMSStimeToSeconds
}