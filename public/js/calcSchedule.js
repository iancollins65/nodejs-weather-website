const calcScheduleForm = document.querySelector('form')
const lapLengthFld = document.querySelector('#lapLength')
const scheduleTypeSelect = document.querySelector('#scheduleType')
const scheduleTypeHiddenFld = document.querySelector('#scheduleTypeHidden')
const distanceLapsSection = document.querySelector('#distanceLapsSection')
const distanceLapsFld = document.querySelector('#distanceLaps')
const rideTimeSection = document.querySelector('#rideTimeSection')
const rideTimeFld = document.querySelector('#rideTime')
const scheduleBySelect = document.querySelector('#scheduleBy')
const scheduleByHiddenFld = document.querySelector('#scheduleByHidden')
const tempoSection = document.querySelector('#tempoSection')
const tempoFld = document.querySelector('#tempo')
const timeSection = document.querySelector('#timeSection')
const timeFld = document.querySelector('#time')
const distanceSection = document.querySelector('#distanceSection')
const distanceFld = document.querySelector('#distance')
const speedSection = document.querySelector('#speedSection')
const speedFld = document.querySelector('#speed')
const cadenceSection = document.querySelector('#cadenceSection')
const cadenceFld = document.querySelector('#cadence')
const startTypeSelect = document.querySelector('#startType')
const startTypeHiddenFld = document.querySelector('#startTypeHidden')
const upToSpeedSection = document.querySelector('#upToSpeedSection')
const upToSpeedFld = document.querySelector('#upToSpeed')
const timingsAtSelect = document.querySelector('#timingsAt')
const timingsAtHiddenFld = document.querySelector('#timingsAtHidden')
const provideGearCheckBox = document.querySelector('#provideGearCheckBox')
const gearSection = document.querySelector('#gearSection')
const chainRingFld = document.querySelector('#chainRing')
const cogFld = document.querySelector('#cog')
const tyreWidthFld = document.querySelector('#tyreWidth')
const rimTypeFld = document.querySelector('#rimType')
const rimTypeHiddenFld = document.querySelector('#rimTypeHidden')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const outputText = document.querySelector('#outputText')
const outcomeTable = document.querySelector('#outcomeTable')
const showSection = document.querySelector('#showSection')
const showSelect = document.querySelector('#showData')
const outputTable = document.querySelector('#outputTable')
const scheduleText = document.querySelector('#scheduleText')
const scheduleLabel = document.querySelector('#scheduleLabel')
const scheduleDescription = document.querySelector('#scheduleDescription')
var pointsGlobal = []

rideTimeSection.style.display = 'none'
timeSection.style.display = 'none'
distanceSection.style.display = 'none'
speedSection.style.display = 'none'
cadenceSection.style.display = 'none'
gearSection.style.display = 'none'
scheduleText.style.display = 'none'
messageOne.style.display = 'none'
messageTwo.style.display = 'none'
outputText.style.display = 'none'
outcomeTable.style.display = 'none'
showSection.style.display = 'none'
outputTable.style.display = 'none'

// Form submit

calcScheduleForm.addEventListener('submit', (e) => {
    e.preventDefault()
    handleSubmit()
})

