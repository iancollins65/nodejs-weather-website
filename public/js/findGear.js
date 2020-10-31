const findGearForm = document.querySelector('form')
const findForSelect = document.querySelector('#findFor')
const findForHiddenFld = document.querySelector('#findForHidden')
const gearInchesSection = document.querySelector('#gearInchesSection')
const gearInchesFld = document.querySelector('#gearInches')
const plusOrMinusFld = document.querySelector('#plusOrMinus')
const rollOutSection = document.querySelector('#rollOutSection')
const rollOutFld = document.querySelector('#rollOut')
const maxDiffFld = document.querySelector('#maxDiff')
const speedSection = document.querySelector('#speedSection')
const speedFld = document.querySelector('#speed')
const lapSection = document.querySelector('#lapSection')
const lapTimeFld = document.querySelector('#lapTime')
const lapLengthFld = document.querySelector('#lapLength')
const cadenceSection = document.querySelector('#cadenceSection')
const cadenceFld = document.querySelector('#cadence')
const fixedSection = document.querySelector('#fixedSection')
const fixedFld = document.querySelector('#fixed')
const fixedHiddenFld = document.querySelector('#fixedHidden')
const tyreWidthSection = document.querySelector('#tyreWidthSection')
const tyreWidthFld = document.querySelector('#tyreWidth')
const rimTypeSection = document.querySelector('#rimTypeSection')
const rimTypeFld = document.querySelector('#rimType')
const rimTypeHiddenFld = document.querySelector('#rimTypeHidden')
const minMaxCheckBox = document.querySelector('#minMaxCheckBox')
const showMinMaxHiddenFld = document.querySelector('#showMinMaxHidden')
const minMaxSection = document.querySelector('#minMaxSection')
const minChainRingFld = document.querySelector('#minChainRing')
const maxChainRingFld = document.querySelector('#maxChainRing')
const minCogFld = document.querySelector('#minCog')
const maxCogFld = document.querySelector('#maxCog')
const messageOne = document.querySelector('#message-1')
const outputText = document.querySelector('#outputText')
const outputTable = document.querySelector('#outputTable')
const sortSelectSection = document.querySelector('#sortSelect')
const sortByFld = document.querySelector('#sortBy')
var gearOptionsGlobal = []

rollOutSection.style.display = 'none'
speedSection.style.display = 'none'
lapSection.style.display = 'none'
cadenceSection.style.display = 'none'
fixedSection.style.display = 'none'
tyreWidthSection.style.display = 'none'
rimTypeSection.style.display = 'none'
minMaxSection.style.display = 'none'
messageOne.style.display = 'none'
sortSelectSection.style.display = 'none'
outputText.style.display = 'none'
outputTable.style.display = 'none'

findGearForm.addEventListener('submit', (e) => {
    e.preventDefault()
    handleSubmit()
})

