const gearDetailsForm = document.querySelector('form')
const chainRingFld = document.querySelector('#chainRing')
const cogFld = document.querySelector('#cog')
const tyreWidthFld = document.querySelector('#tyreWidth')
const rimTypeFld = document.querySelector('#rimType')
const rimTypeHiddenFld = document.querySelector('#rimTypeHidden')
const messageOne = document.querySelector('#message-1')
const extrasSelect = document.querySelector('#extras')
const extrasHiddenFld = document.querySelector('#extrasHidden')
const speedSection = document.querySelector('#speedSection')
const cadenceSection = document.querySelector('#cadenceSection')
const lapTimeSection = document.querySelector('#lapTimeSection')
const lapLengthSection = document.querySelector('#lapLengthSection')
const speedFld = document.querySelector('#speed')
const cadenceFld = document.querySelector('#cadence')
const lapTimeFld = document.querySelector('#lapTime')
const lapLengthFld = document.querySelector('#lapLength')
const outputTable = document.querySelector('#outputTable')
const rimTypeOptionsListHiddenFld = document.querySelector('#rimTypeOptionsListHidden')

speedSection.style.display = 'none'
cadenceSection.style.display = 'none'
lapTimeSection.style.display = 'none'
lapLengthSection.style.display = 'none'
messageOne.style.display = 'none'
outputTable.style.display = 'none'

gearDetailsForm.addEventListener('submit', (e) => {
    e.preventDefault()
    handleSubmit()
})

const handleSubmit = () => {
    messageOne.style.display = 'block'
    messageOne.style.color = '#333456'   
    messageOne.textContent = 'Loading...'
    outputTable.style.display = 'none'

    const chainRing = chainRingFld.value
    const cog = cogFld.value
    const tyreWidth = tyreWidthFld.value
    const rimType = rimTypeFld.value
    const speed = speedFld.value
    const cadence = cadenceFld.value
    const lapTime = lapTimeFld.value
    const lapLength = lapLengthFld.value
    var url = '/gearInfo?chainRing=' + chainRing + '&cog=' + cog + '&rimType=' + rimType
    if (tyreWidth !== '') {
        url = url + '&tyreWidth=' + tyreWidth
    }
    if (speed !== '') {
        url = url + '&speed=' + speed
    }
    if (cadence !== '') {
        url = url + '&cadence=' + cadence
    }
    if (lapTime !== '') {
        url = url + '&lapTime=' + lapTime
    }
    if (lapLength !== '') {
        url = url + '&lapLength=' + lapLength
    }

    fetch(url).then((response) => {
        response.json().then(({ error, gearRatio, gearInches, rollOut, speed, cadence, lapTime, lapPedalCount }) => {
            if (error) {
                var errorStr = error + '.'
                errorStr = errorStr.replace('chainRing', 'Chain Ring')
                errorStr = errorStr.replace('cog', 'Cog')
                errorStr = errorStr.replace('tyreWidth', 'Tyre Width')
                errorStr = errorStr.replace('rimType', 'Rim Type')
                errorStr = errorStr.replace('speed', 'Speed')
                errorStr = errorStr.replace('cadence', 'Cadence')
                errorStr = errorStr.replace('lapTime', 'Lap Time')
                errorStr = errorStr.replace('lapLength', 'Lap Length')
                messageOne.style.color = 'red'
                messageOne.textContent = errorStr
                outputTable.style.display = 'none'
            } else {
                messageOne.textContent = 'Your gear details...'
                outputTable.style.display = 'block'
                outputTable.innerHTML = ""
                outputTable.appendChild(buildOutputTable(gearRatio, gearInches, rollOut, speed, cadence, lapTime, lapPedalCount))
            }
        })
    })
}

gearDetailsForm.addEventListener('input', (e) => {
    messageOne.style.display = 'none'
    outputTable.style.display = 'none'
})

extrasSelect.addEventListener('change', (e) => {
    actOnExtrasSelect()
})

const actOnExtrasSelect = () => {
    if (extrasSelect.value === 'none') {
        speedFld.value = ''
        cadenceFld.value = ''
        lapTimeFld.value = ''
        lapLengthFld.value = ''
        speedSection.style.display = 'none'
        cadenceSection.style.display = 'none'
        lapTimeSection.style.display = 'none'
        lapLengthSection.style.display = 'none'
    } else if (extrasSelect.value === 'speed') {
        speedFld.value = ''
        lapTimeFld.value = ''
        lapLengthFld.placeholder = '(optional, metres)'
        speedSection.style.display = 'none'
        cadenceSection.style.display = 'block'
        lapTimeSection.style.display = 'none'
        lapLengthSection.style.display = 'block'
    } else if (extrasSelect.value === 'cadence') {
        cadenceFld.value = ''
        lapTimeFld.value = ''
        lapLengthFld.placeholder = '(optional, metres)'
        speedSection.style.display = 'block'
        cadenceSection.style.display = 'none'
        lapTimeSection.style.display = 'none'
        lapLengthSection.style.display = 'block'
    } else if (extrasSelect.value === 'cadenceLapTime') {
        speedFld.value = ''
        cadenceFld.value = ''
        lapLengthFld.placeholder = '(metres)'
        speedSection.style.display = 'none'
        cadenceSection.style.display = 'none'
        lapTimeSection.style.display = 'block'
        lapLengthSection.style.display = 'block'
    }
}

const buildRimTypeSelect = () => {
    while (rimTypeFld.options.length > 1) {
        rimTypeFld.remove(1);
    }
    const rimTypeOptionsList = rimTypeOptionsListHiddenFld.value
    const rimTypeOptions = rimTypeOptionsList.split(',')
    for (rimType of rimTypeOptions) {
        if (rimType !== '700c') {
            const option = document.createElement('option')
            const text = document.createTextNode(rimType)
            option.appendChild(text)
            option.setAttribute('value', rimType)
            rimTypeFld.appendChild(option)
        }
    }
}