const handleSubmit = () => {
    messageOne.style.display = 'block'
    messageOne.style.color = '#333456'   
    messageOne.textContent = 'Loading...'
    scheduleText.style.display = 'none'
    messageTwo.style.display = 'none'    
    outputText.style.display = 'none'    
    outcomeTable.style.display = 'none'    
    showSection.style.display = 'none'
    outputTable.style.display = 'none'    

    const lapLength = lapLengthFld.value
    const scheduleType = scheduleTypeSelect.value
    const distanceLaps = distanceLapsFld.value
    const rideTime = rideTimeFld.value
    const scheduleBy = scheduleBySelect.value
    const tempo = tempoFld.value
    const time = timeFld.value
    const distance = distanceFld.value
    const speed = speedFld.value
    const cadence = cadenceFld.value
    const startType = startTypeSelect.value
    const upToSpeed = upToSpeedFld.value
    const timingsAt = timingsAtSelect.value
    const chainRing = chainRingFld.value
    const cog = cogFld.value
    const tyreWidth = tyreWidthFld.value
    const rimType = rimTypeFld.value

    var url = '/calculateSchedule?lapDistance=' + lapLength + '&scheduleType=' + scheduleType 
        + '&scheduleBy=' + scheduleBy + '&startType=' + startType + '&timingsAt=' + timingsAt

    if (scheduleType === 'rideDistance') {
        url = url + '&distanceLaps=' + distanceLaps
    } else if (scheduleType === 'rideTime') {
        url = url + '&timeSeconds=' + rideTime
    }

    if (scheduleBy === 'tempo') {
        url = url + '&tempoTarget=' + tempo
    } else if (scheduleBy === 'time') {
        url = url + '&timeSeconds=' + time
    } else if (scheduleBy === 'distance') {
        url = url + '&distanceLaps=' + distance
    } else if (scheduleBy === 'speed') {
        url = url + '&speedTempo=' + speed
    } else if (scheduleBy === 'cadence') {
        url = url + '&cadenceTempo=' + cadence
    }

    if (startType === 'standing') {
        url = url + '&upToSpeedTime=' + upToSpeed
    }

    if (provideGearCheckBox.checked === true) {
        url = url + '&chainRing=' + chainRing + '&cog=' + cog + '&rimType=' + rimType
        if (tyreWidth !== '') {
            url = url + '&tyreWidth=' + tyreWidth
        }    
    }

    console.log(url)

    fetch(url).then((response) => {
        response.json().then((response) => {
            if (response.error) {
                var errorStr = response.error + '.'
                errorStr = errorStr.replace('lapDistance', 'Lap Length')
                errorStr = errorStr.replace('distanceLaps', 'Distance')
                if (errorStr.includes('timeSeconds') === true) {
                    if (scheduleType === 'rideTime') {
                        errorStr = errorStr.replace('timeSeconds', 'Ride Time')
                    } else if (scheduleType === 'rideDistance') {
                        errorStr = errorStr.replace('timeSeconds', 'Time')
                    }
                }
                errorStr = errorStr.replace('tempoTarget', 'Tempo')
                errorStr = errorStr.replace('speedTempo', 'Speed')
                errorStr = errorStr.replace('cadenceTempo', 'Cadence')
                errorStr = errorStr.replace('upToSpeedTime', 'Up To Speed')
                errorStr = errorStr.replace('chainRing', 'Chain Ring')
                errorStr = errorStr.replace('cog', 'Cog')
                errorStr = errorStr.replace('tyreWidth', 'Tyre Width')
                errorStr = errorStr.replace('rimType', 'Rim Type')
                errorStr = errorStr.replace('or Rollout value is', 'are')
                messageOne.style.color = 'red'
                messageOne.textContent = errorStr
            } else {
                scheduleText.style.display = 'block'
                scheduleLabel.textContent = response.label
                scheduleDescription.textContent = response.description
                messageOne.textContent = 'Schedule outcome'
                outcomeTable.style.display = 'block'
                outcomeTable.innerHTML = ""
                outcomeTable.appendChild(buildScheduleOutcomeTable(response.points[response.points.length - 1]))
                messageTwo.style.display = 'block'
                showSection.style.display = 'block'
                outputTable.style.display = 'block'
                outputTable.innerHTML = ""
                outputTable.appendChild(buildScheduleDetailsTable(response.points, showSelect.value))
                //outputText.style.display = 'block'
                //outputText.textContent = JSON.stringify(response.points)
                pointsGlobal = response.points
            }
        })
    }) 
}

