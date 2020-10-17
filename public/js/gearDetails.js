const gearDetailsForm = document.querySelector('form')
const chainRingFld = document.querySelector('#chainRing')
const cogFld = document.querySelector('#cog')
const tyreWidthFld = document.querySelector('#tyreWidth')
const rimTypeFld = document.querySelector('#rimType')
const messageOne = document.querySelector('#message-1')
const gearDataTable = document.querySelector('#gearData')
const gearRatioCell = document.querySelector('#gearRatio')
const gearInchesCell = document.querySelector('#gearInches')
const rollOutCell = document.querySelector('#rollOut')
const extrasSelect = document.querySelector('#extras')
const speedSection = document.querySelector('#speedSection')
const cadenceSection = document.querySelector('#cadenceSection')
const lapTimeSection = document.querySelector('#lapTimeSection')
const lapLengthSection = document.querySelector('#lapLengthSection')
const speedFld = document.querySelector('#speed')
const cadenceFld = document.querySelector('#cadence')
const lapTimeFld = document.querySelector('#lapTime')
const lapLengthFld = document.querySelector('#lapLength')
const extrasData = document.querySelector('#extrasData')
const speedCell = document.querySelector('#speedCell')
const cadenceCell = document.querySelector('#cadenceCell')
const lapSection = document.querySelector('#lapSection')
const lapTimeCell = document.querySelector('#lapTimeCell')
const lapPedalCountCell = document.querySelector('#lapPedalCountCell')

speedSection.style.display = 'none'
cadenceSection.style.display = 'none'
lapTimeSection.style.display = 'none'
lapLengthSection.style.display = 'none'
extrasData.style.display = 'none'
messageOne.style.display = 'none'
gearDataTable.style.display = 'none'
extrasData.style.display = 'none'

gearDetailsForm.addEventListener('submit', (e) => {
    e.preventDefault()

    messageOne.style.display = 'block'
    messageOne.style.color = '#333456'   
    messageOne.textContent = 'Loading...'
    gearRatioCell.textContent = ''
    gearInchesCell.textContent = ''
    rollOutCell.textContent = ''
    speedCell.textContent = ''
    cadenceCell.textContent = ''
    lapTimeCell.textContent = ''
    lapPedalCountCell.textContent = ''

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
                gearDataTable.style.display = 'none'
                extrasData.style.display = 'none'
            } else {
                messageOne.textContent = 'Your gear details...'
                gearDataTable.style.display = 'block'
                gearRatioCell.textContent = round(gearRatio, 3)
                gearInchesCell.textContent = round(gearInches, 3)
                rollOutCell.textContent = round(rollOut, 3) + ' m'
                if (speed) {
                    extrasData.style.display = 'block'
                    speedCell.textContent = round(speed, 3) + ' km/h'
                    if (cadence) {
                        cadenceCell.textContent = round(cadence, 3) + ' rpm'
                    }
                    if (lapTime) {
                        lapSection.style.display = 'block'
                        lapTimeCell.textContent = round(lapTime, 3) + ' seconds'
                        if (lapPedalCount) {
                            lapPedalCountCell.textContent = round(lapPedalCount, 3)
                        }
                    } else {
                        lapSection.style.display = 'none'
                    }
                } else {
                    extrasData.style.display = 'none'
                }
            }
        })
    })
})

gearDetailsForm.addEventListener('input', (e) => {
    messageOne.style.display = 'none'
    gearDataTable.style.display = 'none'
    extrasData.style.display = 'none'
})

extrasSelect.addEventListener('change', (e) => {
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
})

// Utilities

const round = (value, places) => {
    const rounder = Math.pow(10, places)
    return Math.round(value * rounder) / rounder
}