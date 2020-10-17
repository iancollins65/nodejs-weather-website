const findGearForm = document.querySelector('form')
// const chainRingFld = document.querySelector('#chainRing')
// const cogFld = document.querySelector('#cog')
const findForSelect = document.querySelector('#findFor')
const gearInchesSection = document.querySelector('#gearInchesSection')
const gearInchesFld = document.querySelector('#gearInches')
const rollOutSection = document.querySelector('#rollOutSection')
const rollOutFld = document.querySelector('#rollOut')
const tyreWidthSection = document.querySelector('#tyreWidthSection')
const tyreWidthFld = document.querySelector('#tyreWidth')
const rimTypeSection = document.querySelector('#rimTypeSection')
const rimTypeFld = document.querySelector('#rimType')
const messageOne = document.querySelector('#message-1')
const outputText = document.querySelector('#outputText')
const outputTable = document.querySelector('#outputTable')

rollOutSection.style.display = 'none'
tyreWidthSection.style.display = 'none'
rimTypeSection.style.display = 'none'
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
        var url = '/gearInchesOptions?gearInches=' + gearInches
        fetch(url).then((response) => {
            response.json().then((gearOptions) => {
                if (gearOptions.error) {
                    var errorStr = gearOptions.error + '.'
                    errorStr = errorStr.replace('gearInches', 'Gear Inches')
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
        const tyreWidth = tyreWidthFld.value
        const rimType = rimTypeFld.value
        var url = '/rollOutOptions?rollOut=' + rollOut + '&rimType=' + rimType
        if (tyreWidth !== '') {
            url = url + '&tyreWidth=' + tyreWidth
        }
        fetch(url).then((response) => {
            response.json().then((gearOptions) => {
                if (gearOptions.error) {
                    var errorStr = gearOptions.error + '.'
                    errorStr = errorStr.replace('rollOut', 'Roll Out')
                    errorStr = errorStr.replace('tyreWidth', 'Tyre Width')
                    errorStr = errorStr.replace('rimType', 'Rim Type')
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
    var table = document.createElement("table")
    // table.className = "output-table"

    // Create header row
    var tr = table.insertRow(-1)
    var th = document.createElement("th")
    th.innerHTML = "Gear"
    tr.appendChild(th)
    th = document.createElement("th")
    th.innerHTML = (findFor === 'gearInches') ? "Gear Inches" : "Roll Out"
    tr.appendChild(th)

    // Data rows
    for (gearOption of gearOptions) {
        var tr = table.insertRow(-1)
        var gearCell = tr.insertCell(-1)
        gearCell.innerHTML = gearOption.chainRing + ' x ' + gearOption.cog
        var valueCell = tr.insertCell(-1)
        let rawValue = (findFor === 'gearInches') ? gearOption.gearInches : (gearOption.rollOut / 1000)
        valueCell.innerHTML = round(rawValue, 3) + ((findFor === 'rollOut') ? ' m' : '')
    }

    return table
}

// Utilities

const round = (value, places) => {
    const rounder = Math.pow(10, places)
    return Math.round(value * rounder) / rounder
}