const handleSubmit = () => {
    messageOne.style.display = 'block'
    messageOne.style.color = '#333456'   
    messageOne.textContent = 'Loading...'
    sortSelectSection.style.display = 'none'
    outputText.style.display = 'none'    
    outputTable.style.display = 'none'    

    const findFor = findForSelect.value
    setCookie('findFor', findFor, 1)
    // findForHiddenFld.value = findFor

    if (findFor === 'gearInches') {
        const gearInches = gearInchesFld.value
        const plusOrMinus = plusOrMinusFld.value
        const minChainRing = minChainRingFld.value
        const maxChainRing = maxChainRingFld.value
        const minCog = minCogFld.value
        const maxCog = maxCogFld.value

        var url = '/gearInchesOptions?gearInches=' + gearInches
        if (plusOrMinus !== '') { url = url + "&plusOrMinus=" + plusOrMinus }
        if (minChainRing !== '') { url = url + "&minChainRing=" + minChainRing }
        if (maxChainRing !== '') { url = url + "&maxChainRing=" + maxChainRing }
        if (minCog !== '') { url = url + "&minCog=" + minCog }
        if (maxCog !== '') { url = url + "&maxCog=" + maxCog }

        setCookie('gearInches', gearInches, 1)
        setCookie('plusOrMinus', plusOrMinus, 1)
        setCookie('minChainRing', minChainRing, 1)
        setCookie('maxChainRing', maxChainRing, 1)
        setCookie('minCog', minCog, 1)
        setCookie('maxCog', maxCog, 1)
        // setCookie('rollOut', '', 1)

        fetch(url).then((response) => {
            response.json().then((gearOptions) => {
                if (gearOptions.error) {
                    var errorStr = gearOptions.error + '.'
                    errorStr = errorStr.replace('gearInches', 'Gear Inches')
                    errorStr = errorStr.replace('plusOrMinus', '+/-')
                    errorStr = errorStr.replace('min', 'Min ')
                    errorStr = errorStr.replace('max', 'Max ')
                    errorStr = errorStr.replace('ChainRing', 'Chain Ring')
                    messageOne.style.color = 'red'
                    messageOne.textContent = errorStr
                } else if (gearOptions.length === 0) {
                    messageOne.textContent = 'No gear options found. Please adjust your selections.'
                } else {
                    gearOptionsGlobal = gearOptions
                    messageOne.textContent = 'Your gear options...'
                    buildSortSelect(findFor)
                    sortSelectSection.style.display = 'block'
                    outputTable.style.display = 'block'
                    outputTable.innerHTML = ""
                    outputTable.appendChild(buildOutputTable(findFor, gearOptions))
                    // outputText.style.display = 'block'
                    // outputText.textContent = JSON.stringify(gearOptions)
                }
            })
        })            
    } else if (findFor === 'rollOut') {
        if (rollOutFld.value === '') {
            messageOne.style.color = 'red'
            messageOne.textContent = 'Roll Out is not provided'
            return
        }
        const rollOutMetres = Number(rollOutFld.value)
        if (isNaN(rollOutMetres)) {
            messageOne.style.color = 'red'
            messageOne.textContent = 'Roll Out is not numeric'
            return
        }
        const rollOut = rollOutMetres * 1000
        var maxDiff = 500
        if (maxDiffFld.value !== '') {
            const maxDiffMetres = Number(maxDiffFld.value)
            if (isNaN(maxDiffMetres)) {
                messageOne.style.color = 'red'
                messageOne.textContent = 'Within is not numeric'
                return
            } else {
                maxDiff = maxDiffMetres * 1000
            }
        }
        const tyreWidth = tyreWidthFld.value
        const rimType = rimTypeFld.value
        const minChainRing = minChainRingFld.value
        const maxChainRing = maxChainRingFld.value
        const minCog = minCogFld.value
        const maxCog = maxCogFld.value

        var url = '/rollOutOptions?rollOut=' + rollOut + '&maxDiff=' + maxDiff + '&rimType=' + rimType
        if (tyreWidth !== '') { url = url + '&tyreWidth=' + tyreWidth }
        if (minChainRing !== '') { url = url + "&minChainRing=" + minChainRing }
        if (maxChainRing !== '') { url = url + "&maxChainRing=" + maxChainRing }
        if (minCog !== '') { url = url + "&minCog=" + minCog }
        if (maxCog !== '') { url = url + "&maxCog=" + maxCog }

        setCookie('rollOut', rollOut / 1000, 1)
        setCookie('maxDiff', maxDiff / 1000, 1)
        setCookie('tyreWidth', tyreWidth, 1)
        setCookie('rimType', rimType, 1)
        setCookie('minChainRing', minChainRing, 1)
        setCookie('maxChainRing', maxChainRing, 1)
        setCookie('minCog', minCog, 1)
        setCookie('maxCog', maxCog, 1)
        // setCookie('gearInches', '', 1)
        // rimTypeHiddenFld.value = rimType

        fetch(url).then((response) => {
            response.json().then((gearOptions) => {
                if (gearOptions.error) {
                    var errorStr = gearOptions.error + '.'
                    errorStr = errorStr.replace('rollOut', 'Roll Out')
                    errorStr = errorStr.replace('maxDiff', 'to -')
                    errorStr = errorStr.replace('tyreWidth', 'Tyre Width')
                    errorStr = errorStr.replace('rimType', 'Rim Type')
                    errorStr = errorStr.replace('min', 'Min ')
                    errorStr = errorStr.replace('max', 'Max ')
                    errorStr = errorStr.replace('ChainRing', 'Chain Ring')
                    messageOne.style.color = 'red'
                    messageOne.textContent = errorStr
                } else if (gearOptions.length === 0) {
                    messageOne.textContent = 'No gear options found. Please adjust your selections.'
                } else {
                    gearOptionsGlobal = gearOptions
                    messageOne.textContent = 'Your gear options...'
                    buildSortSelect(findFor)
                    sortSelectSection.style.display = 'block'
                    outputTable.style.display = 'block'
                    outputTable.innerHTML = ""
                    outputTable.appendChild(buildOutputTable(findFor, gearOptions))
                    // outputText.style.display = 'block'
                    // outputText.textContent = JSON.stringify(gearOptions)
                }
            })
        })            
    } else if (findFor === 'speedCadence') {
        const speed = speedFld.value
        const cadence = cadenceFld.value
        const fixed = fixedFld.value
        const tyreWidth = tyreWidthFld.value
        const rimType = rimTypeFld.value
        const minChainRing = minChainRingFld.value
        const maxChainRing = maxChainRingFld.value
        const minCog = minCogFld.value
        const maxCog = maxCogFld.value

        var url = '/speedCadenceOptions?speed=' + speed + '&cadence=' + cadence + '&fixed=' + fixed + 
            '&rimType=' + rimType
        if (tyreWidth !== '') { url = url + '&tyreWidth=' + tyreWidth }
        if (minChainRing !== '') { url = url + "&minChainRing=" + minChainRing }
        if (maxChainRing !== '') { url = url + "&maxChainRing=" + maxChainRing }
        if (minCog !== '') { url = url + "&minCog=" + minCog }
        if (maxCog !== '') { url = url + "&maxCog=" + maxCog }

        setCookie('speed', speed, 1)
        setCookie('cadence', cadence, 1)
        setCookie('fixed', fixed, 1)
        setCookie('tyreWidth', tyreWidth, 1)
        setCookie('rimType', rimType, 1)
        setCookie('minChainRing', minChainRing, 1)
        setCookie('maxChainRing', maxChainRing, 1)
        setCookie('minCog', minCog, 1)
        setCookie('maxCog', maxCog, 1)
        // setCookie('gearInches', '', 1) // ??? needed
        // setCookie('rollOut', '', 1) // ??? needed
        // rimTypeHiddenFld.value = rimType

        fetch(url).then((response) => {
            response.json().then((gearOptions) => {
                if (gearOptions.error) {
                    var errorStr = gearOptions.error + '.'
                    errorStr = errorStr.replace('speed', 'Speed')
                    errorStr = errorStr.replace('cadence', 'Cadence')
                    errorStr = errorStr.replace('fixed', 'Fixed')
                    errorStr = errorStr.replace('tyreWidth', 'Tyre Width')
                    errorStr = errorStr.replace('rimType', 'Rim Type')
                    errorStr = errorStr.replace('min', 'Min ')
                    errorStr = errorStr.replace('max', 'Max ')
                    errorStr = errorStr.replace('ChainRing', 'Chain Ring')
                    messageOne.style.color = 'red'
                    messageOne.textContent = errorStr
                } else if (gearOptions.length === 0) {
                    messageOne.textContent = 'No gear options found. Please adjust your selections.'
                } else {
                    gearOptionsGlobal = gearOptions
                    messageOne.textContent = 'Your gear options...'
                    buildSortSelect(findFor)
                    sortSelectSection.style.display = 'block'
                    outputTable.style.display = 'block'
                    outputTable.innerHTML = ""
                    outputTable.appendChild(buildOutputTable(findFor, gearOptions))
                    // outputText.style.display = 'block'
                    // outputText.textContent = JSON.stringify(gearOptions)
                }
            })
        }) 
    } else if (findFor === 'lapTimeCadence') {
        const lapTime = lapTimeFld.value
        const lapLength = lapLengthFld.value
        const cadence = cadenceFld.value
        const tyreWidth = tyreWidthFld.value
        const rimType = rimTypeFld.value
        const minChainRing = minChainRingFld.value
        const maxChainRing = maxChainRingFld.value
        const minCog = minCogFld.value
        const maxCog = maxCogFld.value

        var url = '/lapTimeCadenceOptions?lapTime=' + lapTime + '&lapLength=' + lapLength + 
            '&cadence=' + cadence + '&rimType=' + rimType
        if (tyreWidth !== '') { url = url + '&tyreWidth=' + tyreWidth }
        if (minChainRing !== '') { url = url + "&minChainRing=" + minChainRing }
        if (maxChainRing !== '') { url = url + "&maxChainRing=" + maxChainRing }
        if (minCog !== '') { url = url + "&minCog=" + minCog }
        if (maxCog !== '') { url = url + "&maxCog=" + maxCog }

        setCookie('lapTime', lapTime, 1)
        setCookie('lapLength', lapLength, 1)
        setCookie('cadence', cadence, 1)
        setCookie('tyreWidth', tyreWidth, 1)
        setCookie('rimType', rimType, 1)
        setCookie('minChainRing', minChainRing, 1)
        setCookie('maxChainRing', maxChainRing, 1)
        setCookie('minCog', minCog, 1)
        setCookie('maxCog', maxCog, 1)
        // setCookie('gearInches', '', 1) // ??? needed
        // setCookie('rollOut', '', 1) // ??? needed
        // rimTypeHiddenFld.value = rimType

        fetch(url).then((response) => {
            response.json().then((gearOptions) => {
                if (gearOptions.error) {
                    var errorStr = gearOptions.error + '.'
                    errorStr = errorStr.replace('lapTime', 'Lap Time')
                    errorStr = errorStr.replace('lapLength', 'Lap Length')
                    errorStr = errorStr.replace('cadence', 'Cadence')
                    errorStr = errorStr.replace('tyreWidth', 'Tyre Width')
                    errorStr = errorStr.replace('rimType', 'Rim Type')
                    errorStr = errorStr.replace('min', 'Min ')
                    errorStr = errorStr.replace('max', 'Max ')
                    errorStr = errorStr.replace('ChainRing', 'Chain Ring')
                    messageOne.style.color = 'red'
                    messageOne.textContent = errorStr
                } else if (gearOptions.length === 0) {
                    messageOne.textContent = 'No gear options found. Please adjust your selections.'
                } else {
                    gearOptionsGlobal = gearOptions
                    messageOne.textContent = 'Your gear options...'
                    buildSortSelect(findFor)
                    sortSelectSection.style.display = 'block'
                    outputTable.style.display = 'block'
                    outputTable.innerHTML = ""
                    outputTable.appendChild(buildOutputTable(findFor, gearOptions))
                    // outputText.style.display = 'block'
                    // outputText.textContent = JSON.stringify(gearOptions)
                }
            })
        }) 
    }
}

