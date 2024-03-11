const gearDetailsForm = document.querySelector('form')
const chainRingFld = document.querySelector('#chainRing')
const cogFld = document.querySelector('#cog')
const circumfranceApproachSelect = document.querySelector('#circumfranceApproach')
const circumfranceApproachHiddenFld = document.querySelector('#circumfranceApproachHidden')
const tyreWidthSection = document.querySelector('#tyreWidthSection')
const tyreWidthFld = document.querySelector('#tyreWidth')
const rimTypeSection = document.querySelector('#rimTypeSection')
const rimTypeFld = document.querySelector('#rimType')
const rimTypeHiddenFld = document.querySelector('#rimTypeHidden')
const measuredCircumfranceSection = document.querySelector('#measuredCircumfranceSection')
const measuredCircumfranceFld = document.querySelector('#measuredCircumfrance')
const crankLengthFld = document.querySelector('#crankLength')
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
const shareableLink = document.querySelector('#shareableLink')
const rimTypeOptionsListHiddenFld = document.querySelector('#rimTypeOptionsListHidden')
const rimTypeDescriptionsListHiddenFld = document.querySelector('#rimTypeDescriptionsListHidden')

measuredCircumfranceSection.style.display = 'none'
speedSection.style.display = 'none'
cadenceSection.style.display = 'none'
lapTimeSection.style.display = 'none'
lapLengthSection.style.display = 'none'
messageOne.style.display = 'none'
outputTable.style.display = 'none'
shareableLink.style.display = 'none'

gearDetailsForm.addEventListener('submit', (e) => {
    e.preventDefault()
    handleSubmit()
})

