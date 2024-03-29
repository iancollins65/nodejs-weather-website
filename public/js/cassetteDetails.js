const cassetteDetailsForm = document.querySelector('form')
const speedSelect = document.querySelector('#speedSelect')
const cassetteSelect = document.querySelector('#cassetteSelect')
const speedOptionsHiddenFld = document.querySelector('#speedOptionsHidden')
const chainRingsFld = document.querySelector('#chainRings')
const cogsFld = document.querySelector('#cogs')
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
const showSection = document.querySelector('#showSection')
const showSelect = document.querySelector('#showData')
const outputTable = document.querySelector('#outputTable')
const shareableLink = document.querySelector('#shareableLink')
const rimTypeOptionsListHiddenFld = document.querySelector('#rimTypeOptionsListHidden')
const rimTypeDescriptionsListHiddenFld = document.querySelector('#rimTypeDescriptionsListHidden')
var chainRingsGlobal = []
var cogsGlobal = []
var responseGlobal = []
var cassetteOptionsGlobal = []

measuredCircumfranceSection.style.display = 'none'
speedSection.style.display = 'none'
cadenceSection.style.display = 'none'
lapTimeSection.style.display = 'none'
lapLengthSection.style.display = 'none'
messageOne.style.display = 'none'
showSection.style.display = 'none'
outputTable.style.display = 'none'
shareableLink.style.display = 'none'

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
    shareableLink.style.display = 'none'

    const measure = measureSelect.value
    const chainRings = chainRingsFld.value
    const cogs = cogsFld.value
    const circumfranceApproach = circumfranceApproachSelect.value
    const tyreWidth = tyreWidthFld.value
    const rimType = rimTypeFld.value
    const measuredCircumfrance = measuredCircumfranceFld.value
    const crankLength = crankLengthFld.value
    const extras = extrasSelect.value
    const speed = speedFld.value
    const cadence = cadenceFld.value
    const lapTime = lapTimeFld.value
    const lapLength = lapLengthFld.value
    setCookie('measure', measure, 1)
    setCookie('chainRings', chainRings, 1)
    setCookie('circumfranceApproach', circumfranceApproach, 1)
    setCookie('rimType', rimType, 1)
    //var url = 'chainRings=' + chainRings + '&cogs=' + cogs 
    //    + '&rimType=' + rimType + '&extras=' + extras + '&measure=' + measure  
    //    + '&circumfranceApproach=' + circumfranceApproach
    var url = 'chainRings=' + chainRings + '&cogs=' + cogs 
        + '&rimType=' + rimType + '&measure=' + measure  
        + '&circumfranceApproach=' + circumfranceApproach
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

    var shareableLinkURL = '/cassetteDetails?' + url
    if (extrasSelect.value === 'none') {
        shareableLinkURL = shareableLinkURL + '&extras=none'
    } else if (extrasSelect.value === 'cadence') {
        shareableLinkURL = shareableLinkURL + '&extras=cadenceAtSpeed'
    } else if (extrasSelect.value === 'speed') {
        shareableLinkURL = shareableLinkURL + '&extras=speedAtCadence'
    } else if (extrasSelect.value === 'cadenceLapTime') {
        shareableLinkURL = shareableLinkURL + '&extras=cadenceAtLapTime'
    }

    url = '/cassetteInfo?' + url + '&extras=' + extras 

    fetch(url).then((res) => {
        res.json().then(({ error, request, response }) => {
            if (error) {
                var errorStr = error + '.'
                errorStr = errorStr.replace('chainRings', 'Chain Rings')
                errorStr = errorStr.replace('cogs', 'Cogs')
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
                shareableLink.style.display = 'none'
            } else {
                messageOne.textContent = 'Your cassette details...'
                buildShowSelect()
                showSection.style.display = 'block'
                outputTable.style.display = 'block'
                outputTable.innerHTML = ""
                outputTable.appendChild(buildOutputTable(request.chainRings, request.cogs, response, showSelect.value, measure))
                shareableLink.style.display = 'block'
                shareableLink.innerHTML = ""
                shareableLink.appendChild(buildShareableLink(shareableLinkURL))
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

showSelect.addEventListener('change', (e) => {
    const show = showSelect.value
    const measure = measureSelect.value
    setCookie('show', show, 1)
    outputTable.innerHTML = ""
    outputTable.appendChild(buildOutputTable(chainRingsGlobal, cogsGlobal, responseGlobal, show, measure))
})

const buildShowSelect = () => {
    while (showSelect.options.length > 5) {
        showSelect.remove(5);
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

const buildOutputTable = (chainRings, cogs, cassetteInfo, show, measure) => {

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
                    } else if (show === 'trueGearInches') {
                        cellText = round(gearInfo.trueGearInches, 3)
                    } else if (show === 'rollOut') {
                        let rollOutDisplay = undefined
                        if (measure === 'imperial') {
                            rollOutDisplay = round(gearInfo.rollOut, 3)
                        } else { // 'metric'
                            rollOutDisplay = round(gearInfo.rollOut / 1000, 3)
                        }
                        cellText = rollOutDisplay + mOrInches
                    } else if (show === 'gainRatio') {
                        cellText = round(gearInfo.gainRatio, 3)
                    } else if (show === 'cadence') {
                        cellText = round(gearInfo.cadence, 3) + ' rpm'
                    } else if (show === 'speed') {
                        cellText = round(gearInfo.speed, 3) + kmOrMi
                    } else if (show === 'lapTime') {
                        cellText = round(gearInfo.lapTime, 3) + ' sec'
                    } else if (show === 'lapPedalCount') {
                        cellText = round(gearInfo.lapPedalCount, 3)
                    }
                    let a = document.createElement('A')
                    a.text = cellText
                    a.title = cellText
                    a.href = linkToGearDetails(extrasSelect.value, chainRing, cog, measure)
                    // a.className = 'link-cell' // Decided to return to standard link behaviour.
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
        th.innerHTML = 'Inch (27)'
        tr.appendChild(th)
        th = document.createElement('th')
        th.innerHTML = 'Inch (True)'
        tr.appendChild(th)
        th = document.createElement('th')
        th.innerHTML = 'Roll Out'
        tr.appendChild(th)
        th = document.createElement('th')
        th.innerHTML = 'Gain Ratio'
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
            a.href = linkToGearDetails(extras, gearInfo.chainRing, gearInfo.cog, measure)
            gearCell.appendChild(a)
            // Ratio cell
            let ratioCell = tr.insertCell(-1)
            let rawValue = gearInfo.gearRatio
            ratioCell.innerHTML = round(rawValue, 3)
            // Inches (27) cell
            let inchesCell = tr.insertCell(-1)
            rawValue = gearInfo.gearInches
            inchesCell.innerHTML = round(rawValue, 3)
            // Inches (True) cell
            let trueInchesCell = tr.insertCell(-1)
            rawValue = gearInfo.trueGearInches
            trueInchesCell.innerHTML = round(rawValue, 3)
            // Roll Out cell
            let rollOutCell = tr.insertCell(-1)
            let rollOutDisplay = undefined
            if (measure === 'imperial') {
                rollOutDisplay = round(gearInfo.rollOut, 3)
            } else { // 'metric'
                rollOutDisplay = round(gearInfo.rollOut / 1000, 3)
            }
            rollOutCell.innerHTML = rollOutDisplay + mOrInches
            // Gain Ratio cell
            let gainRatioCell = tr.insertCell(-1)
            rawValue = gearInfo.gainRatio
            gainRatioCell.innerHTML = round(rawValue, 3)
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
                speedCell.innerHTML = round(rawValue, 3) + kmOrMi
            } else if (extras === 'cadenceLapTime') {
                // Cadence cell
                let cadenceCell = tr.insertCell(-1)
                rawValue = gearInfo.cadence
                cadenceCell.innerHTML = round(rawValue, 3) + ' rpm'
                // Speed cell
                let speedCell = tr.insertCell(-1)
                rawValue = gearInfo.speed
                speedCell.innerHTML = round(rawValue, 3) + kmOrMi
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

const linkToGearDetails = (extras, chainRing, cog, measure = 'metric') => {
    let url = '/gearDetails?chainRing=' + chainRing + '&cog=' + cog + '&measure=' + measure
    url = url + '&circumfranceApproach=' + circumfranceApproachSelect.value
    if (circumfranceApproachSelect.value === 'estimated') {
        if (tyreWidthFld.value !== '') {
            url = url + '&tyreWidth=' + tyreWidthFld.value
        }
        url = url + '&rimType=' + rimTypeFld.value
    } else if (circumfranceApproachSelect.value === 'measured') {
        if (measuredCircumfranceFld.value !== '') {
            url = url + '&measuredCircumfrance=' + measuredCircumfranceFld.value
        }
    }
    if (crankLengthFld.value !== '') {
        url = url + '&crankLength=' + crankLengthFld.value
    }
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

const buildShareableLink = (shareableLinkURL) => {
    let a = document.createElement('A')
    a.text = 'Shareable link'
    a.title = 'Copy this link to share these Cassette Details.'
    a.href = shareableLinkURL
    return a
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
    
    setFieldFromCookieIfBlank(chainRingsFld, 'chainRings')
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
    
    if (chainRingsFld.value !== '' && cogsFld.value !== '') {
        handleSubmit()
    }
}
