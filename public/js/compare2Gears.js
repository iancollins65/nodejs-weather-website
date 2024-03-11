const gearDetailsForm = document.querySelector('form')
const measureSelect = document.querySelector('#measure')
const measureHiddenFld = document.querySelector('#measureHidden')
const circumfranceApproachSelect = document.querySelector('#circumfranceApproach')
const circumfranceApproachHiddenFld = document.querySelector('#circumfranceApproachHidden')
const chainRing1Fld = document.querySelector('#chainRing1')
const cog1Fld = document.querySelector('#cog1')
const chainRing2Fld = document.querySelector('#chainRing2')
const cog2Fld = document.querySelector('#cog2')
const tyreWidthSection = document.querySelector('#tyreWidthSection')
const tyreWidth1Fld = document.querySelector('#tyreWidth1')
const tyreWidth2Fld = document.querySelector('#tyreWidth2')
const rimTypeSection = document.querySelector('#rimTypeSection')
const rimType1Fld = document.querySelector('#rimType1')
const rimType2Fld = document.querySelector('#rimType2')
const rimType1HiddenFld = document.querySelector('#rimType1Hidden')
const rimType2HiddenFld = document.querySelector('#rimType2Hidden')
const measuredCircumfranceSection = document.querySelector('#measuredCircumfranceSection')
const measuredCircumfrance1Fld = document.querySelector('#measuredCircumfrance1')
const measuredCircumfrance2Fld = document.querySelector('#measuredCircumfrance2')
const crankLength1Fld = document.querySelector('#crankLength1')
const crankLength2Fld = document.querySelector('#crankLength2')
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

