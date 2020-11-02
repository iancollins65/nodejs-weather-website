const cassetteDetailsForm = document.querySelector('form')
const chainRingsFld = document.querySelector('#chainRings')
const cogsFld = document.querySelector('#cogs')
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
const showSection = document.querySelector('#showSection')
const showSelect = document.querySelector('#showData')
const outputTable = document.querySelector('#outputTable')
var chainRingsGlobal = []
var cogsGlobal = []
var responseGlobal = []

speedSection.style.display = 'none'
cadenceSection.style.display = 'none'
lapTimeSection.style.display = 'none'
lapLengthSection.style.display = 'none'
messageOne.style.display = 'none'
showSection.style.display = 'none'
outputTable.style.display = 'none'

cassetteDetailsForm.addEventListener('submit', (e) => {
    e.preventDefault()
    handleSubmit()
})

const handleSubmit = () => {
    messageOne.style.display = 'block'
    messageOne.style.color = '#333456'   
    messageOne.textContent = 'Loading...'
    outputTable.style.display = 'none'    
    showSection.style.display = 'none'

    const chainRings = chainRingsFld.value
    const cogs = cogsFld.value
    const tyreWidth = tyreWidthFld.value
    const rimType = rimTypeFld.value
    const speed = speedFld.value
    const cadence = cadenceFld.value
    const lapTime = lapTimeFld.value
    const lapLength = lapLengthFld.value
    var url = '/cassetteInfo?chainRings=' + chainRings + '&cogs=' + cogs + '&rimType=' + rimType
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

    fetch(url).then((res) => {
        res.json().then(({ error, request, response }) => {
            if (error) {
                var errorStr = error + '.'
                errorStr = errorStr.replace('chainRings', 'Chain Rings')
                errorStr = errorStr.replace('cogs', 'Cogs')
                errorStr = errorStr.replace('tyreWidth', 'Tyre Width')
                errorStr = errorStr.replace('rimType', 'Rim Type')
                errorStr = errorStr.replace('speed', 'Speed')
                errorStr = errorStr.replace('cadence', 'Cadence')
                errorStr = errorStr.replace('lapTime', 'Lap Time')
                errorStr = errorStr.replace('lapLength', 'Lap Length')
                messageOne.style.color = 'red'
                messageOne.textContent = errorStr
            } else {
                messageOne.textContent = 'Your cassette details...'
                buildShowSelect()
                showSection.style.display = 'block'
                outputTable.style.display = 'block'
                outputTable.innerHTML = ""
                outputTable.appendChild(buildOutputTable(request.chainRings, request.cogs, response, showSelect.value))
                chainRingsGlobal = request.chainRings
                cogsGlobal = request.cogs
                responseGlobal = response
            }
        })
    })
}

cassetteDetailsForm.addEventListener('input', (e) => {
    messageOne.style.display = 'none'
    showSection.style.display = 'none'
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

showSelect.addEventListener('change', (e) => {
    const show = showSelect.value
    outputTable.innerHTML = ""
    outputTable.appendChild(buildOutputTable(chainRingsGlobal, cogsGlobal, responseGlobal, show))
})

const buildShowSelect = () => {
    while (showSelect.options.length > 3) {
        showSelect.remove(3);
    }
    const extras = extrasSelect.value
    if (extras === 'cadence') {
        const option = document.createElement('option')
        const text = document.createTextNode('Cadence')
        option.appendChild(text)
        option.setAttribute('value', 'cadence')
        showSelect.appendChild(option)
    } else if (extras === 'speed') {
        const option = document.createElement('option')
        const text = document.createTextNode('Speed')
        option.appendChild(text)
        option.setAttribute('value', 'speed')
        showSelect.appendChild(option)
    } else if (extras === 'cadenceLapTime') {
        const option = document.createElement('option')
        const text = document.createTextNode('Cadence')
        option.appendChild(text)
        option.setAttribute('value', 'cadence')
        showSelect.appendChild(option)
        const option2 = document.createElement('option')
        const text2 = document.createTextNode('Speed')
        option2.appendChild(text2)
        option2.setAttribute('value', 'speed')
        showSelect.appendChild(option2)
        const option3 = document.createElement('option')
        const text3 = document.createTextNode('Lap Pedal Count')
        option3.appendChild(text3)
        option3.setAttribute('value', 'lapPedalCount')
        showSelect.appendChild(option3)
    }
    if ((extras === 'cadence' || extras === 'speed') && (lapLengthFld.value !== '')) {
        const option2 = document.createElement('option')
        const text2 = document.createTextNode('Lap Time')
        option2.appendChild(text2)
        option2.setAttribute('value', 'lapTime')
        showSelect.appendChild(option2)
        const option3 = document.createElement('option')
        const text3 = document.createTextNode('Lap Pedal Count')
        option3.appendChild(text3)
        option3.setAttribute('value', 'lapPedalCount')
        showSelect.appendChild(option3)
    }
}

// Dynamic output table

const buildOutputTable = (chainRings, cogs, cassetteInfo, show) => {

    // Build the table
    var table = document.createElement('table')

    // Top-top row
    let tr = table.insertRow(-1)
    let th = document.createElement('th')
    tr.appendChild(th)
    th = document.createElement('th')
    th.innerHTML = 'Chain Rings'
    th.colSpan = chainRings.length
    tr.appendChild(th)

    // Top row
    tr = table.insertRow(-1)
    th = document.createElement('th')
    th.innerHTML = 'Cogs'
    tr.appendChild(th)
    for (chainRing of chainRings) {
        let topRowCell = tr.insertCell(-1)
        topRowCell.innerHTML = '<strong>' + chainRing + '</strong>'
    }

    // Remaining rows
    for (cog of cogs) {
        let tr = table.insertRow(-1)
        let leftColCell = tr.insertCell(-1)
        leftColCell.innerHTML = '<strong>' + cog + '</strong>'
        for (chainRing of chainRings) {
            let cell = tr.insertCell(-1)
            const gearInfo = cassetteInfo.find((gearInf) => (gearInf.chainRing === chainRing && gearInf.cog === cog))
            if (gearInfo) {
                if (show === 'gearRatio') {
                    cell.innerHTML = round(gearInfo.gearRatio, 3)
                } else if (show === 'gearInches') {
                    cell.innerHTML = round(gearInfo.gearInches, 3)
                } else if (show === 'rollOut') {
                    cell.innerHTML = round(gearInfo.rollOut / 1000, 3) + ' m'
                } else if (show === 'cadence') {
                    cell.innerHTML = round(gearInfo.cadence, 3) + ' rpm'
                } else if (show === 'speed') {
                    cell.innerHTML = round(gearInfo.speed, 3) + ' km/h'
                } else if (show === 'lapTime') {
                    cell.innerHTML = round(gearInfo.lapTime, 3) + 'sec'
                } else if (show === 'lapPedalCount') {
                    cell.innerHTML = round(gearInfo.lapPedalCount, 3)
                }
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
    
    if (chainRingsFld.value !== '' && cogsFld.value !== '') {
        handleSubmit()
    }
}

