const findGearForm = document.querySelector('form')
const findForSelect = document.querySelector('#findFor')
const gearInchesSection = document.querySelector('#gearInchesSection')
const gearInchesFld = document.querySelector('#gearInches')
const plusOrMinusFld = document.querySelector('#plusOrMinus')
const rollOutSection = document.querySelector('#rollOutSection')
const rollOutFld = document.querySelector('#rollOut')
const maxDiffFld = document.querySelector('#maxDiff')
const tyreWidthSection = document.querySelector('#tyreWidthSection')
const tyreWidthFld = document.querySelector('#tyreWidth')
const rimTypeSection = document.querySelector('#rimTypeSection')
const rimTypeFld = document.querySelector('#rimType')
const minMaxCheckBox = document.querySelector('#minMaxCheckBox')
const minMaxSection = document.querySelector('#minMaxSection')
const minChainRingFld = document.querySelector('#minChainRing')
const maxChainRingFld = document.querySelector('#maxChainRing')
const minCogFld = document.querySelector('#minCog')
const maxCogFld = document.querySelector('#maxCog')
const messageOne = document.querySelector('#message-1')
const outputText = document.querySelector('#outputText')
const outputTable = document.querySelector('#outputTable')

rollOutSection.style.display = 'none'
tyreWidthSection.style.display = 'none'
rimTypeSection.style.display = 'none'
minMaxSection.style.display = 'none'
messageOne.style.display = 'none'
outputText.style.display = 'none'
outputTable.style.display = 'none'

findGearForm.addEventListener('submit', (e) => {
    e.preventDefault()

    messageOne.style.display = 'block'
    messageOne.style.color = '#333456'   
    messageOne.textContent = 'Loading...'
    outputText.style.display = 'none'    
    outputTable.style.display = 'none'    

    const findFor = findForSelect.value
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
                    messageOne.textContent = 'Your gear options...'
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

        fetch(url).then((response) => {
            response.json().then((gearOptions) => {
                if (gearOptions.error) {
                    var errorStr = gearOptions.error + '.'
                    errorStr = errorStr.replace('rollOut', 'Roll Out')
                    errorStr = errorStr.replace('maxDiff', 'Within')
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
                    messageOne.textContent = 'Your gear options...'
                    outputTable.style.display = 'block'
                    outputTable.innerHTML = ""
                    outputTable.appendChild(buildOutputTable(findFor, gearOptions))
                    // outputText.style.display = 'block'
                    // outputText.textContent = JSON.stringify(gearOptions)
                }
            })
        })            
    }
})

findGearForm.addEventListener('input', (e) => {
    messageOne.style.display = 'none'
    outputText.style.display = 'none'
    outputTable.style.display = 'none'    
})

minMaxCheckBox.addEventListener('input', (e) => {
    if (minMaxCheckBox.checked === true) {
        minMaxSection.style.display = 'block'
    } else {
        minMaxSection.style.display = 'none'
    }
})

findForSelect.addEventListener('change', (e) => {
    if (findForSelect.value === 'gearInches') {
        rollOut.value = ''
        tyreWidth.value = ''
        gearInchesSection.style.display = 'block'
        rollOutSection.style.display = 'none'
        tyreWidthSection.style.display = 'none'
        rimTypeSection.style.display = 'none'
    } else if (findForSelect.value === 'rollOut') {
        gearInches.value = ''
        gearInchesSection.style.display = 'none'
        rollOutSection.style.display = 'block'
        tyreWidthSection.style.display = 'block'
        rimTypeSection.style.display = 'block'
    }
})

const buildOutputTable = (findFor, gearOptions) => {
    var table = document.createElement('table')
    // table.className = "output-table"

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
            let gearCell = tr.insertCell(-1)
            gearCell.innerHTML = gearOption.chainRing + ' x ' + gearOption.cog
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
            let gearCell = tr.insertCell(-1)
            gearCell.innerHTML = gearOption.chainRing + ' x ' + gearOption.cog
            let rollOutCell = tr.insertCell(-1)
            let rawValue = (gearOption.rollOut / 1000)
            rollOutCell.innerHTML = round(rawValue, 3) + ' m'
            let gearInchesCell = tr.insertCell(-1)
            rawValue = gearOption.gearInches
            gearInchesCell.innerHTML = round(rawValue, 3)
        }
    }

    return table
}

// Utilities

const round = (value, places) => {
    const rounder = Math.pow(10, places)
    return Math.round(value * rounder) / rounder
}