const canAutoCalculate = () => {

    const lapLength = lapLengthFld.value
    const scheduleType = scheduleTypeSelect.value
    const distanceLaps = distanceLapsFld.value
    const rideTime = rideTimeFld.value
    const scheduleBy = scheduleBySelect.value
    const tempo = tempoFld.value
    const time = timeFld.value
    const distance = distanceFld.value
    const speed = speedFld.value
    const cadence = cadenceFld.value
    const startType = startTypeSelect.value
    const upToSpeed = upToSpeedFld.value
    const chainRing = chainRingFld.value
    const cog = cogFld.value

    if (lapLength === '' || lapLength <= 0.0) {
        return false
    } else if (scheduleType === 'rideDistance' && (distanceLaps === '' || distanceLaps === 0.0)) {
        return false
    } else if (scheduleType === 'rideTime' && rideTime === '') {
        return false
    } else if (scheduleBy === 'time' && time === '') {
        return false
    } else if (scheduleBy === 'tempo' && (tempo === '' || tempo === 0.0)) {
        return false
    } else if (scheduleBy === 'distance' && (distance === '' || distance === 0.0)) {
        return false
    } else if (scheduleBy === 'speed' && (speed === '' || speed === 0.0)) {
        return false
    } else if (scheduleBy === 'cadence' && (cadence === '' || cadence === 0.0)) {
        return false
    } else if (scheduleBy === 'cadence' && (chainRing === '' || cog === '')) {
        return false
    } else if (startType === 'standing' && (upToSpeed === '' || upToSpeed === 0.0)) {
        return false
    } else {
        return true
    }
}

// Handle form input

calcScheduleForm.addEventListener('input', (e) => {
    messageOne.style.display = 'none'
    messageTwo.style.display = 'none'
    outputText.style.display = 'none'
    showSection.style.display = 'none'
    outcomeTable.style.display = 'none'
    outputTable.style.display = 'none'
    scheduleText.style.display = 'none'
})

// Handle Provide Gear checkbox setting

provideGearCheckBox.addEventListener('input', (e) => {
    actOnProvideGearSet()
})

const actOnProvideGearSet = () => {
    if (provideGearCheckBox.checked === true) {
        gearSection.style.display = 'block'
    } else {
        gearSection.style.display = 'none'
    }
}

// Handle show selection

showSelect.addEventListener('change', (e) => {
    const show = showSelect.value
    outputTable.innerHTML = ""
    outputTable.appendChild(buildScheduleDetailsTable(pointsGlobal, show))
})

// Drop down box selection

scheduleTypeSelect.addEventListener('change', (e) => {
    actOnScheduleTypeSelection()
    scheduleTypeHiddenFld.value = ''
})

const actOnScheduleTypeSelection = () => {
    if (scheduleTypeSelect.value === 'rideDistance') {
        distanceLapsSection.style.display = 'block'
        rideTimeSection.style.display = 'none'
        const prevScheduleByValue = scheduleBySelect.value
        buildScheduleBySelect()
        if (prevScheduleByValue === 'distance') {
            scheduleBySelect.value = 'tempo'
            distanceSection.style.display = 'none'
            tempoSection.style.display = 'block'
        } else {
            scheduleBySelect.value = prevScheduleByValue
        }
    } else if (scheduleTypeSelect.value === 'rideTime') {
        distanceLapsSection.style.display = 'none'
        rideTimeSection.style.display = 'block'
        const prevScheduleByValue = scheduleBySelect.value
        buildScheduleBySelect()
        if (prevScheduleByValue === 'time') {
            scheduleBySelect.value = 'tempo'
            timeSection.style.display = 'none'
            tempoSection.style.display = 'block'
        } else {
            scheduleBySelect.value = prevScheduleByValue
        }
    }
}

const buildScheduleBySelect = () => {
    while (scheduleBySelect.options.length > 0) {
        scheduleBySelect.remove(0);
    }
    var scheduleByOptions = []
    if (scheduleTypeSelect.value === 'rideDistance') {
        scheduleByOptions = [
            { code: 'tempo', name: "Lap Tempo Target" },
            { code: 'time', name: "Time Target" },
            { code: 'speed', name: "Speed Tempo Target" },
            { code: 'cadence', name: "Cadence Tempo Target" }
        ]
    } else if (scheduleTypeSelect.value === 'rideTime') {
        scheduleByOptions = [
            { code: 'tempo', name: "Lap Tempo Target" },
            { code: 'distance', name: "Distance Target" },
            { code: 'speed', name: "Speed Tempo Target" },
            { code: 'cadence', name: "Cadence Tempo Target" }
        ]
    }
    for (scheduleBy of scheduleByOptions) {
        const option = document.createElement('option')
        const text = document.createTextNode(scheduleBy.name)
        option.appendChild(text)
        option.setAttribute('value', scheduleBy.code)
        scheduleBySelect.appendChild(option)
    }
}

