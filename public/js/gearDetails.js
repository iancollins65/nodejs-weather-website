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
const lapLengthSection = document.querySelector('#lapLengthSection')
const speedFld = document.querySelector('#speed')
const cadenceFld = document.querySelector('#cadence')
const lapLengthFld = document.querySelector('#lapLength')
const extrasData = document.querySelector('#extrasData')
const speedCell = document.querySelector('#speedCell')
const cadenceCell = document.querySelector('#cadenceCell')
const lapSection = document.querySelector('#lapSection')
const lapTimeCell = document.querySelector('#lapTime')
const lapPedalCountCell = document.querySelector('#lapPedalCount')

speedSection.style.display = 'none'
cadenceSection.style.display = 'none'
lapLengthSection.style.display = 'none'
extrasData.style.display = 'none'

gearDetailsForm.addEventListener('submit', (e) => {
    e.preventDefault()

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
                errorStr = errorStr.replace('lapLength', 'Lap Length')
                messageOne.style.color = 'red'
                messageOne.textContent = errorStr
            } else {
                messageOne.textContent = 'Your gear details...'
                gearRatioCell.textContent = Math.round(gearRatio * 1000) / 1000
                gearInchesCell.textContent = Math.round(gearInches * 1000) / 1000
                rollOutCell.textContent = Math.round(rollOut) / 1000 + ' m'
                if (speed) {
                    extrasData.style.display = 'block'
                    speedCell.textContent = Math.round(speed * 1000) / 1000 + ' km/h'
                    if (cadence) {
                        cadenceCell.textContent = Math.round(cadence * 1000) / 1000 + ' rpm'
                    }
                    if (lapTime) {
                        lapSection.style.display = 'block'
                        lapTimeCell.textContent = Math.round(lapTime * 1000) / 1000 + ' seconds'
                        if (lapPedalCount) {
                            lapPedalCountCell.textContent = Math.round(lapPedalCount * 1000) / 1000
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

extrasSelect.addEventListener('change', (e) => {
    if (extrasSelect.value === 'none') {
        speedFld.value = ''
        cadenceFld.value = ''
        lapLengthFld.value = ''
        speedSection.style.display = 'none'
        cadenceSection.style.display = 'none'
        lapLengthSection.style.display = 'none'
    } else if (extrasSelect.value === 'speed') {
        speedFld.value = ''
        speedSection.style.display = 'none'
        cadenceSection.style.display = 'block'
        lapLengthSection.style.display = 'block'
    } else if (extrasSelect.value === 'cadence') {
        cadenceFld.value = ''
        speedSection.style.display = 'block'
        cadenceSection.style.display = 'none'
        lapLengthSection.style.display = 'block'
     }
})