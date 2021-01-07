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
const messageOne = document.querySelector('#message-1')
const outputText = document.querySelector('#outputText')
const outputTable = document.querySelector('#outputTable')

rideTimeSection.style.display = 'none'
timeSection.style.display = 'none'
distanceSection.style.display = 'none'
speedSection.style.display = 'none'
cadenceSection.style.display = 'none'
messageOne.style.display = 'none'
outputText.style.display = 'none'
outputTable.style.display = 'none'

// Form submit

calcScheduleForm.addEventListener('submit', (e) => {
    e.preventDefault()
    handleSubmit()
})

const handleSubmit = () => {
}

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

// Utilities

const round = (value, places) => {
    const rounder = Math.pow(10, places)
    return Math.round(value * rounder) / rounder
}

// On load

const handleOnLoad = () => {
    actOnStartTypeSelection()
    actOnScheduleBySelection()
    actOnScheduleTypeSelection()
}