scheduleBySelect.addEventListener('change', (e) => {
    actOnScheduleBySelection()
    scheduleByHiddenFld.value = ''
})

const actOnScheduleBySelection = () => {
    if (scheduleBySelect.value === 'tempo') {
        tempoSection.style.display = 'block'
        timeSection.style.display = 'none'
        distanceSection.style.display = 'none'
        speedSection.style.display = 'none'
        cadenceSection.style.display = 'none'
    } else if (scheduleBySelect.value === 'time') {
        tempoSection.style.display = 'none'
        timeSection.style.display = 'block'
        distanceSection.style.display = 'none'
        speedSection.style.display = 'none'
        cadenceSection.style.display = 'none'
    } else if (scheduleBySelect.value === 'distance') {
        tempoSection.style.display = 'none'
        timeSection.style.display = 'none'
        distanceSection.style.display = 'block'
        speedSection.style.display = 'none'
        cadenceSection.style.display = 'none'
    } else if (scheduleBySelect.value === 'speed') {
        tempoSection.style.display = 'none'
        timeSection.style.display = 'none'
        distanceSection.style.display = 'none'
        speedSection.style.display = 'block'
        cadenceSection.style.display = 'none'
    } else if (scheduleBySelect.value === 'cadence') {
        tempoSection.style.display = 'none'
        timeSection.style.display = 'none'
        distanceSection.style.display = 'none'
        speedSection.style.display = 'none'
        cadenceSection.style.display = 'block'
        provideGearCheckBox.checked = true
        actOnProvideGearSet()
    }
}

startTypeSelect.addEventListener('change', (e) => {
    actOnStartTypeSelection()
    startTypeHiddenFld.value = ''
})

const actOnStartTypeSelection = () => {
    if (startTypeSelect.value === 'standing') {
        upToSpeedSection.style.display = 'block'
    } else if (startTypeSelect.value === 'flying') {
        upToSpeedSection.style.display = 'none'
    }
}

// Dynamic output tables

const buildScheduleOutcomeTable = (endPoint) => {

    // Build the table
    var table = document.createElement('table')

    // Table contents
    // Laps row
    let tr = table.insertRow(-1)
    let th = document.createElement('th')
    th.innerHTML = 'Laps'
    tr.appendChild(th)
    let tc = tr.insertCell(-1)
    let rawValue = endPoint.lapNumber
    tc.innerHTML = round(rawValue, 1)

    // Distance row
    tr = table.insertRow(-1)
    th = document.createElement('th')
    th.innerHTML = 'Distance'
    tr.appendChild(th)
    tc = tr.insertCell(-1)
    rawValue = convertMtoKM(endPoint.distance)
    tc.innerHTML = round(rawValue, 3) + ' km'

    // Time row
    tr = table.insertRow(-1)
    th = document.createElement('th')
    th.innerHTML = 'Time'
    tr.appendChild(th)
    tc = tr.insertCell(-1)
    rawValue = round(endPoint.time, 3)
    let rawStr = convertSecondsToHMMSS(rawValue)
    tc.innerHTML = rawStr

    // Tempo row
    tr = table.insertRow(-1)
    th = document.createElement('th')
    th.innerHTML = 'Tempo'
    tr.appendChild(th)
    tc = tr.insertCell(-1)
    rawValue = endPoint.tempo
    tc.innerHTML = round(rawValue, 3) + ' sec'

    // Ave Speed row
    tr = table.insertRow(-1)
    th = document.createElement('th')
    th.innerHTML = 'Ave. Speed'
    tr.appendChild(th)
    tc = tr.insertCell(-1)
    rawValue = endPoint.aveSpeed
    tc.innerHTML = round(rawValue, 3) + ' km/h'

    // Ave Cadence row
    if (endPoint.aveCadence !== 0) {
        tr = table.insertRow(-1)
        th = document.createElement('th')
        th.innerHTML = 'Ave. Cadence'
        tr.appendChild(th)
        tc = tr.insertCell(-1)
        rawValue = endPoint.aveCadence
        tc.innerHTML = round(rawValue, 3) + ' rpm'
    }

    return table
}

