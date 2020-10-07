const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=977126f1d7f4b5ba413d284bde1eb339&query=' + latitude + ',' + longitude + '&units=m'

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service.', undefined)
        } else if (body.error) {
            callback('Unable to find location.', undefined)
        } else {
            callback(undefined, body.current.weather_descriptions[0] + '. It is currently ' + body.current.temperature + ' degrees outside. It feels like ' + body.current.feelslike + ' degrees, with wind speed and direction of ' + body.current.wind_speed + ' km/h ' + body.current.wind_dir + ' and humidity of ' + body.current.humidity + '%.')
        }
    })
}

module.exports = forecast