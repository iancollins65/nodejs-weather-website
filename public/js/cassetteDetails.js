const cassetteDetailsForm = document.querySelector('form')
const speedSelect = document.querySelector('#speedSelect')
const cassetteSelect = document.querySelector('#cassetteSelect')
const speedOptionsHiddenFld = document.querySelector('#speedOptionsHidden')
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
const rimTypeOptionsListHiddenFld = document.querySelector('#rimTypeOptionsListHidden')
const rimTypeDescriptionsListHiddenFld = document.querySelector('#rimTypeDescriptionsListHidden')
var chainRingsGlobal = []
var cogsGlobal = []
var responseGlobal = []
var cassetteOptionsGlobal = []

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
    const extras = extrasSelect.value
    const speed = speedFld.value
    const cadence = cadenceFld.value
    const lapTime = lapTimeFld.value
    const lapLength = lapLengthFld.value
    setCookie('chainRings', chainRings, 1)
    setCookie('rimType', rimType, 1)
    var url = '/cassetteInfo?chainRings=' + chainRings + '&cogs=' + cogs 
        + '&rimType=' + rimType + '&extras=' + extras
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
    if (extrasSelect.value === 'speed') {
        setCookie('show', 'speed', 1)
    } else if (extrasSelect.value === 'cadence' || extrasSelect.value === 'cadenceLapTime') {
        setCookie('show', 'cadence', 1)
    }
})

const actOnExtrasSelect = () => {
    const showCookie = getCookie('show')
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
    setCookie('show', show, 1)
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
    const option = document.createElement('option')
    const text = document.createTextNode('Everything (wide)')
    option.appendChild(text)
    option.setAttribute('value', 'everything')
    showSelect.appendChild(option)
    
    const showCookie = getCookie('show')
    if (showCookie !== '') {
        if (selectContains('#showData', showCookie) === true) {
            showSelect.value = showCookie
        } else {
            showSelect.value = 'gearRatio'
        }
    }
}

const buildSpeedSelect = () => {
    while (speedSelect.options.length > 1) {
        speedSelect.remove(1);
    }
    const speedOptionsString = speedOptionsHiddenFld.value
    const speedOptions = speedOptionsString.split(',')
    for (speed of speedOptions) {
        const option = document.createElement('option')
        const text = document.createTextNode(speed)
        option.appendChild(text)
        option.setAttribute('value', speed)
        speedSelect.appendChild(option)
    }
}

speedSelect.addEventListener('change', (e) => {
    setCookie('speedSelect', speedSelect.value)
    setCookie('cassetteSelect', 'none')
    actOnSpeedSelect()
})

const actOnSpeedSelect = () => {
    const speed = speedSelect.value
    if (speed === 'none') {
        buildCassetteSelect()
        return
    }
    var url = '/cassettesBySpeed?speed=' + speed
    fetch(url).then((res) => {
        res.json().then((cassetteOptions) => {
            if (cassetteOptions.error) {
                var errorStr = cassetteOptions.error + '.'
                errorStr = errorStr.replace('speed', 'Speed')
                messageOne.style.color = 'red'
                messageOne.textContent = errorStr
            } else {
                cassetteOptionsGlobal = cassetteOptions
                buildCassetteSelect()
            }
        })
    })
}

const buildCassetteSelect = () => {
    while (cassetteSelect.options.length > 1) {
        cassetteSelect.remove(1);
    }
    if (speedSelect.value !== 'none' && cassetteOptionsGlobal.length > 0) {
        for (cassette of cassetteOptionsGlobal) {
            const option = document.createElement('option')
            const text = document.createTextNode(cassette.name)
            option.appendChild(text)
            option.setAttribute('value', cassette.name)
            cassetteSelect.appendChild(option)
        }
    }
    cassetteSelect.value = 'none'
    const cassetteCookie = getCookie('cassetteSelect')
    if (cassetteCookie !== '') {
        if (selectContains('#cassetteSelect', cassetteCookie) === true) {
            cassetteSelect.value = cassetteCookie
            if (cogsFld.value === '') {
                actOnCassetteSelect()
            }
        }
    }
}

