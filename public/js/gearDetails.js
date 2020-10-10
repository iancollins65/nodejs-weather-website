const gearDetailsForm = document.querySelector('form')
const chainRingFld = document.querySelector('#chainRing')
const cogFld = document.querySelector('#cog')
const messageOne = document.querySelector('#message-1')
const gearDataTable = document.querySelector('#gearData')
const gearRatioCell = document.querySelector('#gearRatio')
const gearInchesCell = document.querySelector('#gearInches')
const rollOutCell = document.querySelector('#rollOut')

gearDetailsForm.addEventListener('submit', (e) => {
    e.preventDefault()

    messageOne.style.color = '#333456'   
    messageOne.textContent = 'Loading...'
    gearRatioCell.textContent = ''
    gearInchesCell.textContent = ''
    rollOutCell.textContent = ''
    
    const chainRing = chainRingFld.value
    const cog = cogFld.value
    const url = '/gearInfo?chainRing=' + chainRing + '&cog=' + cog

    fetch(url).then((response) => {
        response.json().then(({ error, gearRatio, gearInches, rollOut }) => {
            if (error) {
                var errorStr = error + '.'
                errorStr = errorStr.replace('chainRing', 'Chain Ring')
                errorStr = errorStr.replace('cog', 'Cog')
                messageOne.style.color = 'red'
                messageOne.textContent = errorStr
            } else {
                messageOne.textContent = 'Your gear details...'
                gearRatioCell.textContent = Math.round(gearRatio * 1000) / 1000
                gearInchesCell.textContent = Math.round(gearInches * 1000) / 1000
                rollOutCell.textContent = Math.round(rollOut) / 1000 + ' m'
            }
        })
    })
})