findGearForm.addEventListener('input', (e) => {
    if (e.target !== minMaxCheckBox) {
        messageOne.style.display = 'none'
        sortSelectSection.style.display = 'none'
        outputText.style.display = 'none'
        outputTable.style.display = 'none'
    }
})

minMaxCheckBox.addEventListener('input', (e) => {
    actOnShowMinMaxSet()
})

const actOnShowMinMaxSet = () => {
    if (minMaxCheckBox.checked === true) {
        minMaxSection.style.display = 'block'
        // showMinMaxHiddenFld.value = 'yes'
        setCookie('showMinMax', 'yes', 1)
    } else {
        minMaxSection.style.display = 'none'
        // showMinMaxHiddenFld.value = 'no'
        setCookie('showMinMax', 'no', 1)
    }
    // setCookie('showMinMax', showMinMaxHiddenFld.value, 1)
}

findForSelect.addEventListener('change', (e) => {
    actOnFindForSelection()
    findForHiddenFld.value = ''
})

const actOnFindForSelection = () => {
    if (findForSelect.value === 'gearInches') {
        // rollOut.value = ''
        // tyreWidth.value = ''
        gearInchesSection.style.display = 'block'
        rollOutSection.style.display = 'none'
        speedSection.style.display = 'none'
        lapSection.style.display = 'none'
        cadenceSection.style.display = 'none'
        fixedSection.style.display = 'none'
        tyreWidthSection.style.display = 'none'
        rimTypeSection.style.display = 'none'
    } else if (findForSelect.value === 'rollOut') {
        // gearInches.value = ''
        gearInchesSection.style.display = 'none'
        rollOutSection.style.display = 'block'
        speedSection.style.display = 'none'
        lapSection.style.display = 'none'
        cadenceSection.style.display = 'none'
        fixedSection.style.display = 'none'
        tyreWidthSection.style.display = 'block'
        rimTypeSection.style.display = 'block'
    } else if (findForSelect.value === 'speedCadence') {
        gearInchesSection.style.display = 'none'
        rollOutSection.style.display = 'none'
        speedSection.style.display = 'block'
        lapSection.style.display = 'none'
        cadenceSection.style.display = 'block'
        fixedSection.style.display = 'block'
        tyreWidthSection.style.display = 'block'
        rimTypeSection.style.display = 'block'
    } else if (findForSelect.value === 'lapTimeCadence') {
        gearInchesSection.style.display = 'none'
        rollOutSection.style.display = 'none'
        speedSection.style.display = 'none'
        lapSection.style.display = 'block'
        cadenceSection.style.display = 'block'
        fixedSection.style.display = 'none'
        tyreWidthSection.style.display = 'block'
        rimTypeSection.style.display = 'block'
    }
}