const handleSubmit = () => {
    messageOne.style.display = 'block'
    messageOne.style.color = '#333456'   
    messageOne.textContent = 'Loading...'
    outputTable.style.display = 'none'
    shareableLink.style.display = 'none'

    const measure = measureSelect.value
    const chainRing = chainRingFld.value
    const cog = cogFld.value
    const circumfranceApproach = circumfranceApproachSelect.value
    const tyreWidth = tyreWidthFld.value
    const rimType = rimTypeFld.value
    const measuredCircumfrance = measuredCircumfranceFld.value
    const crankLength = crankLengthFld.value
    const speed = speedFld.value
    const cadence = cadenceFld.value
    const lapTime = lapTimeFld.value
    const lapLength = lapLengthFld.value
    setCookie('measure', measure, 1)
    setCookie('chainRing', chainRing, 1)
    setCookie('cog', cog, 1)
    setCookie('circumfranceApproach', circumfranceApproach, 1)
    setCookie('rimType', rimType, 1)
    var url = 'chainRing=' + chainRing + '&cog=' + cog + '&rimType=' + rimType 
                + '&measure=' + measure + '&circumfranceApproach=' + circumfranceApproach
    if (circumfranceApproach === 'estimated' && tyreWidth !== '') {
        url = url + '&tyreWidth=' + tyreWidth
        setCookie('tyreWidth', tyreWidth, 1)
    }
    if (circumfranceApproach === 'measured' && measuredCircumfrance !== '') {
        url = url + '&measuredCircumfrance=' + measuredCircumfrance
        setCookie('measuredCircumfrance', measuredCircumfrance, 1)
    }
    if (crankLength !== '') {
        url = url + '&crankLength=' + crankLength
        setCookie('crankLength', crankLength, 1)
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

    var shareableLinkURL = '/gearDetails?' + url
    if (extrasSelect.value === 'none') {
        shareableLinkURL = shareableLinkURL + '&extras=none'
    } else if (extrasSelect.value === 'cadence') {
        shareableLinkURL = shareableLinkURL + '&extras=cadenceAtSpeed'
    } else if (extrasSelect.value === 'speed') {
        shareableLinkURL = shareableLinkURL + '&extras=speedAtCadence'
    } else if (extrasSelect.value === 'cadenceLapTime') {
        shareableLinkURL = shareableLinkURL + '&extras=cadenceAtLapTime'
    }

    url = '/gearInfo?' + url

    fetch(url).then((response) => {
        response.json().then(({ error, gearRatio, gearInches, rollOut, speed, cadence, lapTime, 
                lapPedalCount, measure, trueGearInches, gainRatio, wheelCircumfrance }) => {
            if (error) {
                var errorStr = error + '.'
                errorStr = errorStr.replace('chainRing', 'Chain Ring')
                errorStr = errorStr.replace('cog', 'Cog')
                errorStr = errorStr.replace('tyreWidth', 'Tyre Width')
                errorStr = errorStr.replace('rimType', 'Rim Type')
                errorStr = errorStr.replace('crankLength', 'Cranks')
                errorStr = errorStr.replace('speed', 'Speed')
                errorStr = errorStr.replace('cadence', 'Cadence')
                errorStr = errorStr.replace('lapTime', 'Lap Time')
                errorStr = errorStr.replace('lapLength', 'Lap Length')
                errorStr = errorStr.replace('circumfranceApproach', 'Circumfrance Approach')
                errorStr = errorStr.replace('measuredCircumfrance', 'Measured Circumfrance')
                errorStr = errorStr.replace('measure', 'Measure')
                messageOne.style.color = 'red'
                messageOne.textContent = errorStr
                outputTable.style.display = 'none'
                shareableLink.style.display = 'none'
            } else {
                messageOne.textContent = 'Your gear details...'
                outputTable.style.display = 'block'
                outputTable.innerHTML = ""
                outputTable.appendChild(buildOutputTable(gearRatio, gearInches, rollOut, speed, cadence, lapTime, lapPedalCount, measure, trueGearInches, gainRatio, wheelCircumfrance))
                shareableLink.style.display = 'block'
                shareableLink.innerHTML = ""
                shareableLink.appendChild(buildShareableLink(shareableLinkURL))
            }
        })
    })
}

gearDetailsForm.addEventListener('input', (e) => {
    messageOne.style.display = 'none'
    outputTable.style.display = 'none'
    shareableLink.style.display = 'none'
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
        measuredCircumfranceFld.placeholder = '(in)'
        speedFld.placeholder = '(mph)'
    } else { // 'metric'
        if (extrasSelect.value === 'cadenceLapTime') {
            lapLengthFld.placeholder = '(m)'
        } else {
            lapLengthFld.placeholder = '(m, optional)'
        }
        measuredCircumfranceFld.placeholder = '(mm)'
        speedFld.placeholder = '(km/h)'
    }
}

circumfranceApproachSelect.addEventListener('change', (e) => {
    actOnCircumfranceApproachSelect()
})

const actOnCircumfranceApproachSelect = () => {
    if (circumfranceApproachSelect.value === 'estimated') {
        tyreWidthSection.style.display = 'block'
        rimTypeSection.style.display = 'block'
        measuredCircumfranceSection.style.display = 'none'
    } else if (circumfranceApproachSelect.value === 'measured') {
        tyreWidthSection.style.display = 'none'
        rimTypeSection.style.display = 'none'
        measuredCircumfranceSection.style.display = 'block'
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

const floor = (value, places) => {
    const rounder = Math.pow(10, places)
    return Math.floor(value * rounder) / rounder
}

const roundUp = (value, places) => {
    const floorValue = floor(value, places)
    const increment = Math.pow(10, -1 * places)
    return round(floorValue + increment, places)
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
            let cookieNumber = Number(cookieValue)
            if (isNaN(cookieNumber)) {
                field.value = cookieValue
            } else if (Number.isInteger(cookieNumber)) {
                field.value = cookieValue
            } else {
                cookieNumber = round(cookieNumber, 3)
                field.value = cookieNumber
            }
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
        const measure = measureSelect.value
        const tyreWidth = tyreWidthFld.value
        const rimType = rimTypeFld.value
        const circumfranceApproach = circumfranceApproachSelect.value
        const measuredCircumfrance = measuredCircumfranceFld.value
        if (heading === 'Gear Ratio') {
            a.text = value
            a.title = 'Find other gears for Gear Ratio close to ' + value
            a.href = urlPrefix + 'gearRatio&gearRatio=' + value + '&measure=' + measure
        } else if (heading === 'Gear Inches (27)') {
            a.text = value
            a.title = 'Find other gears for Gear Inches (27) close to ' + value
            a.href = urlPrefix + 'gearInches&gearInches=' + value + '&measure=' + measure
        } else if (heading === 'True Gear Inches') {
            a.text = value
            a.title = 'Find other gears for True Gear Inches close to ' + value
            let url = urlPrefix + 'trueGearInches&trueGearInches=' + value + '&measure=' + measure            
            url = url + '&circumfranceApproach=' + circumfranceApproachSelect.value
            if (circumfranceApproach === 'estimated') {
                if (tyreWidth !== '') {
                    url = url + '&tyreWidth=' + tyreWidth
                }
                url = url + '&rimType=' + rimType
            } else if (circumfranceApproach === 'measured') {
                if (measuredCircumfrance !== '') {
                    url = url + '&measuredCircumfrance=' + measuredCircumfrance
                }
            }
            a.href = url
        } else if (heading === 'Gain Ratio') {
            const crankLength = crankLengthFld.value
            a.text = value
            a.title = 'Find other gears for Gain Ratio close to ' + value
            let url = urlPrefix + 'gainRatio&gainRatio=' + value + '&measure=' + measure
            url = url + '&circumfranceApproach=' + circumfranceApproach
            if (circumfranceApproach === 'estimated') {
                if (tyreWidth !== '') {
                    url = url + '&tyreWidth=' + tyreWidth
                }
                url = url + '&rimType=' + rimType
            } else if (circumfranceApproach === 'measured') {
                if (measuredCircumfrance !== '') {
                    url = url + '&measuredCircumfrance=' + measuredCircumfrance
                }
            }
            if (crankLength !== '') {
                url = url + '&crankLength=' + crankLength
            }
            a.href = url
        } else if (heading === 'Roll Out (approx)') {
            var url = urlPrefix + 'rollOut&rollOut=' + rawValue + '&measure=' + measure
            url = url + '&circumfranceApproach=' + circumfranceApproach
            if (circumfranceApproach === 'estimated') {
                if (tyreWidth !== '') {
                    url = url + '&tyreWidth=' + tyreWidth
                }
                url = url + '&rimType=' + rimType
            } else if (circumfranceApproach === 'measured') {
                if (measuredCircumfrance !== '') {
                    url = url + '&measuredCircumfrance=' + measuredCircumfrance
                }
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
            let url = urlPrefix + 'speedCadence&speed=' + rawValue + '&cadence=' + otherValue1 
                + '&fixed=' + fixed + '&measure=' + measure
            url = url + '&circumfranceApproach=' + circumfranceApproach
            if (circumfranceApproach === 'estimated') {
                if (tyreWidth !== '') {
                    url = url + '&tyreWidth=' + tyreWidth
                }
                url = url + '&rimType=' + rimType
            } else if (circumfranceApproach === 'measured') {
                if (measuredCircumfrance !== '') {
                    url = url + '&measuredCircumfrance=' + measuredCircumfrance
                }
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
            let url = urlPrefix + 'speedCadence&speed=' + otherValue1 + '&cadence=' + rawValue 
                + '&fixed=' + fixed + '&measure=' + measure
            url = url + '&circumfranceApproach=' + circumfranceApproach
            if (circumfranceApproach === 'estimated') {
                if (tyreWidth !== '') {
                    url = url + '&tyreWidth=' + tyreWidth
                }
                url = url + '&rimType=' + rimType
            } else if (circumfranceApproach === 'measured') {
                if (measuredCircumfrance !== '') {
                    url = url + '&measuredCircumfrance=' + measuredCircumfrance
                }
            }
            a.text = value
            a.title = 'Find other gears for cadence of ' + rawValue + ' and speed of ' + otherValue1
            a.href = url
        } else if (heading === 'Lap Time') {
            const lapLength = lapLengthFld.value
            let url = urlPrefix + 'lapTimeCadence&lapTime=' + rawValue + '&cadence=' + otherValue1 
                + '&lapLength=' + lapLength + '&measure=' + measure
            url = url + '&circumfranceApproach=' + circumfranceApproach
            if (circumfranceApproach === 'estimated') {
                if (tyreWidth !== '') {
                    url = url + '&tyreWidth=' + tyreWidth
                }
                url = url + '&rimType=' + rimType
            } else if (circumfranceApproach === 'measured') {
                if (measuredCircumfrance !== '') {
                    url = url + '&measuredCircumfrance=' + measuredCircumfrance
                }
            }
            a.text = value
            a.title = 'Find other gears for lap time of ' + rawValue + ' and cadence of ' + otherValue1
            a.href = url
        }
        tc.appendChild(a)
    }
}

// Output table

const buildOutputTable = (gearRatio, gearInches, rollOut, speed, cadence, lapTime, lapPedalCount, measure, trueGearInches, gainRatio, wheelCircumfrance) => {
    // Build the table
    var table = document.createElement('table')

    var mOrInches = undefined
    var kmOrMi = undefined
    var mmOrInches = undefined
    if (measure === 'imperial') {
        mOrInches = ' in'
        mmOrInches = ' in'
        kmOrMi = ' mph'
    } else { // 'metric'
        mOrInches = ' m'
        mmOrInches = ' mm'
        kmOrMi = ' km/h'
    }

    // Table contents
    insertHeadingValueRow(table, 'Gear Ratio', round(gearRatio, 3), true)
    insertHeadingValueRow(table, 'Gear Inches (27)', round(gearInches, 3), true)
    insertHeadingValueRow(table, 'Wheel Circ.', round(wheelCircumfrance, 3) + mmOrInches, false)
    insertHeadingValueRow(table, 'True Gear Inches', round(trueGearInches, 3), true)
    insertHeadingValueRow(table, 'Gain Ratio', round(gainRatio, 3), true)
    var rollOutDisplay = undefined
    var rollOutRaw = undefined
    if (measure === 'imperial') {
        rollOutDisplay = round(rollOut, 3)
        rollOutRaw = roundUp(rollOut, 3)
    } else { // 'metric'
        rollOutDisplay = round(rollOut / 1000, 3)
        rollOutRaw = roundUp(rollOut / 1000, 3)
    }
    insertHeadingValueRow(table, 'Roll Out (approx)', rollOutDisplay + mOrInches, true, rollOutRaw)
    if (speed) {
        insertHeadingValueRow(table, 'Speed', round(speed, 3) + kmOrMi, true, speed, cadence)
    }
    if (cadence) {
        insertHeadingValueRow(table, 'Cadence', round(cadence, 3) + ' rpm', true, cadence, speed)
    }
    if (lapTime) {
        insertHeadingValueRow(table, 'Lap Time', round(lapTime, 3) + ' sec', true, lapTime, cadence)
    }
    if (lapPedalCount) {
        insertHeadingValueRow(table, 'Lap Pedal Count', round(lapPedalCount, 3))
    }

    return table
}

const buildShareableLink = (shareableLinkURL) => {
    let a = document.createElement('A')
    a.text = 'Shareable link'
    a.title = 'Copy this link to share these Gear Details.'
    a.href = shareableLinkURL
    return a
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

    if (circumfranceApproachHiddenFld.value !== '') {
        circumfranceApproachSelect.value = circumfranceApproachHiddenFld.value
    } else {
        const circumfranceApproachCookie = getCookie('circumfranceApproach')
        if (circumfranceApproachCookie !== '') {
            circumfranceApproachSelect.value = circumfranceApproachCookie
        }
    }

    actOnCircumfranceApproachSelect()

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
    setFieldFromCookieIfBlank(measuredCircumfranceFld, 'measuredCircumfrance')
    setFieldFromCookieIfBlank(crankLengthFld, 'crankLength')

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