cassetteSelect.addEventListener('change', (e) => {
    setCookie('cassetteSelect', cassetteSelect.value)
    actOnCassetteSelect()
})

const actOnCassetteSelect = () => {
    const cassetteName = cassetteSelect.value
    if (cassetteName === 'none') {
        return
    }
    const cassette = cassetteOptionsGlobal.find((c) => c.name === cassetteName)
    if (cassette) {
        cogsFld.value = cassette.cogsString
    }
}

// Dynamic output table

const buildOutputTable = (chainRings, cogs, cassetteInfo, show) => {

    // Build the table
    var table = document.createElement('table')

    if (show !== 'everything') {
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
                    let cellText = ''
                    if (show === 'gearRatio') {
                        cellText = round(gearInfo.gearRatio, 3)
                    } else if (show === 'gearInches') {
                        cellText = round(gearInfo.gearInches, 3)
                    } else if (show === 'rollOut') {
                        cellText = round(gearInfo.rollOut / 1000, 3) + ' m'
                    } else if (show === 'cadence') {
                        cellText = round(gearInfo.cadence, 3) + ' rpm'
                    } else if (show === 'speed') {
                        cellText = round(gearInfo.speed, 3) + ' km/h'
                    } else if (show === 'lapTime') {
                        cellText = round(gearInfo.lapTime, 3) + ' sec'
                    } else if (show === 'lapPedalCount') {
                        cellText = round(gearInfo.lapPedalCount, 3)
                    }
                    let a = document.createElement('A')
                    a.text = cellText
                    a.title = cellText
                    a.href = linkToGearDetails(extrasSelect.value, chainRing, cog)
                    a.className = 'link-cell'
                    cell.appendChild(a)
                }
            }
        }
    } else { // show everything
        const extras = extrasSelect.value

        // Headings row
        tr = table.insertRow(-1)
        th = document.createElement('th')
        th.innerHTML = 'Gear'
        tr.appendChild(th)
        th = document.createElement('th')
        th.innerHTML = 'Ratio'
        tr.appendChild(th)
        th = document.createElement('th')
        th.innerHTML = 'Inches'
        tr.appendChild(th)
        th = document.createElement('th')
        th.innerHTML = 'Roll Out'
        tr.appendChild(th)
        if (extras === 'cadence') {
            th = document.createElement('th')
            th.innerHTML = 'Cadence'
            tr.appendChild(th)
        } else if (extras === 'speed') {
            th = document.createElement('th')
            th.innerHTML = 'Speed'
            tr.appendChild(th)
        } else if (extras === 'cadenceLapTime') {
            th = document.createElement('th')
            th.innerHTML = 'Cadence'
            tr.appendChild(th)
            th = document.createElement('th')
            th.innerHTML = 'Speed'
            tr.appendChild(th)
            th = document.createElement('th')
            th.innerHTML = 'Lap Pedals'
            tr.appendChild(th)
        }
        if ((extras === 'cadence' || extras === 'speed') && (lapLengthFld.value !== '')) {
            th = document.createElement('th')
            th.innerHTML = 'Lap Time'
            tr.appendChild(th)
            th = document.createElement('th')
            th.innerHTML = 'Lap Pedals'
            tr.appendChild(th)
        }

        // Data rows
        for (gearInfo of cassetteInfo) {
            let tr = table.insertRow(-1)
            // Gear cell as a link
            let gearCell = tr.insertCell(-1)
            let a = document.createElement('A')
            a.text = gearInfo.chainRing + ' x ' + gearInfo.cog
            a.title = 'Chain Ring ' + gearInfo.chainRing + ' Cog ' + gearInfo.cog
            a.href = linkToGearDetails(extras, gearInfo.chainRing, gearInfo.cog)
            gearCell.appendChild(a)
            // Ratio cell
            let ratioCell = tr.insertCell(-1)
            let rawValue = gearInfo.gearRatio
            ratioCell.innerHTML = round(rawValue, 3)
            // Inches cell
            let inchesCell = tr.insertCell(-1)
            rawValue = gearInfo.gearInches
            inchesCell.innerHTML = round(rawValue, 3)
            // Roll Out cell
            let rollOutCell = tr.insertCell(-1)
            rawValue = gearInfo.rollOut
            rollOutCell.innerHTML = round(rawValue / 1000, 3) + ' m'
            // Extras
            if (extras === 'cadence') {
                // Cadence cell
                let cadenceCell = tr.insertCell(-1)
                rawValue = gearInfo.cadence
                cadenceCell.innerHTML = round(rawValue, 3) + ' rpm'
            } else if (extras === 'speed') {
                // Speed cell
                let speedCell = tr.insertCell(-1)
                rawValue = gearInfo.speed
                speedCell.innerHTML = round(rawValue, 3) + ' km/h'
            } else if (extras === 'cadenceLapTime') {
                // Cadence cell
                let cadenceCell = tr.insertCell(-1)
                rawValue = gearInfo.cadence
                cadenceCell.innerHTML = round(rawValue, 3) + ' rpm'
                // Speed cell
                let speedCell = tr.insertCell(-1)
                rawValue = gearInfo.speed
                speedCell.innerHTML = round(rawValue, 3) + ' km/h'
                // Lap Pedals cell
                let lapPedalsCell = tr.insertCell(-1)
                rawValue = gearInfo.lapPedalCount
                lapPedalsCell.innerHTML = round(rawValue, 3)
            }
            if ((extras === 'cadence' || extras === 'speed') && (lapLengthFld.value !== '')) {
                // Lap Time cell
                let lapTimeCell = tr.insertCell(-1)
                rawValue = gearInfo.lapTime
                lapTimeCell.innerHTML = round(rawValue, 3) + ' sec'
                // Lap Pedals cell
                let lapPedalsCell = tr.insertCell(-1)
                rawValue = gearInfo.lapPedalCount
                lapPedalsCell.innerHTML = round(rawValue, 3)
            }
        }
    }

    return table
}