sortByFld.addEventListener('change', (e) => {
    const findFor = findForSelect.value
    outputTable.innerHTML = ""
    outputTable.appendChild(buildOutputTable(findFor, gearOptionsGlobal))
})

const buildSortSelect = (findFor) => {
    while (sortByFld.options.length > 0) {
        sortByFld.remove(0);
    }
    if (findFor === 'gearInches') {
        const option1 = document.createElement('option')
        const text1 = document.createTextNode('Closest to ' + gearInchesFld.value)
        option1.appendChild(text1)
        option1.setAttribute('value', 'closestGearInches')
        sortByFld.appendChild(option1)
        const option2 = document.createElement('option')
        const text2 = document.createTextNode('Gear Inches (asc)')
        option2.appendChild(text2)
        option2.setAttribute('value', 'gearInches')
        sortByFld.appendChild(option2)
    } else if (findFor === 'rollOut') {
        const option1 = document.createElement('option')
        const text1 = document.createTextNode('Closest to ' + rollOutFld.value)
        option1.appendChild(text1)
        option1.setAttribute('value', 'closestRollOut')
        sortByFld.appendChild(option1)
    }
    const optionx = document.createElement('option')
    const textx = document.createTextNode('Chain Ring (asc)')
    optionx.appendChild(textx)
    optionx.setAttribute('value', 'chainRing')
    sortByFld.appendChild(optionx)
    if (findFor === 'speedCadence') {
        if (fixedFld.value === 'cadence') {
            const option1 = document.createElement('option')
            const text1 = document.createTextNode('Speed (asc)')
            option1.appendChild(text1)
            option1.setAttribute('value', 'speed')
            sortByFld.appendChild(option1)
        } else if (fixedFld.value === 'speed') {
            const option1 = document.createElement('option')
            const text1 = document.createTextNode('Cadence (asc)')
            option1.appendChild(text1)
            option1.setAttribute('value', 'cadence')
            sortByFld.appendChild(option1)
        }
    } else if (findFor === 'lapTimeCadence') {
        const option1 = document.createElement('option')
        const text1 = document.createTextNode('Cadence (asc)')
        option1.appendChild(text1)
        option1.setAttribute('value', 'cadence')
        sortByFld.appendChild(option1)
    }

    // Set value based on cookie, if it is available
    const sortBy = getCookie('sortBy')
    if (sortBy !== '') {
        if (sortBy === 'chainRing') {
            sortByFld.value = 'chainRing'
        } else if (sortBy === 'gearInches' && findFor === 'gearInches') {
            sortByFld.value = 'gearInches'
        } else if (sortBy === 'closestGearInches' && findFor === 'gearInches') {
            sortByFld.value = 'closestGearInches'
        } else if (sortBy === 'closestRollOut' && findFor === 'rollOut') {
            sortByFld.value = 'closestRollOut'
        } else if (findFor === 'gearInches') {
            sortByFld.value = 'closestGearInches'
        } else if (findFor === 'rollOut') {
            sortByFld.value = 'closestRollOut'
        } else if ((sortBy === 'speed') && (findFor === 'speedCadence' || findFor === 'lapTimeCadence')) {
            sortByFld.value = 'speed'
        } else if ((sortBy === 'cadence') && (findFor === 'speedCadence')) {
            sortByFld.value = 'cadence'
        } else {
            sortByFld.value = 'chainRing'
        }
    } else if (findFor === 'gearInches') {
        sortByFld.value = 'closestGearInches'
    } else if (findFor === 'rollOut') {
        sortByFld.value = 'closestRollOut'
    } else {
        sortByFld.value = 'chainRing'
    }
}