measuredCircumfranceSection.style.display = 'none'
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
    const circumfranceApproach = circumfranceApproachSelect.value
    const chainRing1 = chainRing1Fld.value
    const cog1 = cog1Fld.value
    const chainRing2 = chainRing2Fld.value
    const cog2 = cog2Fld.value
    const tyreWidth1 = tyreWidth1Fld.value
    const tyreWidth2 = tyreWidth2Fld.value
    const rimType1 = rimType1Fld.value
    const rimType2 = rimType2Fld.value
    const measuredCircumfrance1 = measuredCircumfrance1Fld.value
    const measuredCircumfrance2 = measuredCircumfrance2Fld.value
    const crankLength1 = crankLength1Fld.value
    const crankLength2 = crankLength2Fld.value
    const speed = speedFld.value
    const cadence = cadenceFld.value
    const lapTime = lapTimeFld.value
    const lapLength = lapLengthFld.value
    setCookie('measure', measure, 1)
    setCookie('circumfranceApproach', circumfranceApproach, 1)
    setCookie('chainRing1', chainRing1, 1)
    setCookie('cog1', cog1, 1)
    setCookie('chainRing2', chainRing2, 1)
    setCookie('cog2', cog2, 1)
    setCookie('rimType1', rimType1, 1)
    setCookie('rimType2', rimType2, 1)
    var url = '/comp2GearsFull?chainRing1=' + chainRing1 + '&cog1=' + cog1 
        + '&chainRing2=' + chainRing2 + '&cog2=' + cog2 + '&rimType1=' + rimType1 + '&rimType2=' + rimType2 
        + '&measure=' + measure + '&circumfranceApproach=' + circumfranceApproach

    if (circumfranceApproach === 'estimated' && tyreWidth1 !== '') {
        url = url + '&tyreWidth1=' + tyreWidth1
        setCookie('tyreWidth1', tyreWidth1, 1)
    }
    if (circumfranceApproach === 'estimated' && tyreWidth2 !== '') {
        url = url + '&tyreWidth2=' + tyreWidth2
        setCookie('tyreWidth2', tyreWidth2, 1)
    }
    if (circumfranceApproach === 'measured' && measuredCircumfrance1 !== '') {
        url = url + '&measuredCircumfrance1=' + measuredCircumfrance1
        setCookie('measuredCircumfrance1', measuredCircumfrance1, 1)
    }
    if (circumfranceApproach === 'measured' && measuredCircumfrance2 !== '') {
        url = url + '&measuredCircumfrance2=' + measuredCircumfrance2
        setCookie('measuredCircumfrance2', measuredCircumfrance2, 1)
    }
    
    if (crankLength1 !== '') {
        url = url + '&crankLength1=' + crankLength1
        setCookie('crankLength1', crankLength1, 1)
    }
    if (crankLength2 !== '') {
        url = url + '&crankLength2=' + crankLength2
        setCookie('crankLength2', crankLength2, 1)
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
        response.json().then(({ error, gear1, gear2 }) => {
            if (error) {
                var errorStr = error + '.'
                errorStr = errorStr.replace('chainRing1', 'Chain Ring 1')
                errorStr = errorStr.replace('chainRing2', 'Chain Ring 2')
                errorStr = errorStr.replace('cog1', 'Cog 1')
                errorStr = errorStr.replace('cog2', 'Cog 2')
                errorStr = errorStr.replace('tyreWidth1', 'Tyre Width 1')
                errorStr = errorStr.replace('tyreWidth2', 'Tyre Width 2')
                errorStr = errorStr.replace('rimType1', 'Rim Type 1')
                errorStr = errorStr.replace('rimType2', 'Rim Type 2')
                errorStr = errorStr.replace('crankLength1', 'Cranks 1')
                errorStr = errorStr.replace('crankLength2', 'Cranks 2')
                errorStr = errorStr.replace('speed', 'Speed')
                errorStr = errorStr.replace('cadence', 'Cadence')
                errorStr = errorStr.replace('lapTime', 'Lap Time')
                errorStr = errorStr.replace('lapLength', 'Lap Length')
                errorStr = errorStr.replace('measure', 'Measure')
                errorStr = errorStr.replace('circumfranceApproach', 'Circumfrance Approach')
                errorStr = errorStr.replace('measuredCircumfrance1', 'Measured Circumfrance 1')
                errorStr = errorStr.replace('measuredCircumfrance2', 'Measured Circumfrance 2')
                messageOne.style.color = 'red'
                messageOne.textContent = errorStr
                outputTable.style.display = 'none'
            } else {
                messageOne.textContent = 'Your gear details...'
                outputTable.style.display = 'block'
                outputTable.innerHTML = ""
                outputTable.appendChild(buildOutputTable(gear1, gear2))
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
    while (rimType1Fld.options.length > 1) {
        rimType1Fld.remove(1);
    }
    while (rimType2Fld.options.length > 1) {
        rimType2Fld.remove(1);
    }
    const rimTypeOptionsList = rimTypeOptionsListHiddenFld.value
    const rimTypeOptions = rimTypeOptionsList.split(',')
    const rimTypeDescriptionsList = rimTypeDescriptionsListHiddenFld.value
    const rimTypeDescriptions = rimTypeDescriptionsList.split(',')
    for (let i = 1; i < rimTypeOptions.length; i++) {
        const option1 = document.createElement('option')
        const option2 = document.createElement('option')
        const desc = rimTypeDescriptions[i].replace(/_/g, ' ')
        const text1 = document.createTextNode(desc)
        const text2 = document.createTextNode(desc)
        option1.appendChild(text1)
        option2.appendChild(text2)
        option1.setAttribute('value', rimTypeOptions[i])
        option2.setAttribute('value', rimTypeOptions[i])
        rimType1Fld.appendChild(option1)
        rimType2Fld.appendChild(option2)
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

const insert3HeadingsRow = (table, heading1, heading2, heading3) => {
    let tr = table.insertRow(-1)
    let th = document.createElement('th')
    th.innerHTML = heading1
    tr.appendChild(th)
    th = document.createElement('th')
    th.innerHTML = heading2
    tr.appendChild(th)
    th = document.createElement('th')
    th.innerHTML = heading3
    tr.appendChild(th)
}

const insertHeadingValueRow = (table, heading, value, value2, link = false, rawValue = 0, rawValue2 = 0, otherValue1 = 0, otherValue2 = 0) => {
    let tr = table.insertRow(-1)
    let th = document.createElement('th')
    th.innerHTML = heading
    tr.appendChild(th)
    let tc = tr.insertCell(-1)
    let tc2 = tr.insertCell(-1)
    if (link === false) {
        tc.innerHTML = value
        tc2.innerHTML = value2
    } else {
        let a = document.createElement('A')
        let a2 = document.createElement('A')
        let urlPrefix = '/findGear?findFor='
        const measure = measureSelect.value
        const tyreWidth1 = tyreWidth1Fld.value
        const tyreWidth2 = tyreWidth2Fld.value
        const rimType1 = rimType1Fld.value
        const rimType2 = rimType2Fld.value
        const circumfranceApproach = circumfranceApproachSelect.value
        const measuredCircumfrance1 = measuredCircumfrance1Fld.value
        const measuredCircumfrance2 = measuredCircumfrance2Fld.value
        if (heading === 'Gear Ratio') {
            a.text = value
            a.title = 'Find other gears for Gear Ratio close to ' + value
            a.href = urlPrefix + 'gearRatio&gearRatio=' + value + '&measure=' + measure
            a2.text = value2
            a2.title = 'Find other gears for Gear Ratio close to ' + value2
            a2.href = urlPrefix + 'gearRatio&gearRatio=' + value2 + '&measure=' + measure
        } else if (heading === 'Gear Inches (27)') {
            a.text = value
            a.title = 'Find other gears for Gear Inches close to ' + value
            a.href = urlPrefix + 'gearInches&gearInches=' + value + '&measure=' + measure
            a2.text = value2
            a2.title = 'Find other gears for Gear Inches close to ' + value2
            a2.href = urlPrefix + 'gearInches&gearInches=' + value2 + '&measure=' + measure
        } else if (heading === 'True Gear Inches') {
            let url = urlPrefix + 'trueGearInches&trueGearInches=' + value + '&measure=' + measure
            let url2 = urlPrefix + 'trueGearInches&trueGearInches=' + value2 + '&measure=' + measure
            url = url + '&circumfranceApproach=' + circumfranceApproach
            if (circumfranceApproach === 'estimated') {
                if (tyreWidth1 !== '') {
                    url = url + '&tyreWidth=' + tyreWidth1
                }
                url = url + '&rimType=' + rimType1
            } else if (circumfranceApproach === 'measured') {
                if (measuredCircumfrance1 !== '') {
                    url = url + '&measuredCircumfrance=' + measuredCircumfrance1
                }
            }
            url2 = url2 + '&circumfranceApproach=' + circumfranceApproach
            if (circumfranceApproach === 'estimated') {
                if (tyreWidth2 !== '') {
                    url2 = url2 + '&tyreWidth=' + tyreWidth2
                }
                url2 = url2 + '&rimType=' + rimType2
            } else if (circumfranceApproach === 'measured') {
                if (measuredCircumfrance2 !== '') {
                    url2 = url2 + '&measuredCircumfrance=' + measuredCircumfrance2
                }
            }
            a.text = value
            a.title = 'Find other gears for True Gear Inches close to ' + value
            a.href = url
            a2.text = value2
            a2.title = 'Find other gears for True Gear Inches close to ' + value2
            a2.href = url2
        } else if (heading === 'Gain Ratio') {
            const crankLength1 = crankLength1Fld.value
            const crankLength2 = crankLength2Fld.value
            let url = urlPrefix + 'gainRatio&gainRatio=' + value + '&measure=' + measure
            let url2 = urlPrefix + 'gainRatio&gainRatio=' + value2 + '&measure=' + measure
            url = url + '&circumfranceApproach=' + circumfranceApproach
            if (circumfranceApproach === 'estimated') {
                if (tyreWidth1 !== '') {
                    url = url + '&tyreWidth=' + tyreWidth1
                }
                url = url + '&rimType=' + rimType1
            } else if (circumfranceApproach === 'measured') {
                if (measuredCircumfrance1 !== '') {
                    url = url + '&measuredCircumfrance=' + measuredCircumfrance1
                }
            }
            url2 = url2 + '&circumfranceApproach=' + circumfranceApproach
            if (circumfranceApproach === 'estimated') {
                if (tyreWidth2 !== '') {
                    url2 = url2 + '&tyreWidth=' + tyreWidth2
                }
                url2 = url2 + '&rimType=' + rimType2
            } else if (circumfranceApproach === 'measured') {
                if (measuredCircumfrance2 !== '') {
                    url2 = url2 + '&measuredCircumfrance=' + measuredCircumfrance2
                }
            }
            if (crankLength1 !== '') {
                url = url + '&crankLength=' + crankLength1
            }
            if (crankLength2 !== '') {
                url2 = url2 + '&crankLength=' + crankLength2
            }
            a.text = value
            a.title = 'Find other gears for Gain Ratio close to ' + value
            a.href = url
            a2.text = value2
            a2.title = 'Find other gears for Gain Ratio close to ' + value2
            a2.href = url2
        } else if (heading === 'Roll Out (approx)') {
            let url = urlPrefix + 'rollOut&rollOut=' + rawValue + '&measure=' + measure
            let url2 = urlPrefix + 'rollOut&rollOut=' + rawValue2 + '&measure=' + measure
            url = url + '&circumfranceApproach=' + circumfranceApproach
            if (circumfranceApproach === 'estimated') {
                if (tyreWidth1 !== '') {
                    url = url + '&tyreWidth=' + tyreWidth1
                }
                url = url + '&rimType=' + rimType1
            } else if (circumfranceApproach === 'measured') {
                if (measuredCircumfrance1 !== '') {
                    url = url + '&measuredCircumfrance=' + measuredCircumfrance1
                }
            }
            url2 = url2 + '&circumfranceApproach=' + circumfranceApproach
            if (circumfranceApproach === 'estimated') {
                if (tyreWidth2 !== '') {
                    url2 = url2 + '&tyreWidth=' + tyreWidth2
                }
                url2 = url2 + '&rimType=' + rimType2
            } else if (circumfranceApproach === 'measured') {
                if (measuredCircumfrance2 !== '') {
                    url2 = url2 + '&measuredCircumfrance=' + measuredCircumfrance2
                }
            }
            a.text = value
            a.title = 'Find other gears for Roll Out of ' + rawValue + ' or below'
            a.href = url
            a2.text = value2
            a2.title = 'Find other gears for Roll Out of ' + rawValue2 + ' or below'
            a2.href = url2
        } else if (heading === 'Speed') {
            let extras = extrasSelect.value
            let fixed = 'speed'
            if (extras === 'speed') {
                fixed = 'cadence'
            }
            const tyreWidth1 = tyreWidth1Fld.value
            const tyreWidth2 = tyreWidth2Fld.value
            const rimType1 = rimType1Fld.value
            const rimType2 = rimType2Fld.value
            let url = urlPrefix + 'speedCadence&speed=' + rawValue + '&cadence=' + otherValue1 
                + '&fixed=' + fixed + '&measure=' + measure
            let url2 = urlPrefix + 'speedCadence&speed=' + rawValue2 + '&cadence=' + otherValue2 
                + '&fixed=' + fixed + '&measure=' + measure
            url = url + '&circumfranceApproach=' + circumfranceApproach
            if (circumfranceApproach === 'estimated') {
                if (tyreWidth1 !== '') {
                    url = url + '&tyreWidth=' + tyreWidth1
                }
                url = url + '&rimType=' + rimType1
            } else if (circumfranceApproach === 'measured') {
                if (measuredCircumfrance1 !== '') {
                    url = url + '&measuredCircumfrance=' + measuredCircumfrance1
                }
            }
            url2 = url2 + '&circumfranceApproach=' + circumfranceApproach
            if (circumfranceApproach === 'estimated') {
                if (tyreWidth2 !== '') {
                    url2 = url2 + '&tyreWidth=' + tyreWidth2
                }
                url2 = url2 + '&rimType=' + rimType2
            } else if (circumfranceApproach === 'measured') {
                if (measuredCircumfrance2 !== '') {
                    url2 = url2 + '&measuredCircumfrance=' + measuredCircumfrance2
                }
            }
            a.text = value
            a.title = 'Find other gears for speed of ' + rawValue + ' and cadence of ' + otherValue1
            a.href = url
            a2.text = value2
            a2.title = 'Find other gears for speed of ' + rawValue2 + ' and cadence of ' + otherValue2
            a2.href = url2
        } else if (heading === 'Cadence') {
            let extras = extrasSelect.value
            let fixed = 'speed'
            if (extras === 'speed') {
                fixed = 'cadence'
            }
            const tyreWidth1 = tyreWidth1Fld.value
            const tyreWidth2 = tyreWidth2Fld.value
            const rimType1 = rimType1Fld.value
            const rimType2 = rimType2Fld.value
            let url = urlPrefix + 'speedCadence&speed=' + otherValue1 + '&cadence=' + rawValue 
                + '&fixed=' + fixed + '&measure=' + measure
            let url2 = urlPrefix + 'speedCadence&speed=' + otherValue2 + '&cadence=' + rawValue2
                + '&fixed=' + fixed + '&measure=' + measure
            url = url + '&circumfranceApproach=' + circumfranceApproach
            if (circumfranceApproach === 'estimated') {
                if (tyreWidth1 !== '') {
                    url = url + '&tyreWidth=' + tyreWidth1
                }
                url = url + '&rimType=' + rimType1
            } else if (circumfranceApproach === 'measured') {
                if (measuredCircumfrance1 !== '') {
                    url = url + '&measuredCircumfrance=' + measuredCircumfrance1
                }
            }
            url2 = url2 + '&circumfranceApproach=' + circumfranceApproach
            if (circumfranceApproach === 'estimated') {
                if (tyreWidth2 !== '') {
                    url2 = url2 + '&tyreWidth=' + tyreWidth2
                }
                url2 = url2 + '&rimType=' + rimType2
            } else if (circumfranceApproach === 'measured') {
                if (measuredCircumfrance2 !== '') {
                    url2 = url2 + '&measuredCircumfrance=' + measuredCircumfrance2
                }
            }
            a.text = value
            a.title = 'Find other gears for cadence of ' + rawValue + ' and speed of ' + otherValue1
            a.href = url
            a2.text = value2
            a2.title = 'Find other gears for cadence of ' + rawValue2 + ' and speed of ' + otherValue2
            a2.href = url2
        } else if (heading === 'Lap Time') {
            const tyreWidth1 = tyreWidth1Fld.value
            const tyreWidth2 = tyreWidth2Fld.value
            const rimType1 = rimType1Fld.value
            const rimType2 = rimType2Fld.value
            const lapLength = lapLengthFld.value
            let url = urlPrefix + 'lapTimeCadence&lapTime=' + rawValue + '&cadence=' + otherValue1 
                + '&lapLength=' + lapLength + '&measure=' + measure
            let url2 = urlPrefix + 'lapTimeCadence&lapTime=' + rawValue2 + '&cadence=' + otherValue2 
                + '&lapLength=' + lapLength + '&measure=' + measure
            url = url + '&circumfranceApproach=' + circumfranceApproach
            if (circumfranceApproach === 'estimated') {
                if (tyreWidth1 !== '') {
                    url = url + '&tyreWidth=' + tyreWidth1
                }
                url = url + '&rimType=' + rimType1
            } else if (circumfranceApproach === 'measured') {
                if (measuredCircumfrance1 !== '') {
                    url = url + '&measuredCircumfrance=' + measuredCircumfrance1
                }
            }
            url2 = url2 + '&circumfranceApproach=' + circumfranceApproach
            if (circumfranceApproach === 'estimated') {
                if (tyreWidth2 !== '') {
                    url2 = url2 + '&tyreWidth=' + tyreWidth2
                }
                url2 = url2 + '&rimType=' + rimType2
            } else if (circumfranceApproach === 'measured') {
                if (measuredCircumfrance2 !== '') {
                    url2 = url2 + '&measuredCircumfrance=' + measuredCircumfrance2
                }
            }
            a.text = value
            a.title = 'Find other gears for lap time of ' + rawValue + ' and cadence of ' + otherValue1
            a.href = url
            a2.text = value2
            a2.title = 'Find other gears for lap time of ' + rawValue2 + ' and cadence of ' + otherValue2
            a2.href = url2
        }
        tc.appendChild(a)
        tc2.appendChild(a2)
    }
}

// Output table

const buildOutputTable = (gear1, gear2) => {
    // Build the table
    var table = document.createElement('table')

    var mOrInches = undefined
    var kmOrMi = undefined
    if (gear1.measure === 'imperial') {
        mOrInches = ' in'
        kmOrMi = ' mph'
    } else { // 'metric'
        mOrInches = ' m'
        kmOrMi = ' km/h'
    }

    // Table contents
    insert3HeadingsRow(table, 'Gears', gear1.chainRing + ' x ' + gear1.cog, gear2.chainRing + ' x ' + gear2.cog)
    insertHeadingValueRow(table, 'Gear Ratio', round(gear1.gearRatio, 3), round(gear2.gearRatio, 3), true)
    insertHeadingValueRow(table, 'Gear Inches (27)', round(gear1.gearInches, 3), round(gear2.gearInches, 3), true)
    insertHeadingValueRow(table, 'True Gear Inches', round(gear1.trueGearInches, 3), round(gear2.trueGearInches, 3), true)
    insertHeadingValueRow(table, 'Gain Ratio', round(gear1.gainRatio, 3), round(gear2.gainRatio, 3), true)
    var rollOutDisplay1 = undefined
    var rollOutRaw1 = undefined
    var rollOutDisplay2 = undefined
    var rollOutRaw2 = undefined
    if (gear1.measure === 'imperial') {
        rollOutDisplay1 = round(gear1.rollOut, 3)
        rollOutRaw1 = roundUp(gear1.rollOut, 3)
        rollOutDisplay2 = round(gear2.rollOut, 3)
        rollOutRaw2 = roundUp(gear2.rollOut, 3)
    } else { // 'metric'
        rollOutDisplay1 = round(gear1.rollOut / 1000, 3)
        rollOutRaw1 = roundUp(gear1.rollOut / 1000, 3)
        rollOutDisplay2 = round(gear2.rollOut / 1000, 3)
        rollOutRaw2 = roundUp(gear2.rollOut / 1000, 3)
    }
    insertHeadingValueRow(table, 'Roll Out (approx)', rollOutDisplay1 + mOrInches, 
        rollOutDisplay2 + mOrInches, true, rollOutRaw1, rollOutRaw2)
    if (gear1.speed) {
        insertHeadingValueRow(table, 'Speed', round(gear1.speed, 3) + kmOrMi, round(gear2.speed, 3) + kmOrMi, 
            true, gear1.speed, gear2.speed, gear1.cadence, gear2.cadence)
    }
    if (gear1.cadence) {
        insertHeadingValueRow(table, 'Cadence', round(gear1.cadence, 3) + ' rpm', round(gear2.cadence, 3) + ' rpm', 
            true, gear1.cadence, gear2.cadence, gear1.speed, gear2.speed)
    }
    if (gear1.lapTime) {
        insertHeadingValueRow(table, 'Lap Time', round(gear1.lapTime, 3) + ' sec', round(gear2.lapTime, 3) + ' sec', 
            true, gear1.lapTime, gear2.lapTime, gear1.cadence, gear2.cadence)
    }
    if (gear1.lapPedalCount) {
        insertHeadingValueRow(table, 'Lap Pedal Count', round(gear1.lapPedalCount, 3), round(gear2.lapPedalCount, 3))
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

    if (circumfranceApproachHiddenFld.value !== '') {
        circumfranceApproachSelect.value = circumfranceApproachHiddenFld.value
    } else {
        const circumfranceApproachCookie = getCookie('circumfranceApproach')
        if (circumfranceApproachCookie !== '') {
            circumfranceApproachSelect.value = circumfranceApproachCookie
        }
    }

    actOnCircumfranceApproachSelect()

    if (rimType1HiddenFld.value !== '') {
        rimType1Fld.value = rimType1HiddenFld.value
    } else {
        const rimType1Cookie = getCookie('rimType1')
        if (rimType1Cookie !== '') {
            rimType1Fld.value = rimType1Cookie
        }
    }
    
    if (rimType2HiddenFld.value !== '') {
        rimType2Fld.value = rimType2HiddenFld.value
    } else {
        const rimType2Cookie = getCookie('rimType2')
        if (rimType2Cookie !== '') {
            rimType2Fld.value = rimType2Cookie
        }
    }
    
    setFieldFromCookieIfBlank(chainRing1Fld, 'chainRing1')
    setFieldFromCookieIfBlank(cog1Fld, 'cog1')
    setFieldFromCookieIfBlank(chainRing1Fld, 'chainRing')
    setFieldFromCookieIfBlank(cog1Fld, 'cog')
    setFieldFromCookieIfBlank(chainRing2Fld, 'chainRing2')
    setFieldFromCookieIfBlank(cog2Fld, 'cog2')
    setFieldFromCookieIfBlank(tyreWidth1Fld, 'tyreWidth1')
    setFieldFromCookieIfBlank(tyreWidth2Fld, 'tyreWidth2')
    setFieldFromCookieIfBlank(tyreWidth1Fld, 'tyreWidth')
    setFieldFromCookieIfBlank(tyreWidth2Fld, 'tyreWidth')
    setFieldFromCookieIfBlank(measuredCircumfrance1Fld, 'measuredCircumfrance1')
    setFieldFromCookieIfBlank(measuredCircumfrance2Fld, 'measuredCircumfrance2')
    setFieldFromCookieIfBlank(measuredCircumfrance1Fld, 'measuredCircumfrance')
    setFieldFromCookieIfBlank(measuredCircumfrance2Fld, 'measuredCircumfrance')
    setFieldFromCookieIfBlank(crankLength1Fld, 'crankLength1')
    setFieldFromCookieIfBlank(crankLength2Fld, 'crankLength2')
    setFieldFromCookieIfBlank(crankLength1Fld, 'crankLength')
    setFieldFromCookieIfBlank(crankLength2Fld, 'crankLength')
    
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
    
    if (chainRing1Fld.value !== '' && cog1Fld.value !== '' && chainRing2Fld.value !== '' && cog2Fld.value !== '') {
        handleSubmit()
    }
}
