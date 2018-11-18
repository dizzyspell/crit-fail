var createError = require('http-errors')

const errorCodes = ['404', '400', '403', '500']

let error = {}
errorCodes.forEach( (code) => {
    error['_'+code] = (condition, next, message) => {
        if (condition) next({status: code, body: createError(code, message)})
        return condition
    }
})

const successCodes = ['200', '201']

let respond = {}
successCodes.forEach( (code) => {
    respond['_'+code] = (message, next) => {
        next({status: code, body: message})
    }
})

module.exports = {error, respond}