const buildOutputTable = (findFor, gearOptions) => {
    // Sort gearOptions
    if (sortByFld.value === 'gearInches' && findFor === 'gearInches') {
        gearOptions.sort((a, b) => (a.gearInches >= b.gearInches) ? 1 : -1)
    } else if (sortByFld.value === 'chainRing') {
        gearOptions.sort((a, b) => (a.chainRing >= b.chainRing) ? 1 : -1)
    } else if (sortByFld.value === 'closestGearInches' && findFor === 'gearInches') {
        gearOptions.sort((a, b) => (a.diff >= b.diff) ? 1 : -1)
    } else if (sortByFld.value === 'closestRollOut' && findFor === 'rollOut') {
        gearOptions.sort((a, b) => (a.rollOut <= b.rollOut) ? 1 : -1)
    } else if (findFor === 'gearInches') {
        gearOptions.sort((a, b) => (a.diff >= b.diff) ? 1 : -1)
        sortByFld.value = 'closestGearInches'
    } else if (findFor === 'rollOut') {
        gearOptions.sort((a, b) => (a.rollOut <= b.rollOut) ? 1 : -1)
        sortByFld.value = 'closestRollOut'
    } else if ((sortByFld.value === 'speed') && (findFor === 'speedCadence')) {
        gearOptions.sort((a, b) => (a.speed >= b.speed) ? 1 : -1)
    } else if (sortByFld.value === 'cadence') {
        gearOptions.sort((a, b) => (a.cadence >= b.cadence) ? 1 : -1)
    } else {
        gearOptions.sort((a, b) => (a.chainRing >= b.chainRing) ? 1 : -1)
        sortByFld.value = 'chainRing'
    }
    setCookie('sortBy', sortByFld.value, 1)

    // Build the table
    var table = document.createElement('table')

    if (findFor === 'gearInches') {
        // Create header row
        let tr = table.insertRow(-1)
        let th = document.createElement('th')
        th.innerHTML = 'Gear'
        tr.appendChild(th)
        th = document.createElement('th')
        th.innerHTML = 'Gear Inches'
        tr.appendChild(th)

        // Create data rows
        for (gearOption of gearOptions) {
            let tr = table.insertRow(-1)
            // Gear cell as a link
            let gearCell = tr.insertCell(-1)
            let a = document.createElement('A')
            a.text = gearOption.chainRing + ' x ' + gearOption.cog
            a.title = 'Chain Ring ' + gearOption.chainRing + ' Cog ' + gearOption.cog
            a.href = linkToGearDetails(findFor, gearOption.chainRing, gearOption.cog)
            // a.onclick = 'gearLink()' Doesn't seem to work
            gearCell.appendChild(a)
            // Gear Inches cell
            let gearInchesCell = tr.insertCell(-1)
            let rawValue = gearOption.gearInches
            gearInchesCell.innerHTML = round(rawValue, 3)
        }    
    } else if (findFor === 'rollOut') {
        // Create header row
        let tr = table.insertRow(-1)
        let th = document.createElement('th')
        th.innerHTML = 'Gear'
        tr.appendChild(th)
        th = document.createElement('th')
        th.innerHTML = 'Roll Out'
        tr.appendChild(th)
        th = document.createElement('th')
        th.innerHTML = 'Gear Inches'
        tr.appendChild(th)

        // Create data rows
        for (gearOption of gearOptions) {
            let tr = table.insertRow(-1)
            // Gear cell as a link
            let gearCell = tr.insertCell(-1)
            let a = document.createElement('A')
            a.text = gearOption.chainRing + ' x ' + gearOption.cog
            a.title = 'Chain Ring ' + gearOption.chainRing + ' Cog ' + gearOption.cog
            a.href = linkToGearDetails(findFor, gearOption.chainRing, gearOption.cog)
            // a.onclick = 'gearLink()' Doesn't seem to work
            gearCell.appendChild(a)
            // Roll Out cell
            let rollOutCell = tr.insertCell(-1)
            let rawValue = (gearOption.rollOut / 1000)
            rollOutCell.innerHTML = round(rawValue, 3) + ' m'
            // Gear Inches cell
            let gearInchesCell = tr.insertCell(-1)
            rawValue = gearOption.gearInches
            gearInchesCell.innerHTML = round(rawValue, 3)
        }
    } else if ((findFor === 'speedCadence') || (findFor === 'lapTimeCadence')) {
        // Create header row
        let tr = table.insertRow(-1)
        let th = document.createElement('th')
        th.innerHTML = 'Gear'
        tr.appendChild(th)
        th = document.createElement('th')
        th.innerHTML = 'Speed'
        tr.appendChild(th)
        th = document.createElement('th')
        th.innerHTML = 'Cadence'
        tr.appendChild(th)

        // Create data rows
        for (gearOption of gearOptions) {
            let tr = table.insertRow(-1)
            // Gear cell as a link
            let gearCell = tr.insertCell(-1)
            let a = document.createElement('A')
            a.text = gearOption.chainRing + ' x ' + gearOption.cog
            a.title = 'Chain Ring ' + gearOption.chainRing + ' Cog ' + gearOption.cog
            a.href = linkToGearDetails(findFor, gearOption.chainRing, gearOption.cog)
            // a.onclick = 'gearLink()' Doesn't seem to work
            gearCell.appendChild(a)
            // Speed cell
            let speedCell = tr.insertCell(-1)
            let rawValue = gearOption.speed
            speedCell.innerHTML = round(rawValue, 3) + ' km/h'
            // Cadence cell
            let cadenceCell = tr.insertCell(-1)
            rawValue = gearOption.cadence
            cadenceCell.innerHTML = round(rawValue, 3) + ' rpm'
        }
    }

    return table
}

