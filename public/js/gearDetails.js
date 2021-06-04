const gearDetailsForm = document.querySelector('form')
const chainRingFld = document.querySelector('#chainRing')
const cogFld = document.querySelector('#cog')
const tyreWidthFld = document.querySelector('#tyreWidth')
const rimTypeFld = document.querySelector('#rimType')
const rimTypeHiddenFld = document.querySelector('#rimTypeHidden')
const measureSelect = document.querySelector('#measure')
const measureHiddenFld = document.querySelector('#measureHidden')
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
const rimTypeDescriptionsListHiddenFld = document.querySelector('#rimTypeDescriptionsListHidden')

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

    const measure = measureSelect.value
    const chainRing = chainRingFld.value
    const cog = cogFld.value
    const tyreWidth = tyreWidthFld.value
    const rimType = rimTypeFld.value
    const speed = speedFld.value
    const cadence = cadenceFld.value
    const lapTime = lapTimeFld.value
    const lapLength = lapLengthFld.value
    setCookie('measure', measure, 1)
    setCookie('chainRing', chainRing, 1)
    setCookie('cog', cog, 1)
    setCookie('rimType', rimType, 1)
    var url = '/gearInfo?chainRing=' + chainRing + '&cog=' + cog + '&rimType=' + rimType + '&measure=' + measure
    if (tyreWidth !== '') {
        url = url + '&tyreWidth=' + tyreWidth
        setCookie('tyreWidth', tyreWidth, 1)
    }
    if (speed !== '') {
        url = url + '&speed=' + speed
        setCookie('speed', speed, 1)
    }
    if (cadence !== '') {
        url = url + '&cadence=' + cadence
        setCookie('cadence', cadence, 1)
    }
    if (lapTime !== '') {
        url = url + '&lapTime=' + lapTime
        setCookie('lapTime', lapTime, 1)
    }
    if (lapLength !== '') {
        url = url + '&lapLength=' + lapLength
        setCookie('lapLength', lapLength, 1)
    }

    fetch(url).then((response) => {
        response.json().then(({ error, gearRatio, gearInches, rollOut, speed, cadence, lapTime, lapPedalCount, measure }) => {
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
                errorStr = errorStr.replace('measure', 'Measure')
                messageOne.style.color = 'red'
                messageOne.textContent = errorStr
                outputTable.style.display = 'none'
            } else {
                messageOne.textContent = 'Your gear details...'
                outputTable.style.display = 'block'
                outputTable.innerHTML = ""
                outputTable.appendChild(buildOutputTable(gearRatio, gearInches, rollOut, speed, cadence, lapTime, lapPedalCount, measure))
            }
        })
    })
}

gearDetailsForm.addEventListener('input', (e) => {
    messageOne.style.display = 'none'
    outputTable.style.display = 'none'
})

measureSelect.addEventListener('change', (e) => {
    actOnMeasureSelect()
})

const actOnMeasureSelect = () => {
    if (measureSelect.value === 'imperial') {
        if (extrasSelect.value === 'cadenceLapTime') {
            lapLengthFld.placeholder = '(yd)'
        } else {
            lapLengthFld.placeholder = '(yd, optional)'
        }
        speedFld.placeholder = '(mph)'
    } else { // 'metric'
        if (extrasSelect.value === 'cadenceLapTime') {
            lapLengthFld.placeholder = '(m)'
        } else {
            lapLengthFld.placeholder = '(m, optional)'
        }
        speedFld.placeholder = '(km/h)'
    }
}

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
        speedSection.style.display = 'none'
        cadenceSection.style.display = 'block'
        lapTimeSection.style.display = 'none'
        lapLengthSection.style.display = 'block'
    } else if (extrasSelect.value === 'cadence') {
        cadenceFld.value = ''
        lapTimeFld.value = ''
        speedSection.style.display = 'block'
        cadenceSection.style.display = 'none'
        lapTimeSection.style.display = 'none'
        lapLengthSection.style.display = 'block'
    } else if (extrasSelect.value === 'cadenceLapTime') {
        speedFld.value = ''
        cadenceFld.value = ''
        speedSection.style.display = 'none'
        cadenceSection.style.display = 'none'
        lapTimeSection.style.display = 'block'
        lapLengthSection.style.display = 'block'
    }
    actOnMeasureSelect()
}