// Utilities

const round = (value, places) => {
    const rounder = Math.pow(10, places)
    return Math.round(value * rounder) / rounder
}

const insertHeadingValueRow = (table, heading, value, link = false, rawValue = 0, otherValue1 = 0) => {
    let tr = table.insertRow(-1)
    let th = document.createElement('th')
    th.innerHTML = heading
    tr.appendChild(th)
    let tc = tr.insertCell(-1)
    if (link === false) {
        tc.innerHTML = value
    } else {
        let a = document.createElement('A')
        let urlPrefix = '/findGear?findFor='
        if (heading === 'Gear Ratio') {
            a.text = value
            a.title = 'Find other gears for Gear Ratio close to ' + value
            a.href = urlPrefix + 'gearRatio&gearRatio=' + value
        } else if (heading === 'Gear Inches') {
            a.text = value
            a.title = 'Find other gears for Gear Inches close to ' + value
            a.href = urlPrefix + 'gearInches&gearInches=' + value
        } else if (heading === 'Roll Out (approx)') {
            const tyreWidth = tyreWidthFld.value
            const rimType = rimTypeFld.value
            var url = urlPrefix + 'rollOut&rollOut=' + rawValue + '&rimType=' + rimType
            if (tyreWidth !== '') {
                url = url + '&tyreWidth=' + tyreWidth
            }
            a.text = value
            a.title = 'Find other gears for Roll Out of ' + rawValue + ' or below'
            a.href = url
        } else if (heading === 'Speed') {
            let extras = extrasSelect.value
            let fixed = 'speed'
            if (extras === 'speed') {
                fixed = 'cadence'
            }
            const tyreWidth = tyreWidthFld.value
            const rimType = rimTypeFld.value
            let url = urlPrefix + 'speedCadence&speed=' + rawValue + '&cadence=' + otherValue1 
                + '&fixed=' + fixed + '&rimType=' + rimType
            if (tyreWidth !== '') {
                url = url + '&tyreWidth=' + tyreWidth
            }
            a.text = value
            a.title = 'Find other gears for speed of ' + rawValue + ' and cadence of ' + otherValue1
            a.href = url
        } else if (heading === 'Cadence') {
            let extras = extrasSelect.value
            let fixed = 'speed'
            if (extras === 'speed') {
                fixed = 'cadence'
            }
            const tyreWidth = tyreWidthFld.value
            const rimType = rimTypeFld.value
            let url = urlPrefix + 'speedCadence&speed=' + otherValue1 + '&cadence=' + rawValue 
                + '&fixed=' + fixed + '&rimType=' + rimType
            if (tyreWidth !== '') {
                url = url + '&tyreWidth=' + tyreWidth
            }
            a.text = value
            a.title = 'Find other gears for cadence of ' + rawValue + ' and speed of ' + otherValue1
            a.href = url
        } else if (heading === 'Lap Time') {
            const tyreWidth = tyreWidthFld.value
            const rimType = rimTypeFld.value
            const lapLength = lapLengthFld.value
            let url = urlPrefix + 'lapTimeCadence&lapTime=' + rawValue + '&cadence=' + otherValue1 
                + '&lapLength=' + lapLength + '&rimType=' + rimType
            if (tyreWidth !== '') {
                url = url + '&tyreWidth=' + tyreWidth
            }
            a.text = value
            a.title = 'Find other gears for lap time of ' + rawValue + ' and cadence of ' + otherValue1
            a.href = url
        }
        tc.appendChild(a)
    }
}

// Output table

const buildOutputTable = (gearRatio, gearInches, rollOut, speed, cadence, lapTime, lapPedalCount) => {
    // Build the table
    var table = document.createElement('table')

    // Table contents
    insertHeadingValueRow(table, 'Gear Ratio', round(gearRatio, 3), true)
    insertHeadingValueRow(table, 'Gear Inches', round(gearInches, 3), true)
    insertHeadingValueRow(table, 'Roll Out (approx)', round(rollOut / 1000, 3) + ' m', true, rollOut / 1000)
    if (speed) {
        insertHeadingValueRow(table, 'Speed', round(speed, 3) + ' km/h', true, speed, cadence)
    }
    if (cadence) {
        insertHeadingValueRow(table, 'Cadence', round(cadence, 3) + ' rpm', true, cadence, speed)
    }
    if (lapTime) {
        insertHeadingValueRow(table, 'Lap Time', round(lapTime, 3) + ' seconds', true, lapTime, cadence)
    }
    if (lapPedalCount) {
        insertHeadingValueRow(table, 'Lap Pedal Count', round(lapPedalCount, 3))
    }

    return table
}

// On load

const handleOnLoad = () => {

    buildRimTypeSelect()

    if (rimTypeHiddenFld.value !== '') {
        rimTypeFld.value = rimTypeHiddenFld.value
    }
    
    if (extrasHiddenFld.value === '' && extrasHiddenFld.value === 'none') {
        extrasSelect.value = 'none'
    } else if (extrasHiddenFld.value === 'cadenceAtSpeed') {
        extrasSelect.value = 'cadence'
    } else if (extrasHiddenFld.value === 'speedAtCadence') {
        extrasSelect.value = 'speed'
    } else if (extrasHiddenFld.value === 'cadenceAtLapTime') {
        extrasSelect.value = 'cadenceLapTime'
    }
    actOnExtrasSelect()
    
    if (chainRingFld.value !== '' && cogFld.value !== '') {
        handleSubmit()
    }
}