const linkToGearDetails = (findFor, chainRing, cog) => {
    let url = '/gearDetails?chainRing=' + chainRing + '&cog=' + cog
    if ((findFor === 'rollOut') || (findFor === 'speedCadence') || (findFor === 'lapTimeCadence')) {
        if (tyreWidthFld.value !== '') {
            url = url + '&tyreWidth=' + tyreWidthFld.value
        }
        url = url + '&rimType=' + rimTypeFld.value
    }
    if (findFor === 'speedCadence' && fixedFld.value === 'cadence') {
        url = url + '&extras=speedAtCadence&cadence=' + cadenceFld.value
    } else if (findFor === 'speedCadence' && fixedFld.value === 'speed') {
        url = url + '&extras=cadenceAtSpeed&speed=' + speedFld.value
    } else if (findFor === 'lapTimeCadence') {
        url = url + '&extras=cadenceAtLapTime&lapTime=' + lapTimeFld.value + '&lapLength=' + lapLengthFld.value
    }
    return url
}

const applyMinMaxCookies = () => {
    const minChainRing = getCookie('minChainRing')
    if (minChainRing !== '') {
        minChainRingFld.value = minChainRing
    }
    const maxChainRing = getCookie('maxChainRing')
    if (maxChainRing !== '') {
        maxChainRingFld.value = maxChainRing
    }
    const minCog = getCookie('minCog')
    if (minCog !== '') {
        minCogFld.value = minCog
    }
    const maxCog = getCookie('maxCog')
    if (maxCog !== '') {
        maxCogFld.value = maxCog
    }
}