const buildRimTypeSelect = () => {
    while (rimTypeFld.options.length > 1) {
        rimTypeFld.remove(1);
    }
    const rimTypeOptionsList = rimTypeOptionsListHiddenFld.value
    const rimTypeOptions = rimTypeOptionsList.split(',')
    const rimTypeDescriptionsList = rimTypeDescriptionsListHiddenFld.value
    const rimTypeDescriptions = rimTypeDescriptionsList.split(',')
    for (let i = 1; i < rimTypeOptions.length; i++) {
        const option = document.createElement('option')
        const desc = rimTypeDescriptions[i].replace(/_/g, ' ')
        const text = document.createTextNode(desc)
        option.appendChild(text)
        option.setAttribute('value', rimTypeOptions[i])
        rimTypeFld.appendChild(option)
    }
}

// Utilities

const round = (value, places) => {
    const rounder = Math.pow(10, places)
    return Math.round(value * rounder) / rounder
}

// Cookie functions copied from https://www.w3schools.com/js/js_cookies.asp
const setCookie = (cname, cvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires // + ";path=/";
}
  
const getCookie = (cname) => {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

const setFieldFromCookieIfBlank = (field, cookieName) => {
    if (field.value === '') {
        const cookieValue = getCookie(cookieName)
        if (cookieValue !== '') {
            field.value = cookieValue
        }
    }
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

const buildOutputTable = (gearRatio, gearInches, rollOut, speed, cadence, lapTime, lapPedalCount, measure) => {
    // Build the table
    var table = document.createElement('table')

    var mOrYd = undefined
    var kmOrMi = undefined
    if (measure === 'imperial') {
        mOrInches = ' inches'
        kmOrMi = ' mph'
    } else { // 'metric'
        mOrInches = ' m'
        kmOrMi = ' km/h'
    }

    // Table contents
    insertHeadingValueRow(table, 'Gear Ratio', round(gearRatio, 3), true)
    insertHeadingValueRow(table, 'Gear Inches', round(gearInches, 3), true)
    var rollOutDisplay = undefined
    var rollOutRaw = undefined
    if (measure === 'imperial') {
        rollOutDisplay = round(rollOut, 3)
        rollOutRaw = rollOut
    } else { // 'metric'
        rollOutDisplay = round(rollOut / 1000, 3)
        rollOutRaw = rollOut / 1000
    }
    insertHeadingValueRow(table, 'Roll Out (approx)', rollOutDisplay + mOrInches, true, rollOutRaw)
    if (speed) {
        insertHeadingValueRow(table, 'Speed', round(speed, 3) + kmOrMi, true, speed, cadence)
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

    if (measureHiddenFld.value !== '') {
        measureSelect.value = measureHiddenFld.value
    } else {
        const measureCookie = getCookie('measure')
        if (measureCookie !== '') {
            measureSelect.value = measureCookie
        }
    }

    if (rimTypeHiddenFld.value !== '') {
        rimTypeFld.value = rimTypeHiddenFld.value
    } else {
        const rimTypeCookie = getCookie('rimType')
        if (rimTypeCookie !== '') {
            rimTypeFld.value = rimTypeCookie
        }
    }

    setFieldFromCookieIfBlank(chainRingFld, 'chainRing')
    setFieldFromCookieIfBlank(cogFld, 'cog')
    setFieldFromCookieIfBlank(tyreWidthFld, 'tyreWidth')

    if (extrasHiddenFld.value === '' && extrasHiddenFld.value === 'none') {
        extrasSelect.value = 'none'
    } else if (extrasHiddenFld.value === 'cadenceAtSpeed') {
        extrasSelect.value = 'cadence'
        setFieldFromCookieIfBlank(speedFld, 'speed')
        setFieldFromCookieIfBlank(lapLengthFld, 'lapLength')
    } else if (extrasHiddenFld.value === 'speedAtCadence') {
        extrasSelect.value = 'speed'
        setFieldFromCookieIfBlank(cadenceFld, 'cadence')
        setFieldFromCookieIfBlank(lapLengthFld, 'lapLength')
    } else if (extrasHiddenFld.value === 'cadenceAtLapTime') {
        extrasSelect.value = 'cadenceLapTime'
        setFieldFromCookieIfBlank(lapTimeFld, 'lapTime')
        setFieldFromCookieIfBlank(lapLengthFld, 'lapLength')
    }
    actOnExtrasSelect()
    
    if (chainRingFld.value !== '' && cogFld.value !== '') {
        handleSubmit()
    }
}