const buildScheduleDetailsTable = (points, show) => {

    var showCadence = false
    if (points.length > 0) {
        let endPoint = points[points.length - 1]
        if (endPoint.aveCadence !== 0) {
            showCadence = true
        }
    }

    // Build the table
    var table = document.createElement('table')

    // Create header row
    let tr = table.insertRow(-1)
    let th = document.createElement('th')
    th.innerHTML = 'Lap'
    tr.appendChild(th)
    th = document.createElement('th')
    th.innerHTML = 'Distance'
    tr.appendChild(th)
    th = document.createElement('th')
    th.innerHTML = 'Time'
    tr.appendChild(th)
    if (show === 'incSegmentData') {
        th = document.createElement('th')
        th.innerHTML = 'Seg. Dist'
        tr.appendChild(th)
        th = document.createElement('th')
        th.innerHTML = 'Seg. Time'
        tr.appendChild(th)
        th = document.createElement('th')
        th.innerHTML = 'Seg. Speed'
        tr.appendChild(th)
        if (showCadence === true) {
            th = document.createElement('th')
            th.innerHTML = 'Seg. Cadence'
            tr.appendChild(th)
        }
    }

    // Create data rows
    for (point of points) {
        let tr = table.insertRow(-1)
        // Lap cell
        let lapCell = tr.insertCell(-1)
        let rawValue = point.lapNumber
        lapCell.innerHTML = round(rawValue, 1)
        // Distance cell
        let distanceCell = tr.insertCell(-1)
        rawValue = convertMtoKM(point.distance)
        distanceCell.innerHTML = round(rawValue, 3) + ' km'
        // Time cell
        let timeCell = tr.insertCell(-1)
        rawValue = round(point.time, 3)
        let rawStr = convertSecondsToHMMSS(rawValue)
        timeCell.innerHTML = rawStr
        if (show === 'incSegmentData') {
            // Segment Distance cell
            let segDistanceCell = tr.insertCell(-1)
            rawValue = point.segmentDistance
            segDistanceCell.innerHTML = round(rawValue, 1) + ' m'
            // Segment Time cell
            let segTimeCell = tr.insertCell(-1)
            rawValue = round(point.segmentTime, 3)
            rawStr = convertSecondsToHMMSS(rawValue)
            segTimeCell.innerHTML = rawStr
            // Segment Speed cell
            let segSpeedCell = tr.insertCell(-1)
            rawValue = point.speed
            segSpeedCell.innerHTML = round(rawValue, 3) + ' km/h'
            // Segment Cadence cell
            if (showCadence === true) {
                let segCadenceCell = tr.insertCell(-1)
                rawValue = point.cadence
                segCadenceCell.innerHTML = round(rawValue, 3) + ' rpm'
            }
        }
    }    

    return table
}

// Utilities

const round = (value, places) => {
    const rounder = Math.pow(10, places)
    return Math.round(value * rounder) / rounder
}

const div = (x, y) => {
    return Math.floor(x / y)
}

const convertMtoKM = (metres) => {
    return metres / 1000
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

// On load

const handleOnLoad = () => {

    if (rimTypeHiddenFld.value !== '') {
        rimTypeFld.value = rimTypeHiddenFld.value
    }

    provideGearCheckBox.checked = Boolean(chainRingFld.value !== '' || cogFld.value !== '')

    actOnProvideGearSet()

    if (timingsAtHiddenFld.value !== '') {
        timingsAtSelect.value = timingsAtHiddenFld.value
    }

    if (startTypeHiddenFld.value !== '') {
        startTypeSelect.value = startTypeHiddenFld.value
    }

    actOnStartTypeSelection()

    if (scheduleByHiddenFld.value !== '') {
        scheduleBySelect.value = scheduleByHiddenFld.value
    }

    actOnScheduleBySelection()

    if (scheduleTypeHiddenFld.value !== '') {
        scheduleTypeSelect.value = scheduleTypeHiddenFld.value
    }

    actOnScheduleTypeSelection()

    if (canAutoCalculate() === true) {
        handleSubmit()
    }
}