const clearCookies = () => {
    setCookie('findFor', '', 1)
    setCookie('gearInches', '', 1)
    setCookie('plusOrMinus', '', 1)
    setCookie('rollOut', '', 1)
    setCookie('maxDiff', '', 1)
    setCookie('speed', '', 1)
    setCookie('cadence', '', 1)
    setCookie('fixed', '', 1)
    setCookie('lapTime', '', 1)
    setCookie('lapLength', '', 1)
    setCookie('tyreWidth', '', 1)
    setCookie('rimType', '', 1)
    setCookie('minChainRing', '', 1)
    setCookie('maxChainRing', '', 1)
    setCookie('minCog', '', 1)
    setCookie('maxCog', '', 1)
    setCookie('showMinMax', '', 1)
    return 'done'
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

// On load

const handleOnLoad = () => {
    // console.log(document.cookie)

    if (rimTypeHiddenFld.value !== '') {
        rimTypeFld.value = rimTypeHiddenFld.value
    }
    
    if (showMinMaxHiddenFld.value !== '') {
        minMaxCheckBox.checked = Boolean(showMinMaxHiddenFld.value === 'yes')
        actOnShowMinMaxSet()
    } else {
        const showMinMax = getCookie('showMinMax')
        if (showMinMax !== '') {
            minMaxCheckBox.checked = Boolean(showMinMax === 'yes')
            actOnShowMinMaxSet()
        }
    }
    
    if (findForHiddenFld.value !== '') {
        // Use values provided in the query string / fields
        findForSelect.value = findForHiddenFld.value
        actOnFindForSelection()
        if (findForSelect.value === 'gearInches' && gearInchesFld.value !== '') {
            handleSubmit()
        } else if (findForSelect.value === 'rollOut' && rollOutFld.value !== '') {
            handleSubmit()
        } else if (findForSelect.value === 'speedCadence' && speedFld.value !== '' 
                    && cadenceFld.value !== '') {
            if (fixedHiddenFld.value !== '') {
                if (fixedHiddenFld.value === 'cadence' || fixedHiddenFld.value === 'speed') {
                    fixedFld.value = fixedHiddenFld.value
                }
            }
            handleSubmit()
        } else if (findForSelect.value === 'lapTimeCadence' && lapTimeFld.value !== '' 
                    && lapLengthFld.value !== '' && cadenceFld.value !== '') {
            handleSubmit()
        }
    // } else if (gearInchesFld.value !== '') {
    //     handleSubmit()
    } else {
        // Use cookies if they have been set
        const findFor = getCookie('findFor')
        if (findFor === 'gearInches') {
            const gearInches = getCookie('gearInches')
            if (gearInches !== '') {
                findForSelect.value = 'gearInches'
                actOnFindForSelection()
                gearInchesFld.value = gearInches
                const plusOrMinus = getCookie('plusOrMinus')
                if (plusOrMinus !== '') {
                    plusOrMinusFld.value = plusOrMinus
                }
                applyMinMaxCookies()
                handleSubmit()
            }
        } else if (findFor === 'rollOut') {
            const rollOut = getCookie('rollOut')
            if (rollOut !== '') {
                findForSelect.value = 'rollOut'
                actOnFindForSelection()
                rollOutFld.value = rollOut
                const maxDiff = getCookie('maxDiff')
                if (maxDiff !== '') {
                    maxDiffFld.value = maxDiff
                }
                const tyreWidth = getCookie('tyreWidth')
                if (tyreWidth !== '') {
                    tyreWidthFld.value = tyreWidth
                }
                const rimType = getCookie('rimType')
                if (rimType !== '') {
                    rimTypeFld.value = rimType
                }
                applyMinMaxCookies()
                handleSubmit()
            }
        } else if (findFor === 'speedCadence') {
            const speed = getCookie('speed')
            const cadence = getCookie('cadence')
            if (speed !== '' && cadence !== '') {
                findForSelect.value = 'speedCadence'
                actOnFindForSelection()
                speedFld.value = speed
                cadenceFld.value = cadence
                const fixed = getCookie('fixed')
                if (fixed !== '') {
                    fixedFld.value = fixed
                }
                const tyreWidth = getCookie('tyreWidth')
                if (tyreWidth !== '') {
                    tyreWidthFld.value = tyreWidth
                }
                const rimType = getCookie('rimType')
                if (rimType !== '') {
                    rimTypeFld.value = rimType
                }
                applyMinMaxCookies()
                handleSubmit()
            }
        } else if (findFor === 'lapTimeCadence') {
            const lapTime = getCookie('lapTime')
            const lapLength = getCookie('lapLength')
            const cadence = getCookie('cadence')
            if (lapTime !== '' && lapLength !== '' && cadence !== '') {
                findForSelect.value = 'lapTimeCadence'
                actOnFindForSelection()
                lapTimeFld.value = lapTime
                lapLengthFld.value = lapLength
                cadenceFld.value = cadence
                const tyreWidth = getCookie('tyreWidth')
                if (tyreWidth !== '') {
                    tyreWidthFld.value = tyreWidth
                }
                const rimType = getCookie('rimType')
                if (rimType !== '') {
                    rimTypeFld.value = rimType
                }
                applyMinMaxCookies()
                handleSubmit()
            }
        }
    }
    // setCookie('lastAction', 'loadedPage', 1)
    // console.log(document.cookie)
}
