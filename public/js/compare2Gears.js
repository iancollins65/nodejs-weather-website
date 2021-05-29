const gearDetailsForm = document.querySelector('form')
const chainRing1Fld = document.querySelector('#chainRing1')
const cog1Fld = document.querySelector('#cog1')
const chainRing2Fld = document.querySelector('#chainRing2')
const cog2Fld = document.querySelector('#cog2')
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

    const chainRing1 = chainRing1Fld.value
    const cog1 = cog1Fld.value
    const chainRing2 = chainRing2Fld.value
    const cog2 = cog2Fld.value
    const tyreWidth = tyreWidthFld.value
    const rimType = rimTypeFld.value
    const speed = speedFld.value
    const cadence = cadenceFld.value
    const lapTime = lapTimeFld.value
    const lapLength = lapLengthFld.value
    var url = '/comp2Gears?chainRing1=' + chainRing1 + '&cog1=' + cog1 
        + '&chainRing2=' + chainRing2 + '&cog2=' + cog2 + '&rimType=' + rimType
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
        response.json().then(({ error, gear1, gear2 }) => {
            if (error) {
                var errorStr = error + '.'
                errorStr = errorStr.replace('chainRing1', 'Chain Ring 1')
                errorStr = errorStr.replace('chainRing2', 'Chain Ring 2')
                errorStr = errorStr.replace('cog1', 'Cog 1')
                errorStr = errorStr.replace('cog2', 'Cog 2')
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
                outputTable.appendChild(buildOutputTable(gear1, gear2))
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

// Utilities

const round = (value, places) => {
    const rounder = Math.pow(10, places)
    return Math.round(value * rounder) / rounder
}

const insert3HeadingsRow = (table, heading1, heading2, heading3) => {
    let tr = table.insertRow(-1)
    let th = document.createElement('th')
    th.innerHTML = heading1
    tr.appendChild(th)
    th = document.createElement('th')
    th.innerHTML = heading2
    tr.appendChild(th)
    th = document.createElement('th')
    th.innerHTML = heading3
    tr.appendChild(th)
}

const insertHeadingValueRow = (table, heading, value, value2, link = false, rawValue = 0, rawValue2 = 0, otherValue1 = 0, otherValue2 = 0) => {
    let tr = table.insertRow(-1)
    let th = document.createElement('th')
    th.innerHTML = heading
    tr.appendChild(th)
    let tc = tr.insertCell(-1)
    let tc2 = tr.insertCell(-1)
    if (link === false) {
        tc.innerHTML = value
        tc2.innerHTML = value2
    } else {
        let a = document.createElement('A')
        let a2 = document.createElement('A')
        let urlPrefix = '/findGear?findFor='
        if (heading === 'Gear Ratio') {
            a.text = value
            a.title = 'Find other gears for Gear Ratio close to ' + value
            a.href = urlPrefix + 'gearRatio&gearRatio=' + value
            a2.text = value2
            a2.title = 'Find other gears for Gear Ratio close to ' + value2
            a2.href = urlPrefix + 'gearRatio&gearRatio=' + value2
        } else if (heading === 'Gear Inches') {
            a.text = value
            a.title = 'Find other gears for Gear Inches close to ' + value
            a.href = urlPrefix + 'gearInches&gearInches=' + value
            a2.text = value2
            a2.title = 'Find other gears for Gear Inches close to ' + value2
            a2.href = urlPrefix + 'gearInches&gearInches=' + value2
        } else if (heading === 'Roll Out (approx)') {
            const tyreWidth = tyreWidthFld.value
            const rimType = rimTypeFld.value
            let url = urlPrefix + 'rollOut&rollOut=' + rawValue + '&rimType=' + rimType
            let url2 = urlPrefix + 'rollOut&rollOut=' + rawValue2 + '&rimType=' + rimType
            if (tyreWidth !== '') {
                url = url + '&tyreWidth=' + tyreWidth
                url2 = url2 + '&tyreWidth=' + tyreWidth
            }
            a.text = value
            a.title = 'Find other gears for Roll Out of ' + rawValue + ' or below'
            a.href = url
            a2.text = value2
            a2.title = 'Find other gears for Roll Out of ' + rawValue2 + ' or below'
            a2.href = url2
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
            let url2 = urlPrefix + 'speedCadence&speed=' + rawValue2 + '&cadence=' + otherValue2 
                + '&fixed=' + fixed + '&rimType=' + rimType
            if (tyreWidth !== '') {
                url = url + '&tyreWidth=' + tyreWidth
                url2 = url2 + '&tyreWidth=' + tyreWidth
            }
            a.text = value
            a.title = 'Find other gears for speed of ' + rawValue + ' and cadence of ' + otherValue1
            a.href = url
            a2.text = value2
            a2.title = 'Find other gears for speed of ' + rawValue2 + ' and cadence of ' + otherValue2
            a2.href = url2
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
            let url2 = urlPrefix + 'speedCadence&speed=' + otherValue2 + '&cadence=' + rawValue2
                + '&fixed=' + fixed + '&rimType=' + rimType
            if (tyreWidth !== '') {
                url = url + '&tyreWidth=' + tyreWidth
                url2 = url2 + '&tyreWidth=' + tyreWidth
            }
            a.text = value
            a.title = 'Find other gears for cadence of ' + rawValue + ' and speed of ' + otherValue1
            a.href = url
            a2.text = value2
            a2.title = 'Find other gears for cadence of ' + rawValue2 + ' and speed of ' + otherValue2
            a2.href = url2
        } else if (heading === 'Lap Time') {
            const tyreWidth = tyreWidthFld.value
            const rimType = rimTypeFld.value
            const lapLength = lapLengthFld.value
            let url = urlPrefix + 'lapTimeCadence&lapTime=' + rawValue + '&cadence=' + otherValue1 
                + '&lapLength=' + lapLength + '&rimType=' + rimType
            let url2 = urlPrefix + 'lapTimeCadence&lapTime=' + rawValue2 + '&cadence=' + otherValue2 
                + '&lapLength=' + lapLength + '&rimType=' + rimType
            if (tyreWidth !== '') {
                url = url + '&tyreWidth=' + tyreWidth
                url2 = url2 + '&tyreWidth=' + tyreWidth
            }
            a.text = value
            a.title = 'Find other gears for lap time of ' + rawValue + ' and cadence of ' + otherValue1
            a.href = url
            a2.text = value2
            a2.title = 'Find other gears for lap time of ' + rawValue2 + ' and cadence of ' + otherValue2
            a2.href = url2
        }
        tc.appendChild(a)
        tc2.appendChild(a2)
    }
}

// Output table

const buildOutputTable = (gear1, gear2) => {
    // Build the table
    var table = document.createElement('table')

    // Table contents
    insert3HeadingsRow(table, 'Gears', gear1.chainRing + ' x ' + gear1.cog, gear2.chainRing + ' x ' + gear2.cog)
    insertHeadingValueRow(table, 'Gear Ratio', round(gear1.gearRatio, 3), round(gear2.gearRatio, 3), true)
    insertHeadingValueRow(table, 'Gear Inches', round(gear1.gearInches, 3), round(gear2.gearInches, 3), true)
    insertHeadingValueRow(table, 'Roll Out (approx)', round(gear1.rollOut / 1000, 3) + ' m', 
        round(gear2.rollOut / 1000, 3) + ' m', true, gear1.rollOut / 1000, gear2.rollOut / 1000)
    if (gear1.speed) {
        insertHeadingValueRow(table, 'Speed', round(gear1.speed, 3) + ' km/h', round(gear2.speed, 3) + ' km/h', 
            true, gear1.speed, gear2.speed, gear1.cadence, gear2.cadence)
    }
    if (gear1.cadence) {
        insertHeadingValueRow(table, 'Cadence', round(gear1.cadence, 3) + ' rpm', round(gear2.cadence, 3) + ' rpm', 
            true, gear1.cadence, gear2.cadence, gear1.speed, gear2.speed)
    }
    if (gear1.lapTime) {
        insertHeadingValueRow(table, 'Lap Time', round(gear1.lapTime, 3) + ' sec', round(gear2.lapTime, 3) + ' sec', 
            true, gear1.lapTime, gear2.lapTime, gear1.cadence, gear2.cadence)
    }
    if (gear1.lapPedalCount) {
        insertHeadingValueRow(table, 'Lap Pedal Count', round(gear1.lapPedalCount, 3), round(gear2.lapPedalCount, 3))
    }

    return table
}

// On load

const handleOnLoad = () => {
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
    
    if (chainRing1Fld.value !== '' && cog1Fld.value !== '' && chainRing2Fld.value !== '' && cog2Fld.value !== '') {
        handleSubmit()
    }
}