const linkToGearDetails = (extras, chainRing, cog) => {
    let url = '/gearDetails?chainRing=' + chainRing + '&cog=' + cog
    if (tyreWidthFld.value !== '') {
        url = url + '&tyreWidth=' + tyreWidthFld.value
    }
    url = url + '&rimType=' + rimTypeFld.value
    if (extras === 'speed') {
        url = url + '&extras=speedAtCadence&cadence=' + cadenceFld.value
    } else if (extras === 'cadence') {
        url = url + '&extras=cadenceAtSpeed&speed=' + speedFld.value
    } else if (extras === 'cadenceLapTime') {
        url = url + '&extras=cadenceAtLapTime&lapTime=' + lapTimeFld.value + '&lapLength=' + lapLengthFld.value
    }
    if ((extras === 'speed' || extras === 'cadence') && (lapLengthFld.value !== '')) {
        url = url + '&lapLength=' + lapLengthFld.value
    }
    return url
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

const selectContains = (select, value) => {
    const selectObj = document.querySelector(select)
    for (var i = 0; i < selectObj.options.length; i++) {
        if (selectObj.options[i].value === value) {
            return true
        }
    }
    return false
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

// On load

const handleOnLoad = () => {

    buildSpeedSelect()
    speedSelect.value = 'none'
    cassetteSelect.value = 'none'
    const speedCookie = getCookie('speedSelect')
    if (speedCookie !== '') {
        if (selectContains('#speedSelect', speedCookie) === true) {
            speedSelect.value = speedCookie
            actOnSpeedSelect()
        }
    }

    buildRimTypeSelect()

    if (rimTypeHiddenFld.value !== '') {
        rimTypeFld.value = rimTypeHiddenFld.value
    } else {
        const rimTypeCookie = getCookie('rimType')
        if (rimTypeCookie !== '') {
            rimTypeFld.value = rimTypeCookie
        }
    }
    
    setFieldFromCookieIfBlank(chainRingsFld, 'chainRings')
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
    
    if (chainRingsFld.value !== '' && cogsFld.value !== '') {
        handleSubmit()
    }
}

